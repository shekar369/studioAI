import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Loader2, AlertCircle, Download, X, Cake, Camera, Wand2, Clock } from 'lucide-react';
import { getAPI } from '../services/api/apiFactory';
import { getOccasionById } from '../config/occasions';
import type { GeneratedImage } from '../types/api.types';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export const DemoPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<Blob | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Generate birthday photo
  const handleGenerate = async () => {
    if (!uploadedImage || !uploadedBlob) {
      setError('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let apiKey = localStorage.getItem('api_key_openai');

      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      }

      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        throw new Error('OpenAI API key not configured. Please add your key in Settings.');
      }

      const birthdayOccasion = getOccasionById('birthday');
      if (!birthdayOccasion) {
        throw new Error('Birthday template not found');
      }

      const prompt = `Create an ultra-realistic birthday-themed enhancement using the provided photo as the base image.

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

Birthday theme:
${birthdayOccasion.basePrompt}
- Subtle elegant bokeh lights
- Soft background confetti only
- Premium, classy celebration
- No objects touching or covering the face`;

      const openaiAPI = getAPI('openai');
      await openaiAPI.authenticate(apiKey);

      const result = await openaiAPI.generateImage({
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
        link.download = `birthday-photo-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const link = document.createElement('a');
        link.href = generatedImage.url;
        link.download = `birthday-photo-${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download. Try right-clicking the image and "Save image as..."');
    }
  };

  return (
    <div className="min-h-screen bg-studio-950 bg-gradient-mesh py-12 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center space-x-2 bg-studio-800/80 backdrop-blur-sm border border-studio-700 px-4 py-2 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Cake className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-gray-300">Demo Mode</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Birthday Photo</span>
            <span className="text-white"> Generator</span>
          </h1>
          <p className="text-lg text-studio-400 max-w-2xl mx-auto">
            Transform your photo into a professional birthday portrait with AI magic
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload & Generate */}
          <motion.div variants={staggerItem} className="space-y-6">
            {/* Upload Section */}
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6 md:p-8"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload Your Photo</h2>
                  <p className="text-sm text-studio-400">Step 1 of 2</p>
                </div>
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
                        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                        ${isDragging
                          ? 'border-electric-purple-500 bg-electric-purple-500/10'
                          : 'border-studio-600 hover:border-electric-purple-400 hover:bg-studio-800/50'
                        }
                      `}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.div
                        className={`
                          w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center
                          ${isDragging ? 'bg-electric-purple-500' : 'bg-studio-800'}
                        `}
                        animate={isDragging ? { y: [0, -8, 0] } : {}}
                        transition={{ duration: 1.5, repeat: isDragging ? Infinity : 0 }}
                      >
                        <Camera className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-studio-400'}`} />
                      </motion.div>
                      <p className="text-gray-300 mb-2">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-studio-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <motion.button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedBlob(null);
                        setGeneratedImage(null);
                        setError(null);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 backdrop-blur-sm text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500"
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
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6 md:p-8"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Generate Birthday Photo</h2>
                  <p className="text-sm text-studio-400">Step 2 of 2</p>
                </div>
              </div>

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
                    <span>Generating Birthday Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Generate Birthday Photo</span>
                  </>
                )}
              </motion.button>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: <Sparkles className="w-4 h-4" />, text: 'OpenAI gpt-image-1' },
                  { icon: <Camera className="w-4 h-4" />, text: 'Face Preserved' },
                  { icon: <Cake className="w-4 h-4" />, text: 'Birthday Theme' },
                  { icon: <Clock className="w-4 h-4" />, text: '~20-30 seconds' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 text-sm text-studio-400 bg-studio-900/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-electric-purple-400">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Result */}
          <motion.div variants={staggerItem} className="space-y-6">
            <motion.div
              className="bg-studio-850 border border-studio-700 rounded-2xl p-6 md:p-8 min-h-[500px]"
              whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Generated Result</h2>
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
                      <div className="w-20 h-20 rounded-2xl bg-studio-800 mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-studio-600" />
                      </div>
                      <p className="text-studio-500">Your birthday photo will appear here</p>
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
                        className="w-20 h-20 rounded-full border-4 border-studio-700 border-t-electric-purple-500 mx-auto mb-4"
                      />
                      <p className="text-electric-purple-400 font-medium">Creating your birthday photo...</p>
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
                    <div className="relative group rounded-xl overflow-hidden border border-studio-700">
                      <img
                        src={generatedImage.url}
                        alt="Generated birthday photo"
                        className="w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-studio-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <motion.button
                      onClick={handleDownload}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Birthday Photo</span>
                    </motion.button>

                    <div className="bg-studio-900/50 border border-studio-700 rounded-xl p-4 space-y-2 text-sm">
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
              className="mt-6 max-w-2xl mx-auto"
            >
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-start backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Error</p>
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Footer */}
        <motion.div variants={fadeInUp} className="mt-12 text-center">
          <p className="text-sm text-studio-500">
            This is a demo to showcase the birthday photo generation feature.
            <br />
            For full features with 34+ templates, use the main application.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
