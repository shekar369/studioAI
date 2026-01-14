import type {
  FacePreservationConfig,
  LightingConfig,
  CameraConfig,
  StyleConfig,
  BackgroundConfig,
  ClothingConfig
} from '../types/generation.types';

// Default Face Preservation Settings
export const defaultFacePreservation: FacePreservationConfig = {
  enabled: true,
  faceDetectionModel: 'retinaface',
  preservationStrength: 0.75,
  multipleFaces: false,
  faceEnhancement: {
    enabled: true,
    skinSmoothing: 30,
    eyeEnhancement: true,
    teethWhitening: false
  },
  ageAdjustment: 0,
  expressions: 'preserve'
};

// Default Lighting Configuration
export const defaultLighting: LightingConfig = {
  type: 'natural',
  direction: 'front',
  intensity: 70,
  colorTemperature: 5500,
  shadows: {
    intensity: 35,
    softness: 60
  },
  highlights: {
    intensity: 60,
    bloom: false
  }
};

// Default Camera Configuration
export const defaultCamera: CameraConfig = {
  lens: '50mm',
  aperture: 'f/2.8',
  shutterSpeed: '1/125',
  iso: 400,
  bokeh: {
    enabled: true,
    intensity: 50,
    shape: 'circular'
  },
  filmGrain: 8,
  vignette: 15
};

// Default Style Configuration
export const defaultStyle: StyleConfig = {
  photographyStyle: 'realistic',
  colorGrading: {
    preset: 'natural',
    saturation: 0,
    contrast: 0,
    brightness: 0,
    tint: { hue: 0, strength: 0 }
  },
  composition: {
    ruleOfThirds: true,
    framing: 'medium',
    perspective: 'eye-level'
  },
  postProcessing: {
    sharpening: 30,
    clarity: 20,
    dehaze: 0,
    skinRetouching: 'light'
  }
};

// Default Background Configuration
export const defaultBackground: BackgroundConfig = {
  type: 'original',
  blur: 0,
  replace: false,
  environment: {
    indoor: false,
    outdoor: false,
    timeOfDay: 'afternoon'
  }
};

// Default Clothing Configuration
export const defaultClothing: ClothingConfig = {
  modifyClothing: false,
  style: 'casual',
  accessories: {
    add: [],
    remove: []
  }
};

// Lighting Presets
export const lightingPresets: Record<string, LightingConfig> = {
  natural: {
    type: 'natural',
    direction: 'front',
    intensity: 70,
    colorTemperature: 5500,
    shadows: { intensity: 35, softness: 60 },
    highlights: { intensity: 60, bloom: false }
  },
  studio: {
    type: 'studio',
    direction: 'front',
    intensity: 85,
    colorTemperature: 5500,
    shadows: { intensity: 20, softness: 80 },
    highlights: { intensity: 65, bloom: false }
  },
  dramatic: {
    type: 'dramatic',
    direction: 'side',
    intensity: 75,
    colorTemperature: 5000,
    shadows: { intensity: 60, softness: 50 },
    highlights: { intensity: 75, bloom: false }
  },
  soft: {
    type: 'soft',
    direction: 'front',
    intensity: 65,
    colorTemperature: 5200,
    shadows: { intensity: 25, softness: 85 },
    highlights: { intensity: 55, bloom: true }
  },
  'golden-hour': {
    type: 'golden-hour',
    direction: 'side',
    intensity: 70,
    colorTemperature: 3500,
    shadows: { intensity: 40, softness: 75 },
    highlights: { intensity: 80, bloom: true }
  },
  'blue-hour': {
    type: 'blue-hour',
    direction: 'front',
    intensity: 60,
    colorTemperature: 7000,
    shadows: { intensity: 45, softness: 70 },
    highlights: { intensity: 50, bloom: true }
  }
};

// Camera Presets
export const cameraPresets: Record<string, Partial<CameraConfig>> = {
  portrait: {
    lens: '85mm',
    aperture: 'f/1.8',
    bokeh: { enabled: true, intensity: 75, shape: 'circular' }
  },
  street: {
    lens: '35mm',
    aperture: 'f/2.8',
    bokeh: { enabled: true, intensity: 40, shape: 'circular' }
  },
  headshot: {
    lens: '85mm',
    aperture: 'f/2.8',
    bokeh: { enabled: true, intensity: 50, shape: 'circular' }
  },
  environmental: {
    lens: '24mm',
    aperture: 'f/4',
    bokeh: { enabled: false, intensity: 20, shape: 'circular' }
  },
  fashion: {
    lens: '85mm',
    aperture: 'f/2.8',
    bokeh: { enabled: true, intensity: 65, shape: 'octagonal' }
  }
};

// Color Grading Presets
export const colorGradingPresets: Record<string, StyleConfig['colorGrading']> = {
  natural: {
    preset: 'natural',
    saturation: 0,
    contrast: 0,
    brightness: 0,
    tint: { hue: 0, strength: 0 }
  },
  warm: {
    preset: 'warm',
    saturation: 10,
    contrast: 5,
    brightness: 5,
    tint: { hue: 30, strength: 20 }
  },
  cool: {
    preset: 'cool',
    saturation: 5,
    contrast: 5,
    brightness: 0,
    tint: { hue: 210, strength: 15 }
  },
  vibrant: {
    preset: 'vibrant',
    saturation: 30,
    contrast: 15,
    brightness: 5,
    tint: { hue: 0, strength: 0 }
  },
  muted: {
    preset: 'muted',
    saturation: -20,
    contrast: -10,
    brightness: 0,
    tint: { hue: 0, strength: 0 }
  },
  vintage: {
    preset: 'vintage',
    saturation: -15,
    contrast: 10,
    brightness: -5,
    tint: { hue: 40, strength: 25 }
  },
  bw: {
    preset: 'bw',
    saturation: -100,
    contrast: 20,
    brightness: 0,
    tint: { hue: 0, strength: 0 }
  }
};

// Prompt Templates for Different Styles
export const promptTemplates = {
  facePreservation: 'maintain exact facial features, preserve identity, same person, facial consistency, accurate likeness, recognize face',
  professionalPhotography: 'professional photography, studio lighting, high-end camera, sharp focus, detailed, professional quality',
  hyperRealistic: 'hyper-realistic, photorealistic, ultra detailed, 8K resolution, high quality, lifelike, natural, realistic skin texture',
  cinematic: 'cinematic lighting, movie-quality, dramatic atmosphere, professional color grading, film grain, cinematic composition',
  portrait: 'professional portrait, portrait photography, portrait lighting, shallow depth of field, bokeh background',
  fashion: 'fashion photography, editorial style, high fashion, stylish, vogue magazine quality, fashion shoot',
  documentary: 'documentary photography, natural moment, candid, authentic, real life, photojournalism style',
  artistic: 'artistic photography, creative composition, unique perspective, artistic interpretation, fine art photography'
};

// Negative Prompt Library
export const negativePrompts = {
  common: 'blurry, low quality, pixelated, distorted, deformed, ugly, bad anatomy, poorly drawn, amateur, low resolution, compressed',
  face: 'two faces, multiple people, disfigured face, asymmetric eyes, wrong proportions, bad eyes, malformed face, extra limbs',
  artifacts: 'watermark, text, logo, signature, artifacts, noise, compression artifacts, jpeg artifacts, username, timestamp',
  style: 'cartoon, anime, painting, sketch, drawing, illustration, 3d render, cgi, artificial, unrealistic',
  technical: 'overexposed, underexposed, over-saturated, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands'
};

// Get complete negative prompt
export const getCompleteNegativePrompt = (): string => {
  return Object.values(negativePrompts).join(', ');
};

// Build prompt from configuration
export const buildPromptModifiers = (config: {
  lighting?: LightingConfig;
  camera?: CameraConfig;
  style?: StyleConfig;
}): string => {
  const modifiers: string[] = [];

  if (config.lighting) {
    modifiers.push(`${config.lighting.type} lighting`);
    modifiers.push(`${config.lighting.direction} lighting`);
    modifiers.push(`${config.lighting.colorTemperature}K color temperature`);
  }

  if (config.camera) {
    modifiers.push(`${config.camera.lens} lens`);
    modifiers.push(`shot at ${config.camera.aperture}`);
    if (config.camera.bokeh.enabled) {
      modifiers.push('beautiful bokeh');
    }
  }

  if (config.style) {
    modifiers.push(`${config.style.photographyStyle} photography style`);
    modifiers.push(`${config.style.colorGrading.preset} color grading`);
    modifiers.push(`${config.style.composition.perspective} perspective`);
  }

  return modifiers.join(', ');
};
