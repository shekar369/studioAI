// Generation and Image Processing Types

export interface UploadedImage {
  id: string;
  file: File;
  blob?: Blob;
  preview: string;
  width: number;
  height: number;
  size: number;
  format: string;
  exifData?: ExifData;
  faces?: FaceDetection[];
}

export interface ExifData {
  orientation?: number;
  dateTime?: string;
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: string;
  iso?: number;
  shutterSpeed?: string;
}

export interface FaceDetection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: FaceLandmarks;
}

export interface FaceLandmarks {
  leftEye: Point;
  rightEye: Point;
  nose: Point;
  mouthLeft: Point;
  mouthRight: Point;
}

export interface Point {
  x: number;
  y: number;
}

// Face Preservation Settings
export interface FacePreservationConfig {
  enabled: boolean;
  faceDetectionModel: 'mtcnn' | 'retinaface' | 'dlib';
  preservationStrength: number; // 0.0-1.0
  multipleFaces: boolean;
  faceEnhancement: FaceEnhancement;
  ageAdjustment: number; // -20 to +20
  expressions: 'preserve' | 'smile' | 'neutral' | 'serious';
}

export interface FaceEnhancement {
  enabled: boolean;
  skinSmoothing: number; // 0-100
  eyeEnhancement: boolean;
  teethWhitening: boolean;
}

// Photography Settings
export interface LightingConfig {
  type: 'natural' | 'studio' | 'dramatic' | 'soft' | 'golden-hour' | 'blue-hour';
  direction: 'front' | 'side' | 'back' | 'rim' | 'butterfly';
  intensity: number; // 0-100
  colorTemperature: number; // 2000-10000K
  shadows: {
    intensity: number;
    softness: number;
  };
  highlights: {
    intensity: number;
    bloom: boolean;
  };
}

export interface CameraConfig {
  lens: '24mm' | '35mm' | '50mm' | '85mm' | '135mm' | '200mm';
  aperture: 'f/1.2' | 'f/1.4' | 'f/1.8' | 'f/2.8' | 'f/4' | 'f/5.6' | 'f/8';
  shutterSpeed: string;
  iso: number;
  bokeh: BokehConfig;
  filmGrain: number; // 0-100
  vignette: number; // 0-100
}

export interface BokehConfig {
  enabled: boolean;
  intensity: number;
  shape: 'circular' | 'hexagonal' | 'octagonal';
}

// Style Settings
export interface StyleConfig {
  photographyStyle: 'realistic' | 'cinematic' | 'portrait' | 'fashion' | 'editorial' | 'documentary';
  colorGrading: ColorGradingConfig;
  composition: CompositionConfig;
  postProcessing: PostProcessingConfig;
}

export interface ColorGradingConfig {
  preset: 'natural' | 'warm' | 'cool' | 'vibrant' | 'muted' | 'vintage' | 'bw';
  saturation: number; // -100 to +100
  contrast: number; // -100 to +100
  brightness: number; // -100 to +100
  tint: { hue: number; strength: number };
}

export interface CompositionConfig {
  ruleOfThirds: boolean;
  framing: 'tight' | 'medium' | 'wide' | 'environmental';
  perspective: 'eye-level' | 'high-angle' | 'low-angle' | 'birds-eye' | 'worms-eye';
}

export interface PostProcessingConfig {
  sharpening: number; // 0-100
  clarity: number; // 0-100
  dehaze: number; // 0-100
  skinRetouching: 'none' | 'light' | 'medium' | 'heavy';
}

// Background Settings
export interface BackgroundConfig {
  type: 'custom' | 'template' | 'original' | 'removed';
  customPrompt?: string;
  templateId?: string;
  blur: number; // 0-100
  replace: boolean;
  environment: EnvironmentConfig;
}

export interface EnvironmentConfig {
  indoor: boolean;
  outdoor: boolean;
  location?: string;
  weather?: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog';
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'golden-hour' | 'sunset' | 'dusk' | 'night';
}

// Clothing Settings
export interface ClothingConfig {
  modifyClothing: boolean;
  style: 'casual' | 'business' | 'formal' | 'athletic' | 'traditional' | 'costume';
  colorScheme?: string[];
  accessories: {
    add: string[];
    remove: string[];
  };
}

// Resolution Presets
export interface ResolutionPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: number;
  recommended: string;
}

// Quality Presets
export interface QualityPreset {
  id: string;
  name: string;
  steps: number;
  guidanceScale: number;
  samplerMethod: string;
  denoisingStrength: number;
  estimatedTime: string;
  costMultiplier: number;
}

// Generation Progress
export interface GenerationProgress {
  status: 'queued' | 'processing' | 'generating' | 'upscaling' | 'complete' | 'failed';
  percentage: number;
  currentStep: number;
  totalSteps: number;
  estimatedTimeRemaining: number;
  message: string;
  logs: ProgressLog[];
}

export interface ProgressLog {
  timestamp: Date;
  message: string;
  level: 'info' | 'warning' | 'error';
}

// Download Configuration
export interface DownloadConfig {
  format: 'png' | 'jpeg' | 'webp' | 'tiff';
  quality: number; // 1-100
  resolution: ResolutionPreset;
  includeMetadata: boolean;
  watermark: WatermarkConfig;
  filename: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
}
