import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import type { ImagePreviewProps } from '../types/ui.types';
import { formatFileSize } from '../utils/imageUtils';

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  generatedImage,
  comparisonMode
}) => {
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Preview</h3>

        {generatedImage && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        {!originalImage && !generatedImage ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="w-16 h-16 mb-4" />
            <p className="text-lg">No image yet</p>
            <p className="text-sm mt-1">Upload an image to get started</p>
          </div>
        ) : (
          <div className="relative">
            {comparisonMode === 'side-by-side' && originalImage && generatedImage ? (
              <div className="grid grid-cols-2 gap-2 p-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2 text-center">Original</p>
                  <img
                    src={originalImage.preview}
                    alt="Original"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2 text-center">Generated</p>
                  <img
                    src={generatedImage.url}
                    alt="Generated"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ) : generatedImage ? (
              <div className="p-4">
                <img
                  src={generatedImage.url}
                  alt="Generated"
                  className="w-full h-auto rounded-lg"
                />

                {/* Metadata */}
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Resolution:</span>
                      <span className="ml-2 font-medium">
                        {generatedImage.width} × {generatedImage.height}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <span className="ml-2 font-medium">
                        {generatedImage.metadata.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Steps:</span>
                      <span className="ml-2 font-medium">
                        {generatedImage.metadata.steps}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">API:</span>
                      <span className="ml-2 font-medium">
                        {generatedImage.metadata.api}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : originalImage ? (
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-2 text-center">Original Image</p>
                <img
                  src={originalImage.preview}
                  alt="Original"
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-2 text-center text-xs text-gray-500">
                  {originalImage.width} × {originalImage.height} • {formatFileSize(originalImage.size)}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
