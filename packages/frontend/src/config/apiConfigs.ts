import type { APIOption } from '../types/ui.types';

// API Configuration Options for UI Display
export const apiOptions: APIOption[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    description: 'Best quality with face preservation using gpt-image-1',
    features: [
      'gpt-image-1 (Image Editing)',
      'DALL-E 3 (Generation)',
      'Face preservation',
      'Ultra-realistic results'
    ],
    pricingTier: 'paid',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: true,
      highRes: true,
      batchGeneration: false
    },
    limits: {
      maxResolution: '1024x1024',
      rateLimit: '50/minute'
    }
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    logo: '🤗',
    description: 'Free tier with FLUX.1 and Stable Diffusion models',
    features: [
      'FLUX.1-dev model',
      'Stable Diffusion XL',
      'Free tier available',
      'Community models'
    ],
    pricingTier: 'freemium',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: false,
      highRes: true,
      batchGeneration: false
    },
    limits: {
      maxResolution: '1024x1024',
      monthlyQuota: 1000,
      rateLimit: '30/minute'
    }
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    logo: '✨',
    description: 'Multimodal AI with free tier',
    features: [
      'Gemini 2.0 Flash',
      'Image understanding',
      'Free tier available',
      'Fast generation'
    ],
    pricingTier: 'freemium',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: false,
      highRes: false,
      batchGeneration: false
    },
    limits: {
      maxResolution: '1024x1024',
      monthlyQuota: 1500,
      rateLimit: '60/minute'
    }
  },
  {
    id: 'stability',
    name: 'Stability AI',
    logo: '🎨',
    description: 'Professional image generation with SD3 and SDXL',
    features: [
      'SD3 Medium/Large',
      'SDXL 1.0',
      'High quality output',
      'ControlNet support'
    ],
    pricingTier: 'paid',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: false,
      highRes: true,
      batchGeneration: false
    },
    limits: {
      maxResolution: '2048x2048',
      rateLimit: '150/minute'
    }
  },
  {
    id: 'replicate',
    name: 'Replicate',
    logo: '🔄',
    description: 'Multiple models including face-specific variants',
    features: [
      'PhotoMaker (face consistency)',
      'SDXL variants',
      'ControlNet',
      'Custom models'
    ],
    pricingTier: 'paid',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: true,
      highRes: true,
      batchGeneration: true
    },
    limits: {
      maxResolution: '2048x2048',
      rateLimit: '50/minute'
    }
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    logo: '🧠',
    description: 'Claude with Hugging Face MCP for image generation',
    features: [
      'FLUX.1 Kontext Dev',
      'Face preservation',
      'Tool calling',
      'High quality'
    ],
    pricingTier: 'paid',
    requiresAuth: true,
    capabilities: {
      imageToImage: true,
      facePreservation: true,
      highRes: true,
      batchGeneration: false
    },
    limits: {
      maxResolution: '2048x2048',
      rateLimit: '50/minute'
    }
  }
];

// API Endpoint URLs
export const API_ENDPOINTS = {
  anthropic: 'https://api.anthropic.com/v1/messages',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  stability: 'https://api.stability.ai/v2beta/stable-image/generate/sd3',
  replicate: 'https://api.replicate.com/v1/predictions',
  huggingface: 'http://localhost:3001/api/huggingface' // Using proxy server to bypass CORS
};

// Default Models for Each API
export const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-4-20250514',
  gemini: 'gemini-2.0-flash-exp',
  stability: 'sd3-medium',
  replicate: 'stability-ai/sdxl',
  huggingface: 'black-forest-labs/FLUX.1-dev'
};

// Get API option by ID
export const getAPIOptionById = (id: string): APIOption | undefined => {
  return apiOptions.find(api => api.id === id);
};

// Check if API supports face preservation
export const supportsFacePreservation = (apiId: string): boolean => {
  const api = getAPIOptionById(apiId);
  return api?.capabilities.facePreservation ?? false;
};

// Get recommended APIs for high quality
export const getRecommendedAPIs = (): APIOption[] => {
  return apiOptions.filter(api => api.capabilities.highRes);
};

// Get free tier APIs
export const getFreeTierAPIs = (): APIOption[] => {
  return apiOptions.filter(api => api.pricingTier === 'freemium' || api.pricingTier === 'free');
};
