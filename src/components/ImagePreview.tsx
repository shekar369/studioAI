import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ImageIcon, Sparkles } from 'lucide-react';
import type { ImagePreviewProps } from '../types/ui.types';
import { formatFileSize } from '../utils/imageUtils';
import { fadeInUp } from '../utils/animations';

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  generatedImage,
  comparisonMode
}) => {
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      if (generatedImage.blob) {
        const url = URL.createObjectURL(generatedImage.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `studio-ai-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const link = document.createElement('a');
        link.href = generatedImage.url;
        link.download = `studio-ai-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try right-clicking the image and selecting "Save image as..."');
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          <ImageIcon className="w-4 h-4 mr-2 text-electric-purple-400" />
          Preview
        </h3>

        <AnimatePresence>
          {generatedImage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Area */}
      <div className="border-2 border-studio-700 rounded-2xl overflow-hidden bg-studio-900/50">
        <AnimatePresence mode="wait">
          {!originalImage && !generatedImage ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-96 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-studio-800 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-studio-600" />
              </div>
              <p className="text-lg text-studio-400">No image yet</p>
              <p className="text-sm mt-1 text-studio-500">Upload an image to get started</p>
            </motion.div>
          ) : (
            <div className="relative">
              {comparisonMode === 'side-by-side' && originalImage && generatedImage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-4 p-4"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-studio-400 text-center font-medium">Original</p>
                    <div className="relative rounded-xl overflow-hidden border border-studio-700">
                      <img
                        src={originalImage.preview}
                        alt="Original"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-electric-purple-400 text-center font-medium">Generated</p>
                    <div className="relative rounded-xl overflow-hidden border border-electric-purple-500/50">
                      <img
                        src={generatedImage.url}
                        alt="Generated"
                        className="w-full h-auto"
                        onError={() => {
                          console.error('Image load error - Generated image details:', generatedImage);
                        }}
                      />
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 ring-1 ring-inset ring-electric-purple-500/20 rounded-xl pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4"
                >
                  <div className="relative rounded-xl overflow-hidden border border-studio-700 group">
                    <img
                      src={generatedImage.url}
                      alt="Generated"
                      className="w-full h-auto"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-studio-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 p-4 bg-studio-800/50 rounded-xl border border-studio-700">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between items-center p-2 bg-studio-900/50 rounded-lg">
                        <span className="text-studio-400">Resolution</span>
                        <span className="font-medium text-gray-300">
                          {generatedImage.width} × {generatedImage.height}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-studio-900/50 rounded-lg">
                        <span className="text-studio-400">Model</span>
                        <span className="font-medium text-electric-purple-400">
                          {generatedImage.metadata.model}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-studio-900/50 rounded-lg">
                        <span className="text-studio-400">Steps</span>
                        <span className="font-medium text-gray-300">
                          {generatedImage.metadata.steps}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-studio-900/50 rounded-lg">
                        <span className="text-studio-400">API</span>
                        <span className="font-medium text-electric-blue-400">
                          {generatedImage.metadata.api}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : originalImage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4"
                >
                  <p className="text-xs text-studio-400 mb-2 text-center font-medium">Original Image</p>
                  <div className="relative rounded-xl overflow-hidden border border-studio-700">
                    <img
                      src={originalImage.preview}
                      alt="Original"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-xs text-studio-400 bg-studio-800 px-3 py-1.5 rounded-full">
                      {originalImage.width} × {originalImage.height} • {formatFileSize(originalImage.size)}
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
