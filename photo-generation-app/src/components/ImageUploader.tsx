import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { ImageUploaderProps } from '../types/ui.types';
import type { UploadedImage } from '../types/generation.types';
import { validateImageFile } from '../utils/validation';
import { getImageDimensions, createThumbnail, formatFileSize } from '../utils/imageUtils';

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
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return null;
    }

    try {
      // Get image dimensions
      const dimensions = await getImageDimensions(file);

      // Create preview
      const preview = await createThumbnail(file, 300);

      // Convert file to blob
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
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={allowedFormats.join(',')}
          multiple={multipleUpload}
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${isDragging ? 'bg-primary-500' : 'bg-gray-200'}
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-500'}`} />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'Drop your image here' : 'Drop image or click to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPG, PNG, WEBP, HEIC • Max {formatFileSize(maxFileSize)}
              </p>
            </div>

            {isProcessing && (
              <div className="text-primary-600 text-sm">Processing...</div>
            )}
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 transition-colors"
              >
                <img
                  src={image.preview}
                  alt="Uploaded"
                  className="w-full h-32 object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <p>{image.width} × {image.height}</p>
                  <p>{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
