import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import type { ImageUploaderProps } from '../types/ui.types';
import type { UploadedImage } from '../types/generation.types';
import { validateImageFile } from '../utils/validation';
import { getImageDimensions, createThumbnail, formatFileSize } from '../utils/imageUtils';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  maxFileSize,
  allowedFormats,
  multipleUpload
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File): Promise<UploadedImage | null> => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return null;
    }

    try {
      const dimensions = await getImageDimensions(file);
      const preview = await createThumbnail(file, 300);
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });

      const uploadedImage: UploadedImage = {
        id: `img-${Date.now()}-${Math.random()}`,
        file,
        blob,
        preview,
        width: dimensions.width,
        height: dimensions.height,
        size: file.size,
        format: file.type
      };

      return uploadedImage;
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process image');
      return null;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setIsProcessing(true);

    const filesToProcess = multipleUpload ? Array.from(files) : [files[0]];
    const processedImages: UploadedImage[] = [];

    for (const file of filesToProcess) {
      const processed = await processFile(file);
      if (processed) {
        processedImages.push(processed);
      }
    }

    if (processedImages.length > 0) {
      const newImages = [...uploadedImages, ...processedImages];
      setUploadedImages(newImages);
      onImagesUploaded(processedImages);
    }

    setIsProcessing(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (id: string) => {
    const newImages = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(newImages);
  };

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Upload Zone - Premium Dark Theme */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging
            ? 'border-electric-purple-500 bg-electric-purple-500/10 shadow-glow'
            : 'border-studio-600 hover:border-electric-purple-400 bg-studio-900/50 hover:bg-studio-800/50'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        animate={isDragging ? { borderColor: ['#7c3aed', '#3b82f6', '#7c3aed'] } : {}}
        transition={{ duration: 2, repeat: isDragging ? Infinity : 0 }}
      >
        {/* Animated Background Glow */}
        <div className={`
          absolute inset-0 opacity-0 transition-opacity duration-500
          ${isDragging ? 'opacity-100' : ''}
        `}>
          <div className="absolute inset-0 bg-gradient-radial from-electric-purple-500/20 via-transparent to-transparent" />
        </div>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={allowedFormats.join(',')}
          multiple={multipleUpload}
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <label htmlFor="file-upload" className="cursor-pointer relative z-10">
          <div className="flex flex-col items-center space-y-4">
            {/* Upload Icon with Animation */}
            <motion.div
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${isDragging
                  ? 'bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 shadow-glow'
                  : 'bg-studio-800 border border-studio-600'
                }
              `}
              animate={isDragging ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 1.5, repeat: isDragging ? Infinity : 0 }}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-electric-purple-400 animate-spin" />
              ) : (
                <Upload className={`w-10 h-10 transition-colors duration-300 ${
                  isDragging ? 'text-white' : 'text-studio-400'
                }`} />
              )}
            </motion.div>

            <div className="space-y-2">
              <p className={`text-lg font-semibold transition-colors duration-300 ${
                isDragging ? 'text-white' : 'text-gray-200'
              }`}>
                {isDragging ? 'Drop your image here' : 'Drop image or click to upload'}
              </p>
              <p className="text-sm text-studio-400">
                Supports JPG, PNG, WEBP, HEIC • Max {formatFileSize(maxFileSize)}
              </p>
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-electric-purple-400"
              >
                <div className="w-2 h-2 rounded-full bg-electric-purple-500 animate-pulse" />
                <span className="text-sm font-medium">Processing image...</span>
              </motion.div>
            )}
          </div>
        </label>
      </motion.div>

      {/* Error Message - Dark Theme */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-start backdrop-blur-sm"
          >
            <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Images Preview - Dark Theme */}
      <AnimatePresence>
        {uploadedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-300 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-electric-purple-400" />
              Uploaded Images
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {uploadedImages.map((image) => (
                <motion.div
                  key={image.id}
                  variants={staggerItem}
                  className="relative group rounded-xl overflow-hidden border border-studio-700 hover:border-electric-purple-500/50 transition-all duration-300 bg-studio-850"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)' }}
                >
                  <img
                    src={image.preview}
                    alt="Uploaded"
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Remove Button */}
                  <motion.button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-red-500 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-studio-950/90 backdrop-blur-sm text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-gray-300">{image.width} × {image.height}</p>
                    <p className="text-electric-purple-400">{formatFileSize(image.size)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
