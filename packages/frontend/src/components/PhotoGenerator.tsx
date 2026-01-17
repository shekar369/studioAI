import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Loader2, AlertCircle, Download, X, Camera, Wand2, Clock, Settings } from 'lucide-react';
import { getAPI } from '../services/api/apiFactory';
import { occasionTemplates } from '@/config/occasions';
import type { GeneratedImage } from '../types/api.types';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export default function PhotoGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<Blob | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('birthday');
  const [selectedAPI, setSelectedAPI] = useState('openai');

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setUploadedBlob(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // Generate photo
  const handleGenerate = async () => {
    if (!uploadedImage || !uploadedBlob) {
      setError('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let apiKey = localStorage.getItem(`api_key_${selectedAPI}`);

      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      }

      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        throw new Error(`${selectedAPI.toUpperCase()} API key not configured. Please add your key in Settings.`);
      }

      const occasion = occasionTemplates.find(o => o.id === selectedOccasion);
      if (!occasion) {
        throw new Error('Selected occasion not found');
      }

      const prompt = `Create an ultra-realistic ${occasion.name}-themed enhancement using the provided photo as the base image.

ABSOLUTE CONSTRAINTS (DO NOT VIOLATE):
- Preserve original facial identity exactly
- Same face shape, skin tone, age, gender, ethnicity
- No face swapping, no beautification
- No cartoon, painting, or illustration style
- Maintain natural skin texture and pores

Photography style:
- Professional DSLR portrait
- Cinematic but natural lighting
- High dynamic range
- Sharp facial details, realistic shadows

${occasion.name} theme:
${occasion.basePrompt}
- Subtle elegant elements
- Soft background effects only
- Premium, classy atmosphere
- No objects touching or covering the face`;

      const api = getAPI(selectedAPI);
      await api.authenticate(apiKey);

      const result = await api.generateImage({
        prompt,
        width: 1024,
        height: 1024,
        steps: 50,
        guidanceScale: 7,
        numImages: 1,
        quality: 'standard',
        modelId: 'gpt-image-1'
      }, uploadedBlob);

      setGeneratedImage(result);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download generated image
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      if (generatedImage.blob) {
        const url = URL.createObjectURL(generatedImage.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedOccasion}-photo-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const link = document.createElement('a');
        link.href = generatedImage.url;
        link.download = `${selectedOccasion}-photo-${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download. Try right-clicking the image and "Save image as..."');
    }
  };

  return (
    <div className="min-h-screen bg-studio-950 py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">AI Photo</span>
            <span className="text-white"> Generator</span>
          </h1>
          <p className="text-lg text-studio-400 max-w-2xl mx-auto">
            Transform your photos with AI-powered enhancements for any occasion
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upload & Controls */}
          <motion.div variants={staggerItem} className="space-y-6">
            {/* Occasion Selector */}
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-electric-purple-400" />
                <h3 className="text-lg font-semibold text-white">Select Occasion</h3>
              </div>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full bg-studio-900 border border-studio-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-electric-purple-500 [&>option]:bg-studio-900 [&>option]:text-white [&>option]:py-2"
              >
                {occasionTemplates.map((occasion) => (
                  <option key={occasion.id} value={occasion.id} className="bg-studio-900 text-white py-2">
                    {occasion.icon} {occasion.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Upload Section */}
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="w-5 h-5 text-electric-purple-400" />
                <h3 className="text-lg font-semibold text-white">Upload Photo</h3>
              </div>

              <AnimatePresence mode="wait">
                {!uploadedImage ? (
                  <motion.label
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="block"
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    <motion.div
                      className={`
                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragging
                          ? 'border-electric-purple-500 bg-electric-purple-500/10'
                          : 'border-studio-600 hover:border-electric-purple-400 hover:bg-studio-800/50'
                        }
                      `}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Camera className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-electric-purple-400' : 'text-studio-400'}`} />
                      <p className="text-gray-300 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-studio-500">
                        JPG, PNG or WEBP (max 10MB)
                      </p>
                    </motion.div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </motion.label>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative group"
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full rounded-xl border border-studio-700"
                    />
                    <motion.button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedBlob(null);
                        setGeneratedImage(null);
                        setError(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-sm text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`
                w-full py-4 rounded-xl font-semibold text-white text-lg
                transition-all duration-300 flex items-center justify-center space-x-3
                ${!uploadedImage || isGenerating
                  ? 'bg-studio-700 cursor-not-allowed text-studio-400'
                  : 'bg-gradient-to-r from-electric-purple-600 to-pink-600 hover:from-electric-purple-500 hover:to-pink-500 shadow-glow hover:shadow-glow-lg'
                }
              `}
              whileHover={!uploadedImage || isGenerating ? {} : { scale: 1.02 }}
              whileTap={!uploadedImage || isGenerating ? {} : { scale: 0.98 }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Generate Photo</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Right: Result */}
          <motion.div variants={staggerItem}>
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6 min-h-[500px]"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Camera className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Generated Result</h3>
              </div>

              <AnimatePresence mode="wait">
                {!generatedImage && !isGenerating && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-square rounded-xl bg-studio-900 border border-studio-700 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-studio-600 mx-auto mb-3" />
                      <p className="text-studio-500">Your generated photo will appear here</p>
                    </div>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-square rounded-xl bg-gradient-to-br from-electric-purple-900/30 to-pink-900/30 border border-electric-purple-500/30 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-studio-700 border-t-electric-purple-500 mx-auto mb-3"
                      />
                      <p className="text-electric-purple-400 font-medium">Creating your photo...</p>
                      <p className="text-sm text-studio-500 mt-2">This may take 20-30 seconds</p>
                    </div>
                  </motion.div>
                )}

                {generatedImage && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="rounded-xl overflow-hidden border border-studio-700">
                      <img
                        src={generatedImage.url}
                        alt="Generated photo"
                        className="w-full"
                      />
                    </div>

                    <motion.button
                      onClick={handleDownload}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Photo</span>
                    </motion.button>

                    <div className="bg-studio-900/50 border border-studio-700 rounded-xl p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-studio-400">Model</span>
                        <span className="text-gray-300">{generatedImage.metadata.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-studio-400">Resolution</span>
                        <span className="text-gray-300">{generatedImage.width}x{generatedImage.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-studio-400">API</span>
                        <span className="text-electric-purple-400">{generatedImage.metadata.api}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Error</p>
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
