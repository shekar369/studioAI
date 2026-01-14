import { useState } from 'react';
import { Upload, Sparkles, Loader2, AlertCircle, Download } from 'lucide-react';
import { getAPI } from '../services/api/apiFactory';
import { getOccasionById } from '../config/occasions';
import type { GeneratedImage } from '../types/api.types';

export const DemoPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<Blob | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    // Store blob for API
    setUploadedBlob(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
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
      // Get OpenAI API key from localStorage or env
      let apiKey = localStorage.getItem('api_key_openai');

      // Fallback to env variable
      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      }

      if (!apiKey || apiKey === 'your-openai-api-key-here') {
        throw new Error('OpenAI API key not configured. Please add your key to the .env file (VITE_OPENAI_API_KEY).');
      }

      // Get birthday occasion template
      const birthdayOccasion = getOccasionById('birthday');
      if (!birthdayOccasion) {
        throw new Error('Birthday template not found');
      }

      // Build prompt with face preservation (like Python POC)
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

      // Get OpenAI API instance
      const openaiAPI = getAPI('openai');
      await openaiAPI.authenticate(apiKey);

      console.log('Editing image with OpenAI gpt-image-1...');
      console.log('Prompt:', prompt);

      // Use generateImage with source image for editing
      // OpenAI gpt-image-1 supports: 1024x1024, 1024x1536, 1536x1024
      const result = await openaiAPI.generateImage({
        prompt,
        width: 1024,
        height: 1024, // Square format for best compatibility
        steps: 50,
        guidanceScale: 7,
        numImages: 1,
        quality: 'standard',
        modelId: 'gpt-image-1'
      }, uploadedBlob);

      setGeneratedImage(result);
      console.log('Image generated successfully!');
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download generated image
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `birthday-photo-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Demo Mode</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Birthday Photo Generator
          </h1>
          <p className="text-lg text-gray-600">
            Transform your photo into a professional birthday portrait
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload & Generate */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Upload Your Photo
              </h2>

              {!uploadedImage ? (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG or WEBP (max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full rounded-xl shadow-md"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedBlob(null);
                      setGeneratedImage(null);
                      setError(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Generate Birthday Photo
              </h2>

              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || isGenerating}
                className={`
                  w-full py-4 rounded-xl font-semibold text-white text-lg
                  transition-all duration-200 flex items-center justify-center space-x-3
                  ${!uploadedImage || isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  }
                `}
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
              </button>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>✨ Uses OpenAI gpt-image-1 (Image Editing)</p>
                <p>👤 Preserves your original face & identity</p>
                <p>🎂 Adds birthday party theme & atmosphere</p>
                <p>📸 Professional photography enhancement</p>
                <p>⚡ Generated in ~20-30 seconds</p>
              </div>
            </div>
          </div>

          {/* Right: Result */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Generated Result
              </h2>

              {!generatedImage && !isGenerating && (
                <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your birthday photo will appear here</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
                    <p className="text-purple-700 font-medium">Creating your birthday photo...</p>
                  </div>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-4">
                  <img
                    src={generatedImage.url}
                    alt="Generated birthday photo"
                    className="w-full rounded-xl shadow-lg"
                  />

                  <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Birthday Photo</span>
                  </button>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="text-gray-600 mb-1">
                      <strong>Model:</strong> {generatedImage.metadata.model}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Resolution:</strong> {generatedImage.width}x{generatedImage.height}
                    </p>
                    <p className="text-gray-600">
                      <strong>API:</strong> {generatedImage.metadata.api}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            This is a demo to showcase the birthday photo generation feature.
            <br />
            For full features with 34+ templates, use the main application.
          </p>
        </div>
      </div>
    </div>
  );
};
