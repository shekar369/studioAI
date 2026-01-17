import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Sparkles, Settings as SettingsIcon, Sliders, Home, ChevronRight } from 'lucide-react';

// Components
import { LandingPage } from './components/LandingPage';
import { ImageUploader } from './components/ImageUploader';
import { OccasionSelector } from './components/OccasionSelector';
import { QualitySettings } from './components/QualitySettings';
import { GenerateButton } from './components/GenerateButton';
import { ImagePreview } from './components/ImagePreview';
import { DemoPage } from './components/DemoPage';
import { SettingsPage } from './components/SettingsPage';

// Configuration
import { apiOptions } from './config/apiConfigs';
import { occasionTemplates, getOccasionById } from './config/occasions';
import { qualityPresets, resolutionPresets, DEFAULT_QUALITY_PRESET, DEFAULT_RESOLUTION_PRESET } from './config/presets';
import { defaultFacePreservation, defaultLighting, defaultCamera, defaultStyle, defaultBackground, defaultClothing } from './config/styles';

// Services
import { getAPI } from './services/api/apiFactory';
import { promptBuilder } from './services/promptBuilder';

// Types
import type { UploadedImage } from './types/generation.types';
import type { GeneratedImage, APIStatus, GenerationConfig } from './types/api.types';
import type { AdvancedSettings } from './types/ui.types';

// Utils
import { formatErrorForUser } from './utils/errorHandling';

// Animation imports
import { staggerContainer, staggerItem } from './utils/animations';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }
};

const tabVariants = {
  inactive: { scale: 1 },
  active: { scale: 1 },
  hover: { scale: 1.02, y: -2 }
};

function App() {
  // Tab State - Start with landing page
  const [activeTab, setActiveTab] = useState<'landing' | 'demo' | 'full' | 'settings'>('landing');

  // State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const selectedAPI = 'openai'; // Fixed to OpenAI (API selection available in Settings)
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>(DEFAULT_QUALITY_PRESET);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Status
  const [apiStatus, setApiStatus] = useState<Record<string, APIStatus>>({});

  // Advanced Settings
  const [advancedSettings] = useState<AdvancedSettings>({
    facePreservation: defaultFacePreservation,
    lighting: defaultLighting,
    camera: defaultCamera,
    style: defaultStyle,
    background: defaultBackground,
    clothing: defaultClothing,
    resolution: resolutionPresets.find(r => r.id === DEFAULT_RESOLUTION_PRESET)!,
    qualityPreset: qualityPresets.find(q => q.id === DEFAULT_QUALITY_PRESET)!
  });

  // Initialize API status
  useEffect(() => {
    const initAPIStatus = async () => {
      const status: Record<string, APIStatus> = {};

      // Set default API keys from env if not exists
      const defaultHFKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
      const defaultGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const defaultOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!localStorage.getItem('api_key_huggingface')) {
        localStorage.setItem('api_key_huggingface', defaultHFKey);
      }
      if (!localStorage.getItem('api_key_gemini')) {
        localStorage.setItem('api_key_gemini', defaultGeminiKey);
      }
      if (defaultOpenAIKey && !localStorage.getItem('api_key_openai')) {
        localStorage.setItem('api_key_openai', defaultOpenAIKey);
      }

      for (const api of apiOptions) {
        // Check if API key exists in localStorage
        const apiKey = localStorage.getItem(`api_key_${api.id}`);
        const authenticated = !!apiKey;

        status[api.id] = {
          available: authenticated,
          authenticated
        };

        // If authenticated, verify the API
        if (authenticated) {
          try {
            const apiInstance = getAPI(api.id);
            const isValid = await apiInstance.authenticate(apiKey!);
            status[api.id].available = isValid;
          } catch (err) {
            console.error(`Failed to verify ${api.id}:`, err);
            status[api.id].available = false;
          }
        }
      }

      setApiStatus(status);
    };

    initAPIStatus();
  }, []);

  // Handle image upload
  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images);
    setError(null);
  };

  // Handle occasion selection
  const handleSelectOccasion = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    setError(null);
  };

  // Handle quality selection
  const handleSelectQuality = (qualityId: string) => {
    setSelectedQuality(qualityId);
    setError(null);
  };

  // Handle image generation
  const handleGenerate = async () => {
    // Validation
    if (uploadedImages.length === 0) {
      setError('Please upload an image first');
      return;
    }

    if (!selectedOccasion) {
      setError('Please select an occasion or style');
      return;
    }

    if (!apiStatus[selectedAPI]?.authenticated) {
      setError('Please configure your API key first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Get occasion template
      const occasion = getOccasionById(selectedOccasion);
      if (!occasion) {
        throw new Error('Invalid occasion selected');
      }

      // Get quality preset
      const qualityPreset = qualityPresets.find(q => q.id === selectedQuality);
      if (!qualityPreset) {
        throw new Error('Invalid quality preset');
      }

      // Build prompt
      const prompt = promptBuilder.buildPrompt(occasion, advancedSettings);
      const negativePrompt = promptBuilder.buildNegativePrompt(advancedSettings);

      // Prepare generation config
      const config: GenerationConfig = {
        prompt,
        negativePrompt,
        width: advancedSettings.resolution.width,
        height: advancedSettings.resolution.height,
        steps: qualityPreset.steps,
        guidanceScale: qualityPreset.guidanceScale,
        seed: Math.floor(Math.random() * 1000000),
        numImages: 1,
        quality: selectedQuality as any
      };

      // Get API instance
      const apiKey = localStorage.getItem(`api_key_${selectedAPI}`);
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const api = getAPI(selectedAPI);
      await api.authenticate(apiKey);

      // Generate image with face preservation if using OpenAI and image is uploaded
      console.log('Generating image with config:', config);

      let result: GeneratedImage;
      if (selectedAPI === 'openai' && uploadedImages.length > 0 && uploadedImages[0].blob) {
        // Use image editing for face preservation
        console.log('Using OpenAI image editing for face preservation');
        result = await api.generateImage(config, uploadedImages[0].blob);
      } else {
        // Standard generation
        result = await api.generateImage(config);
      }

      setGeneratedImage(result);
      console.log('Image generated successfully:', result);
    } catch (err) {
      console.error('Generation error:', err);
      setError(formatErrorForUser(err));
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if generation is possible
  const canGenerate = uploadedImages.length > 0 &&
    selectedOccasion !== null &&
    apiStatus[selectedAPI]?.authenticated &&
    !isGenerating;

  // Tab configuration
  const tabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'demo', label: 'Quick Demo', icon: Sparkles },
    { id: 'full', label: 'Full Application', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ] as const;

  return (
    <div className="min-h-screen bg-studio-950">
      {/* Show Landing Page or Application */}
      <AnimatePresence mode="wait">
        {activeTab === 'landing' ? (
          <motion.div
            key="landing"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <LandingPage onGetStarted={() => setActiveTab('demo')} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {/* Header - Only show when not on landing page */}
            <motion.header
              className="bg-studio-900/95 border-b border-studio-700 shadow-xl sticky top-0 z-50 backdrop-blur-2xl"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="w-10 h-10 bg-gradient-electric rounded-xl flex items-center justify-center shadow-glow"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(124, 58, 237, 0.4)',
                          '0 0 30px rgba(124, 58, 237, 0.6)',
                          '0 0 20px rgba(124, 58, 237, 0.4)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-electric-purple-400 to-electric-blue-400 bg-clip-text text-transparent">
                        Studio AI
                      </h1>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Face-Preserved AI Studio
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-xs text-gray-500 bg-studio-800 px-2 py-1 rounded-full">v1.0.0</span>
                  </motion.div>
                </div>

                {/* Tab Navigation with Animation */}
                <motion.div
                  className="mt-4 flex space-x-1 border-b border-studio-700/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-6 py-3 font-medium text-sm transition-all duration-300 rounded-t-lg
                        ${activeTab === tab.id
                          ? 'text-white bg-electric-purple-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-studio-800/50'
                        }
                      `}
                      variants={tabVariants}
                      initial="inactive"
                      animate={activeTab === tab.id ? "active" : "inactive"}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-electric-purple-400' : ''}`} />
                        <span>{tab.label}</span>
                      </div>
                      {/* Active indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-electric"
                          layoutId="activeTab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.header>

            {/* Main Content with Page Transitions */}
            <AnimatePresence mode="wait">
              {activeTab === 'demo' ? (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <DemoPage />
                </motion.div>
              ) : activeTab === 'settings' ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <SettingsPage />
                </motion.div>
              ) : (
                <motion.main
                  key="full"
                  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {/* Left Column - Configuration */}
                    <motion.div className="lg:col-span-1 space-y-6" variants={staggerItem}>
                      {/* Image Upload */}
                      <motion.div
                        className="bg-studio-850 rounded-2xl shadow-studio border border-studio-700 p-6"
                        whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <ImageUploader
                          onImagesUploaded={handleImagesUploaded}
                          maxFileSize={10 * 1024 * 1024}
                          allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
                          multipleUpload={false}
                        />
                      </motion.div>

                      {/* Quality Settings */}
                      <motion.div
                        className="bg-studio-850 rounded-2xl shadow-studio border border-studio-700 p-6"
                        whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <QualitySettings
                          presets={qualityPresets}
                          selectedPreset={selectedQuality}
                          onSelectPreset={handleSelectQuality}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Middle Column - Occasion Selection */}
                    <motion.div className="lg:col-span-1" variants={staggerItem}>
                      <motion.div
                        className="bg-studio-850 rounded-2xl shadow-studio border border-studio-700 p-6 sticky top-24"
                        whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <OccasionSelector
                          occasions={occasionTemplates}
                          selectedOccasion={selectedOccasion}
                          onSelectOccasion={handleSelectOccasion}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Right Column - Preview */}
                    <motion.div className="lg:col-span-1 space-y-6" variants={staggerItem}>
                      <motion.div
                        className="bg-studio-850 rounded-2xl shadow-studio border border-studio-700 p-6"
                        whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <ImagePreview
                          originalImage={uploadedImages[0]}
                          generatedImage={generatedImage || undefined}
                          comparisonMode="side-by-side"
                          onComparisonModeChange={() => {}}
                        />
                      </motion.div>

                      {/* Generate Button */}
                      <motion.div
                        className="bg-studio-850 rounded-2xl shadow-studio border border-studio-700 p-6"
                        whileHover={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <GenerateButton
                          onClick={handleGenerate}
                          disabled={!canGenerate}
                          isGenerating={isGenerating}
                        />

                        {/* Error Message */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-start"
                            >
                              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Download Button - Shows after successful generation */}
                        <AnimatePresence>
                          {generatedImage && !error && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              onClick={() => {
                                if (!generatedImage) return;
                                try {
                                  // Download using blob if available
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
                                    // Fallback to URL
                                    const link = document.createElement('a');
                                    link.href = generatedImage.url;
                                    link.download = `studio-ai-${Date.now()}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                } catch (err) {
                                  console.error('Download failed:', err);
                                  alert('Failed to download image. Please try right-clicking the image and selecting "Save image as..."');
                                }
                              }}
                              className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-electric-blue-500 to-electric-indigo-500 text-white font-medium rounded-xl hover:from-electric-blue-600 hover:to-electric-indigo-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>Download Generated Image</span>
                            </motion.button>
                          )}
                        </AnimatePresence>

                        {/* Info */}
                        {!error && !generatedImage && (
                          <motion.div
                            className="mt-4 text-xs text-gray-400 space-y-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {!uploadedImages.length && (
                              <p className="flex items-center space-x-1">
                                <ChevronRight className="w-3 h-3" />
                                <span>Upload an image to get started</span>
                              </p>
                            )}
                            {!selectedOccasion && uploadedImages.length > 0 && (
                              <p className="flex items-center space-x-1">
                                <ChevronRight className="w-3 h-3" />
                                <span>Select an occasion or style</span>
                              </p>
                            )}
                            {!apiStatus[selectedAPI]?.authenticated && (
                              <p className="flex items-center space-x-1">
                                <ChevronRight className="w-3 h-3" />
                                <span>Configure your API key</span>
                              </p>
                            )}
                            {canGenerate && (
                              <motion.p
                                className="text-electric-purple-400 flex items-center space-x-1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Ready to generate!</span>
                              </motion.p>
                            )}
                          </motion.div>
                        )}

                        {/* Success Message */}
                        <AnimatePresence>
                          {generatedImage && !error && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-4 text-xs text-electric-purple-400 space-y-1"
                            >
                              <p className="flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Image generated successfully!</span>
                              </p>
                              <p className="flex items-center space-x-1">
                                <ChevronRight className="w-3 h-3" />
                                <span>Click the button above to download</span>
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.main>
              )}
            </AnimatePresence>

            {/* Footer */}
            {activeTab === 'full' && (
              <motion.footer
                className="bg-studio-900 border-t border-studio-700 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="text-center text-sm text-gray-400">
                    <p className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4 text-electric-purple-400" />
                      <span>Powered by AI</span>
                      <span className="text-studio-600">•</span>
                      <span>Face-Preserved</span>
                      <span className="text-studio-600">•</span>
                      <span>Studio Quality</span>
                    </p>
                    <p className="mt-1 text-gray-500">OpenAI DALL-E • Hugging Face FLUX.1 • Google Gemini</p>
                  </div>
                </div>
              </motion.footer>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
