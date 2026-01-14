// API Configuration Types

export interface APIConfig {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  isEnabled: boolean;
  capabilities: APICapabilities;
  limits: APILimits;
}

export interface APICapabilities {
  imageToImage: boolean;
  textToImage: boolean;
  facePreservation: boolean;
  highResolution: boolean;
  batchGeneration: boolean;
  streaming: boolean;
}

export interface APILimits {
  maxResolution: { width: number; height: number };
  maxFileSize: number;
  monthlyQuota?: number;
  rateLimit: string;
}

export interface APIStatus {
  available: boolean;
  authenticated: boolean;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  errorMessage?: string;
}

// Anthropic API Types
export interface AnthropicConfig extends APIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  mcpServers: MCPServer[];
}

export interface MCPServer {
  type: 'url';
  url: string;
  name: string;
}

// Gemini API Types
export interface GeminiConfig extends APIConfig {
  model: 'gemini-2.0-flash-exp' | 'gemini-pro-vision' | 'gemini-1.5-pro';
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
    candidateCount: number;
  };
  safetySettings: SafetySetting[];
}

export interface SafetySetting {
  category: string;
  threshold: 'BLOCK_NONE' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_MOST';
}

// Stability AI Types
export interface StabilityConfig extends APIConfig {
  model: 'sd3-medium' | 'sd3-large' | 'sdxl-1.0';
  mode: 'text-to-image' | 'image-to-image';
  imageToImage?: {
    image: Blob;
    strength: number;
  };
  parameters: {
    aspectRatio: string;
    outputFormat: 'png' | 'jpeg' | 'webp';
    seed?: number;
    cfgScale: number;
    steps: number;
  };
}

// Replicate API Types
export interface ReplicateConfig extends APIConfig {
  version: string;
  input: {
    prompt: string;
    negative_prompt?: string;
    image?: string;
    num_outputs: number;
    num_inference_steps: number;
    guidance_scale: number;
    scheduler: string;
    width: number;
    height: number;
    seed?: number;
  };
  webhook?: string;
}

// Hugging Face API Types
export interface HuggingFaceConfig extends APIConfig {
  modelId: string;
  parameters: {
    prompt: string;
    negative_prompt?: string;
    num_inference_steps: number;
    guidance_scale: number;
    width: number;
    height: number;
    seed?: number;
  };
  options: {
    wait_for_model: boolean;
    use_cache: boolean;
  };
}

// Base API Interface
export interface ImageGenerationAPI {
  name: string;
  authenticate(apiKey: string): Promise<boolean>;
  checkAvailability(): Promise<boolean>;
  generateImage(config: GenerationConfig, image?: Blob): Promise<GeneratedImage>;
  getStatus(jobId: string): Promise<GenerationStatus>;
  cancelGeneration(jobId: string): Promise<boolean>;
  estimateCost(config: GenerationConfig): number;
}

// Generation Types
export interface GenerationConfig {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  steps: number;
  guidanceScale: number;
  seed?: number;
  numImages: number;
  quality: QualityPresetId;
  [key: string]: any;
}

export interface GeneratedImage {
  id: string;
  url: string;
  blob?: Blob;
  width: number;
  height: number;
  format: string;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  prompt: string;
  negativePrompt?: string;
  model: string;
  steps: number;
  guidanceScale: number;
  seed?: number;
  generationTime: number;
  api: string;
  timestamp: Date;
}

export interface GenerationStatus {
  status: 'queued' | 'processing' | 'generating' | 'upscaling' | 'complete' | 'failed';
  progress: number;
  estimatedTime?: number;
  result?: GeneratedImage;
  error?: string;
}

export type QualityPresetId = 'draft' | 'standard' | 'high' | 'ultra' | 'maximum';
