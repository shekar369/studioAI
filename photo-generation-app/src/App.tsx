import { useState, useEffect } from 'react';
import { AlertCircle, Sparkles, Settings as SettingsIcon, Sliders } from 'lucide-react';

// Components
import { ImageUploader } from './components/ImageUploader';
import { APISelector } from './components/APISelector';
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

function App() {
  // Tab State
  const [activeTab, setActiveTab] = useState<'demo' | 'full' | 'settings'>('demo');

  // State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedAPI, setSelectedAPI] = useState<string>('openai'); // Default to OpenAI
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

  // Handle API selection and re-verify authentication
  const handleSelectAPI = async (apiId: string) => {
    setSelectedAPI(apiId);
    setError(null);

    // Re-verify the API authentication when selected
    const apiKey = localStorage.getItem(`api_key_${apiId}`);
    if (apiKey) {
      try {
        const api = getAPI(apiId);
        const isValid = await api.authenticate(apiKey);

        setApiStatus(prev => ({
          ...prev,
          [apiId]: {
            available: isValid,
            authenticated: isValid
          }
        }));
      } catch (err) {
        console.error(`Failed to verify ${apiId}:`, err);
        setApiStatus(prev => ({
          ...prev,
          [apiId]: {
            available: false,
            authenticated: false
          }
        }));
        setError('Failed to authenticate with API. Please check your API key.');
      }
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Studio AI</h1>
              <p className="text-sm text-gray-600 mt-1">
                Hyper-Realistic Photo Generation
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">v1.0.0</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('demo')}
              className={`
                px-6 py-3 font-medium text-sm transition-all relative
                ${activeTab === 'demo'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Quick Demo</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`
                px-6 py-3 font-medium text-sm transition-all relative
                ${activeTab === 'full'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Full Application</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`
                px-6 py-3 font-medium text-sm transition-all relative
                ${activeTab === 'settings'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === 'demo' ? (
        <DemoPage />
      ) : activeTab === 'settings' ? (
        <SettingsPage />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ImageUploader
                onImagesUploaded={handleImagesUploaded}
                maxFileSize={10 * 1024 * 1024}
                allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
                multipleUpload={false}
              />
            </div>

            {/* API Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <APISelector
                apis={apiOptions}
                selectedAPI={selectedAPI}
                onSelectAPI={handleSelectAPI}
                apiStatus={apiStatus}
              />
            </div>

            {/* Quality Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <QualitySettings
                presets={qualityPresets}
                selectedPreset={selectedQuality}
                onSelectPreset={handleSelectQuality}
              />
            </div>
          </div>

          {/* Middle Column - Occasion Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <OccasionSelector
                occasions={occasionTemplates}
                selectedOccasion={selectedOccasion}
                onSelectOccasion={handleSelectOccasion}
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ImagePreview
                originalImage={uploadedImages[0]}
                generatedImage={generatedImage || undefined}
                comparisonMode="side-by-side"
                onComparisonModeChange={() => {}}
              />
            </div>

            {/* Generate Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!canGenerate}
                isGenerating={isGenerating}
              />

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Info */}
              {!error && (
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  {!uploadedImages.length && (
                    <p>• Upload an image to get started</p>
                  )}
                  {!selectedOccasion && uploadedImages.length > 0 && (
                    <p>• Select an occasion or style</p>
                  )}
                  {!apiStatus[selectedAPI]?.authenticated && (
                    <p>• Configure your API key</p>
                  )}
                  {canGenerate && (
                    <p className="text-green-600">✓ Ready to generate!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      )}

      {/* Footer */}
      {activeTab === 'full' && (
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Powered by AI • Free APIs available for testing</p>
            <p className="mt-1">Hugging Face FLUX.1 • Google Gemini</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

export default App;
