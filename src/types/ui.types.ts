// UI and State Management Types

import type {
  UploadedImage,
  GenerationProgress,
  FacePreservationConfig,
  LightingConfig,
  CameraConfig,
  StyleConfig,
  BackgroundConfig,
  ClothingConfig,
  ResolutionPreset,
  QualityPreset
} from './generation.types';
import type { APIConfig, APIStatus, GeneratedImage } from './api.types';

// Main Application State
export interface AppState {
  // Image State
  uploadedImages: UploadedImage[];
  generatedImages: GeneratedImage[];
  currentImage: number;

  // API State
  selectedAPI: string;
  apiConfigs: Record<string, APIConfig>;
  apiStatus: Record<string, APIStatus>;

  // Generation State
  isGenerating: boolean;
  generationProgress: GenerationProgress;
  generationQueue: GenerationRequest[];

  // Configuration State
  selectedOccasion: string | null;
  qualityPreset: string;
  advancedSettings: AdvancedSettings;

  // UI State
  showAdvancedPanel: boolean;
  showHistorySidebar: boolean;
  comparisonMode: ComparisonMode;

  // History State
  history: GenerationHistory[];
  favorites: string[];

  // Session State
  sessionId: string;
  totalGenerations: number;
  totalCost: number;
}

// Advanced Settings
export interface AdvancedSettings {
  facePreservation: FacePreservationConfig;
  lighting: LightingConfig;
  camera: CameraConfig;
  style: StyleConfig;
  background: BackgroundConfig;
  clothing: ClothingConfig;
  resolution: ResolutionPreset;
  qualityPreset: QualityPreset;
}

// Generation Request
export interface GenerationRequest {
  id: string;
  uploadedImage: UploadedImage;
  occasion: OccasionTemplate;
  settings: AdvancedSettings;
  api: string;
  timestamp: Date;
  priority: number;
}

// Generation History
export interface GenerationHistory {
  id: string;
  timestamp: Date;
  originalImage: string;
  generatedImage: string;
  configuration: GenerationConfig;
  api: string;
  cost: number;
  isFavorite: boolean;
  tags: string[];
}

export interface GenerationConfig {
  occasion: string;
  qualityPreset: string;
  resolution: string;
  advancedSettings: AdvancedSettings;
}

// Occasion Template
export interface OccasionTemplate {
  id: string;
  category: 'celebration' | 'professional' | 'lifestyle' | 'seasonal' | 'artistic';
  name: string;
  icon: string;
  description: string;
  basePrompt: string;
  styleModifiers: string[];
  lightingPreset: LightingConfig;
  cameraSettings: CameraConfig;
  recommendedAPIs: string[];
  thumbnail: string;
}

// API Option for UI Display
export interface APIOption {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  pricingTier: 'free' | 'paid' | 'freemium';
  requiresAuth: boolean;
  capabilities: {
    imageToImage: boolean;
    facePreservation: boolean;
    highRes: boolean;
    batchGeneration: boolean;
  };
  limits: {
    maxResolution: string;
    monthlyQuota?: number;
    rateLimit: string;
  };
}

// UI Component Props Types

export interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxFileSize: number;
  allowedFormats: string[];
  multipleUpload: boolean;
}

export interface APISelectorProps {
  apis: APIOption[];
  selectedAPI: string;
  onSelectAPI: (apiId: string) => void;
  apiStatus: Record<string, APIStatus>;
}

export interface OccasionSelectorProps {
  occasions: OccasionTemplate[];
  selectedOccasion: string | null;
  onSelectOccasion: (occasionId: string) => void;
  category?: string;
}

export interface QualitySettingsProps {
  presets: QualityPreset[];
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
}

export interface AdvancedOptionsProps {
  settings: AdvancedSettings;
  onSettingsChange: (settings: Partial<AdvancedSettings>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface ImagePreviewProps {
  originalImage?: UploadedImage;
  generatedImage?: GeneratedImage;
  comparisonMode: ComparisonMode;
  onComparisonModeChange: (mode: ComparisonMode) => void;
}

export interface GenerationProgressProps {
  progress: GenerationProgress;
  onCancel: () => void;
}

export interface DownloadManagerProps {
  image: GeneratedImage;
  onDownload: (config: DownloadConfig) => void;
}

// Comparison Mode
export type ComparisonMode = 'side-by-side' | 'slider' | 'overlay' | 'grid';

// Preview Configuration
export interface PreviewConfig {
  comparisonMode: ComparisonMode;
  zoomLevel: number;
  showMetadata: boolean;
  showPrompt: boolean;
  enableAnnotations: boolean;
}

// Image Upload Configuration
export interface ImageUploadConfig {
  maxSize: number;
  allowedFormats: string[];
  autoCompress: boolean;
  compressionQuality: number;
  faceDetection: boolean;
  multipleUpload: boolean;
  maxImages: number;
}

// Retry Configuration
export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

// Session Management
export interface SessionManager {
  saveSession(): void;
  loadSession(): void;
  clearHistory(): void;
  exportHistory(): void;
  importHistory(file: File): void;
  searchHistory(query: string): GenerationHistory[];
}

// Storage Configuration
export interface StorageConfig {
  useLocalStorage: boolean;
  useIndexedDB: boolean;
  encryptAPIKeys: boolean;
  cacheDuration: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

// Download Configuration from generation.types
import type { DownloadConfig } from './generation.types';
export type { DownloadConfig };
