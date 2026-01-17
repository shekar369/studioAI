import type { QualityPreset, ResolutionPreset } from '../types/generation.types';

// Quality Presets
export const qualityPresets: QualityPreset[] = [
  {
    id: 'draft',
    name: 'Draft/Preview',
    steps: 15,
    guidanceScale: 5.0,
    samplerMethod: 'DPM++ 2M',
    denoisingStrength: 0.5,
    estimatedTime: '10-15s',
    costMultiplier: 0.5
  },
  {
    id: 'standard',
    name: 'Standard',
    steps: 25,
    guidanceScale: 7.0,
    samplerMethod: 'DPM++ 2M Karras',
    denoisingStrength: 0.65,
    estimatedTime: '20-30s',
    costMultiplier: 1.0
  },
  {
    id: 'high',
    name: 'High Quality',
    steps: 35,
    guidanceScale: 7.5,
    samplerMethod: 'DPM++ 2M Karras',
    denoisingStrength: 0.7,
    estimatedTime: '30-45s',
    costMultiplier: 1.5
  },
  {
    id: 'ultra',
    name: 'Ultra HD',
    steps: 50,
    guidanceScale: 8.0,
    samplerMethod: 'DPM++ SDE Karras',
    denoisingStrength: 0.75,
    estimatedTime: '60-90s',
    costMultiplier: 2.5
  },
  {
    id: 'maximum',
    name: 'Maximum Detail',
    steps: 75,
    guidanceScale: 9.0,
    samplerMethod: 'DPM++ SDE Karras',
    denoisingStrength: 0.8,
    estimatedTime: '2-3min',
    costMultiplier: 4.0
  }
];

// Resolution Presets
export const resolutionPresets: ResolutionPreset[] = [
  {
    id: 'hd',
    name: 'HD',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    megapixels: 0.9,
    recommended: 'Web/Social'
  },
  {
    id: 'fullhd',
    name: 'Full HD',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    megapixels: 2.1,
    recommended: 'Standard'
  },
  {
    id: '2k',
    name: '2K',
    width: 2048,
    height: 1152,
    aspectRatio: '16:9',
    megapixels: 2.4,
    recommended: 'High Quality'
  },
  {
    id: '4k',
    name: '4K',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    megapixels: 8.3,
    recommended: 'Professional'
  },
  {
    id: '8k',
    name: '8K',
    width: 7680,
    height: 4320,
    aspectRatio: '16:9',
    megapixels: 33.2,
    recommended: 'Ultra HD'
  },
  {
    id: 'square-1k',
    name: 'Square 1K',
    width: 1024,
    height: 1024,
    aspectRatio: '1:1',
    megapixels: 1.0,
    recommended: 'Social Media'
  },
  {
    id: 'square-2k',
    name: 'Square 2K',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
    megapixels: 4.2,
    recommended: 'Print'
  },
  {
    id: 'portrait',
    name: 'Portrait',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    megapixels: 2.1,
    recommended: 'Mobile'
  },
  {
    id: 'landscape-4-3',
    name: 'Landscape 4:3',
    width: 2048,
    height: 1536,
    aspectRatio: '4:3',
    megapixels: 3.1,
    recommended: 'Classic'
  },
  {
    id: 'portrait-3-4',
    name: 'Portrait 3:4',
    width: 1536,
    height: 2048,
    aspectRatio: '3:4',
    megapixels: 3.1,
    recommended: 'Portrait Print'
  }
];

// Get preset by ID
export const getQualityPresetById = (id: string): QualityPreset | undefined => {
  return qualityPresets.find(p => p.id === id);
};

export const getResolutionPresetById = (id: string): ResolutionPreset | undefined => {
  return resolutionPresets.find(p => p.id === id);
};

// Default preset IDs
export const DEFAULT_QUALITY_PRESET = 'standard';
// Changed to square-1k for OpenAI gpt-image-1 compatibility (supports 1024x1024, 1024x1536, 1536x1024)
export const DEFAULT_RESOLUTION_PRESET = 'square-1k';
