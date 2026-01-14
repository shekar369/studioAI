# MASTER PROMPT: Hyper-Realistic Photo Generation Application
## Complete Production-Ready Multi-API Image Generation Platform

---

## 🎯 PROJECT OVERVIEW

Create a **complete, production-ready, single-page web application** for hyper-realistic photo generation that:

1. **Preserves original faces** from uploaded images
2. **Supports multiple AI image generation APIs** with dynamic switching
3. **Provides extensive configuration options** for quality, style, and parameters
4. **Delivers 8K-quality outputs** with professional photography standards
5. **Offers intuitive UI/UX** with real-time preview and download capabilities

---

## 🏗️ ARCHITECTURE SPECIFICATIONS

### Technology Stack

**Frontend Framework**: React 18+ with TypeScript
**Styling**: Tailwind CSS 3.x with custom design system
**State Management**: React Hooks (useState, useReducer, useContext)
**API Integration**: Fetch API with retry logic and error handling
**Build Tool**: Vite or Create React App
**Icons**: Lucide React
**Image Processing**: Canvas API for client-side processing
**File Handling**: FileReader API for base64 conversion

### Project Structure

```
photo-generation-app/
├── src/
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── APISelector.tsx
│   │   ├── OccasionSelector.tsx
│   │   ├── StyleConfigurator.tsx
│   │   ├── QualitySettings.tsx
│   │   ├── AdvancedOptions.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── GenerationProgress.tsx
│   │   └── DownloadManager.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── anthropicAPI.ts
│   │   │   ├── geminiAPI.ts
│   │   │   ├── stabilityAPI.ts
│   │   │   ├── replicateAPI.ts
│   │   │   ├── huggingfaceAPI.ts
│   │   │   └── apiFactory.ts
│   │   ├── imageProcessor.ts
│   │   └── promptBuilder.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── generation.types.ts
│   │   └── ui.types.ts
│   ├── config/
│   │   ├── apiConfigs.ts
│   │   ├── occasions.ts
│   │   ├── styles.ts
│   │   └── presets.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── imageUtils.ts
│   │   └── errorHandling.ts
│   ├── hooks/
│   │   ├── useImageGeneration.ts
│   │   ├── useAPIManager.ts
│   │   └── useLocalStorage.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 📡 API INTEGRATIONS - DETAILED SPECIFICATIONS

### 1. Anthropic Claude API (Primary)

**Endpoint**: `https://api.anthropic.com/v1/messages`
**Model**: `claude-sonnet-4-20250514`

**Implementation Requirements**:
```typescript
interface AnthropicConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  mcpServers: MCPServer[];
}

interface MCPServer {
  type: 'url';
  url: string;
  name: string;
}
```

**Features**:
- Image-to-image editing via Hugging Face MCP
- Face preservation using FLUX.1 Kontext Dev
- Multi-modal input (image + text prompt)
- Tool calling for image generation
- Streaming responses (optional)

**Configuration Options**:
- Steps: 15-50 (default: 28)
- Guidance Scale: 1.0-10.0 (default: 3.0)
- Resolution: 512x512 to 2048x2048
- Seed control for reproducibility

---

### 2. Google Gemini Flash/Pro API

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
**Models**: 
- `gemini-2.0-flash-exp` (fast, experimental)
- `gemini-pro-vision` (multimodal)
- `gemini-1.5-pro` (high quality)

**Implementation Requirements**:
```typescript
interface GeminiConfig {
  apiKey: string;
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
```

**Features**:
- Native image understanding
- Text-to-image generation via integration
- Multi-turn conversations
- Safety filtering controls

**Configuration Options**:
- Temperature: 0.0-2.0 (default: 0.9)
- Top K: 1-40 (default: 32)
- Top P: 0.0-1.0 (default: 1.0)
- Output tokens: 1024-8192
- Safety levels: BLOCK_NONE to BLOCK_MOST

---

### 3. Stability AI (SDXL, SD3)

**Endpoint**: `https://api.stability.ai/v2beta/stable-image/generate/sd3`
**Models**:
- `sd3-medium` (balanced)
- `sd3-large` (highest quality)
- `sdxl-1.0` (industry standard)

**Implementation Requirements**:
```typescript
interface StabilityConfig {
  apiKey: string;
  model: 'sd3-medium' | 'sd3-large' | 'sdxl-1.0';
  mode: 'text-to-image' | 'image-to-image';
  imageToImage?: {
    image: Blob;
    strength: number; // 0.0-1.0
  };
  parameters: {
    aspectRatio: string;
    outputFormat: 'png' | 'jpeg' | 'webp';
    seed: number;
    cfgScale: number;
    steps: number;
  };
}
```

**Features**:
- Image-to-image transformation
- ControlNet integration
- Negative prompts
- Aspect ratio control
- Style presets

**Configuration Options**:
- CFG Scale: 1-35 (default: 7)
- Steps: 10-150 (default: 40)
- Strength: 0.0-1.0 (default: 0.35)
- Aspect Ratios: 1:1, 16:9, 9:16, 4:3, 3:4
- Styles: photographic, cinematic, anime, 3d-model, etc.

---

### 4. Replicate API (Multiple Models)

**Endpoint**: `https://api.replicate.com/v1/predictions`
**Models**:
- `stability-ai/sdxl`
- `lucataco/sdxl-controlnet`
- `jagilley/controlnet-canny`
- `fofr/face-to-sticker` (face preservation)
- `tencentarc/photomaker` (face consistency)

**Implementation Requirements**:
```typescript
interface ReplicateConfig {
  apiKey: string;
  version: string; // Model version hash
  input: {
    prompt: string;
    negative_prompt?: string;
    image?: string; // URL or base64
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
```

**Features**:
- Webhook support for async generation
- Multiple model versions
- ControlNet variants
- Face-specific models
- Custom training support

**Configuration Options**:
- Schedulers: DPMSolverMultistep, DDIM, K_EULER, etc.
- Steps: 20-100 (default: 50)
- Multiple outputs: 1-4 images
- Resolution: up to 2048x2048

---

### 5. Hugging Face Inference API

**Endpoint**: `https://api-inference.huggingface.co/models/{model_id}`
**Models**:
- `stabilityai/stable-diffusion-xl-base-1.0`
- `runwayml/stable-diffusion-v1-5`
- `playgroundai/playground-v2.5-1024px-aesthetic`
- `black-forest-labs/FLUX.1-dev`

**Implementation Requirements**:
```typescript
interface HuggingFaceConfig {
  apiKey: string;
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
```

**Features**:
- Free tier available
- Model versioning
- Gradio Spaces integration
- Community models
- Custom fine-tuned models

**Configuration Options**:
- Steps: 20-100
- Guidance: 5-15
- Resolution: 512-1024
- Wait for model loading
- Cache control

---

### 6. Additional API Support (Extensible)

**Leonardo.ai**:
- Endpoint: `https://cloud.leonardo.ai/api/rest/v1/generations`
- Features: Real-time generation, model fine-tuning

**Midjourney (via API wrapper)**:
- Features: Style consistency, upscaling

**DALL-E 3 (OpenAI)**:
- Endpoint: `https://api.openai.com/v1/images/generations`
- Features: Natural language understanding

**Ideogram**:
- Features: Text rendering in images

---

## 🎨 FEATURE REQUIREMENTS - COMPREHENSIVE LIST

### Core Features

#### 1. Image Upload System

**Requirements**:
- Drag-and-drop support
- Click-to-upload functionality
- Multiple file format support: JPG, PNG, WEBP, HEIC
- File size validation (max 10MB per image)
- Image preview with thumbnails
- Multiple image upload (batch processing)
- Face detection and cropping suggestions
- Auto-rotation based on EXIF data
- Image compression before upload
- Progress indicators for large files

**Technical Implementation**:
```typescript
interface ImageUploadConfig {
  maxSize: number; // bytes
  allowedFormats: string[];
  autoCompress: boolean;
  compressionQuality: number;
  faceDetection: boolean;
  multipleUpload: boolean;
  maxImages: number;
}
```

---

#### 2. API Selector & Manager

**Requirements**:
- Visual API cards with logos and descriptions
- Dynamic API availability checking
- API key management (local storage, encrypted)
- API cost estimation (based on configuration)
- Rate limiting indicators
- API health status monitoring
- Fallback API configuration
- Multi-API comparison mode

**UI Components**:
```typescript
interface APIOption {
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
```

**Supported APIs**:
1. ✅ Anthropic Claude + Hugging Face MCP
2. ✅ Google Gemini (Flash & Pro)
3. ✅ Stability AI (SD3 & SDXL)
4. ✅ Replicate (Multiple Models)
5. ✅ Hugging Face Inference
6. ✅ Leonardo.ai
7. ✅ OpenAI DALL-E 3
8. ✅ Midjourney (API wrapper)

---

#### 3. Occasion & Style Templates

**Pre-configured Occasions** (20+ Templates):

```typescript
interface OccasionTemplate {
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
```

**Template Categories**:

**A. Celebrations** (8 templates)
1. 🎂 Birthday Party - colorful balloons, cake, festive
2. 💒 Wedding Ceremony - elegant, romantic, formal
3. 🎓 Graduation - academic, celebratory
4. 🎉 Anniversary - romantic, elegant
5. 🎊 New Year - fireworks, celebration
6. 🎃 Halloween - spooky, creative costumes
7. 🦃 Thanksgiving - warm, family gathering
8. 💝 Valentine's Day - romantic, intimate

**B. Professional** (6 templates)
1. 💼 Corporate Headshot - clean, professional
2. 👔 Business Portrait - formal, studio
3. 📸 LinkedIn Profile - approachable, professional
4. 🎬 Actor Headshot - dramatic lighting
5. 👨‍💼 Executive Portrait - powerful, confident
6. 🏢 Corporate Event - business casual

**C. Lifestyle** (8 templates)
1. 🏖️ Beach Vacation - tropical, relaxed
2. ⛰️ Mountain Adventure - outdoor, adventurous
3. 🏙️ Urban Explorer - city, modern
4. 🌅 Golden Hour Portrait - sunset, dreamy
5. 🎨 Artistic Portrait - creative, expressive
6. 💪 Fitness/Sports - athletic, energetic
7. 🧘 Wellness/Yoga - peaceful, zen
8. 🎭 Fashion/Editorial - stylish, high-fashion

**D. Seasonal** (4 templates)
1. 🎄 Christmas/Holiday - cozy, festive lights
2. 🌸 Spring Blossom - flowers, fresh
3. ☀️ Summer Vibes - bright, warm
4. 🍂 Autumn/Fall - warm tones, leaves

**E. Artistic Styles** (8 templates)
1. 🎨 Oil Painting - renaissance style
2. 🖼️ Watercolor - soft, artistic
3. 📷 Film Noir - dramatic B&W
4. 🌟 Cinematic - movie poster style
5. 🎭 Vintage - retro, aged look
6. 🔮 Fantasy/Ethereal - magical, dreamlike
7. 🤖 Sci-Fi/Futuristic - tech, neon
8. 🏛️ Classical Art - museum quality

---

#### 4. Quality & Technical Settings

**Resolution Options**:
```typescript
interface ResolutionPreset {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: number;
  recommended: string; // use case
}

const resolutions = [
  { name: 'HD', width: 1280, height: 720, aspectRatio: '16:9', megapixels: 0.9, recommended: 'Web/Social' },
  { name: 'Full HD', width: 1920, height: 1080, aspectRatio: '16:9', megapixels: 2.1, recommended: 'Standard' },
  { name: '2K', width: 2048, height: 1152, aspectRatio: '16:9', megapixels: 2.4, recommended: 'High Quality' },
  { name: '4K', width: 3840, height: 2160, aspectRatio: '16:9', megapixels: 8.3, recommended: 'Professional' },
  { name: '8K', width: 7680, height: 4320, aspectRatio: '16:9', megapixels: 33.2, recommended: 'Ultra HD' },
  { name: 'Square 1K', width: 1024, height: 1024, aspectRatio: '1:1', megapixels: 1.0, recommended: 'Social Media' },
  { name: 'Square 2K', width: 2048, height: 2048, aspectRatio: '1:1', megapixels: 4.2, recommended: 'Print' },
  { name: 'Portrait', width: 1080, height: 1920, aspectRatio: '9:16', megapixels: 2.1, recommended: 'Mobile' },
];
```

**Quality Presets**:
```typescript
interface QualityPreset {
  id: string;
  name: string;
  steps: number;
  guidanceScale: number;
  samplerMethod: string;
  denoisingStrength: number;
  estimatedTime: string;
  costMultiplier: number;
}

const qualityPresets = [
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
```

---

#### 5. Advanced Configuration Panel

**Face Preservation Settings**:
```typescript
interface FacePreservationConfig {
  enabled: boolean;
  faceDetectionModel: 'mtcnn' | 'retinaface' | 'dlib';
  preservationStrength: number; // 0.0-1.0
  multipleFaces: boolean;
  faceEnhancement: {
    enabled: boolean;
    skinSmoothing: number; // 0-100
    eyeEnhancement: boolean;
    teethWhitening: boolean;
  };
  ageAdjustment: number; // -20 to +20 years
  expressions: 'preserve' | 'smile' | 'neutral' | 'serious';
}
```

**Lighting & Photography Settings**:
```typescript
interface LightingConfig {
  type: 'natural' | 'studio' | 'dramatic' | 'soft' | 'golden-hour' | 'blue-hour';
  direction: 'front' | 'side' | 'back' | 'rim' | 'butterfly';
  intensity: number; // 0-100
  colorTemperature: number; // 2000K-10000K (warm to cool)
  shadows: {
    intensity: number;
    softness: number;
  };
  highlights: {
    intensity: number;
    bloom: boolean;
  };
}

interface CameraConfig {
  lens: '24mm' | '35mm' | '50mm' | '85mm' | '135mm' | '200mm';
  aperture: 'f/1.2' | 'f/1.4' | 'f/1.8' | 'f/2.8' | 'f/4' | 'f/5.6' | 'f/8';
  shutterSpeed: string;
  iso: number;
  bokeh: {
    enabled: boolean;
    intensity: number;
    shape: 'circular' | 'hexagonal' | 'octagonal';
  };
  filmGrain: number; // 0-100
  vignette: number; // 0-100
}
```

**Style & Artistic Controls**:
```typescript
interface StyleConfig {
  photographyStyle: 'realistic' | 'cinematic' | 'portrait' | 'fashion' | 'editorial' | 'documentary';
  colorGrading: {
    preset: 'natural' | 'warm' | 'cool' | 'vibrant' | 'muted' | 'vintage' | 'bw';
    saturation: number; // -100 to +100
    contrast: number; // -100 to +100
    brightness: number; // -100 to +100
    tint: { hue: number; strength: number };
  };
  composition: {
    ruleOfThirds: boolean;
    framing: 'tight' | 'medium' | 'wide' | 'environmental';
    perspective: 'eye-level' | 'high-angle' | 'low-angle' | 'birds-eye' | 'worms-eye';
  };
  postProcessing: {
    sharpening: number; // 0-100
    clarity: number; // 0-100
    dehaze: number; // 0-100
    skinRetouching: 'none' | 'light' | 'medium' | 'heavy';
  };
}
```

**Background & Environment**:
```typescript
interface BackgroundConfig {
  type: 'custom' | 'template' | 'original' | 'removed';
  customPrompt?: string;
  templateId?: string;
  blur: number; // 0-100
  replace: boolean;
  environment: {
    indoor: boolean;
    outdoor: boolean;
    location?: string; // e.g., "beach", "mountains", "city"
    weather?: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog';
    timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'golden-hour' | 'sunset' | 'dusk' | 'night';
  };
}
```

**Clothing & Accessories**:
```typescript
interface ClothingConfig {
  modifyClothing: boolean;
  style: 'casual' | 'business' | 'formal' | 'athletic' | 'traditional' | 'costume';
  colorScheme?: string[];
  accessories: {
    add: string[]; // e.g., ["hat", "glasses", "jewelry"]
    remove: string[];
  };
}
```

---

#### 6. Prompt Engineering System

**Automatic Prompt Builder**:
```typescript
class PromptBuilder {
  buildPrompt(config: GenerationConfig): string {
    const sections = [
      this.buildSubjectSection(config),
      this.buildFacePreservationSection(config),
      this.buildStyleSection(config),
      this.buildLightingSection(config),
      this.buildCameraSection(config),
      this.buildBackgroundSection(config),
      this.buildQualitySection(config),
      this.buildNegativePrompts(config)
    ];
    
    return sections.filter(Boolean).join(', ');
  }
  
  // Each section builds specific prompt components
}
```

**Prompt Templates**:
```typescript
const promptTemplates = {
  facePreservation: "maintain exact facial features, preserve identity, same person, facial consistency, accurate likeness",
  professionalPhotography: "professional photography, studio lighting, high-end camera, {lens} lens, {aperture}, sharp focus, detailed",
  hyperRealistic: "hyper-realistic, photorealistic, ultra detailed, 8K resolution, high quality, lifelike, natural",
  cinematic: "cinematic lighting, movie-quality, dramatic atmosphere, professional color grading, film grain",
  // ... more templates
};
```

**Negative Prompt Library**:
```typescript
const negativePrompts = {
  common: "blurry, low quality, pixelated, distorted, deformed, ugly, bad anatomy, poorly drawn",
  face: "two faces, multiple people, disfigured face, asymmetric eyes, wrong proportions",
  artifacts: "watermark, text, logo, signature, artifacts, noise, compression",
  style: "cartoon, anime, painting, sketch, drawing, illustration, 3d render",
  // ... more categories
};
```

---

#### 7. Image Preview & Comparison

**Preview Features**:
- Side-by-side original vs generated comparison
- Slider comparison tool
- Zoom and pan controls
- Before/after animation
- Grid view for multiple generations
- Metadata display (resolution, file size, generation time)
- EXIF data preservation option

**UI Implementation**:
```typescript
interface PreviewConfig {
  comparisonMode: 'side-by-side' | 'slider' | 'overlay' | 'grid';
  zoomLevel: number;
  showMetadata: boolean;
  showPrompt: boolean;
  enableAnnotations: boolean;
}
```

---

#### 8. Generation Progress & Feedback

**Progress Indicators**:
```typescript
interface GenerationProgress {
  status: 'queued' | 'processing' | 'generating' | 'upscaling' | 'complete' | 'failed';
  percentage: number;
  currentStep: number;
  totalSteps: number;
  estimatedTimeRemaining: number;
  message: string;
  logs: ProgressLog[];
}

interface ProgressLog {
  timestamp: Date;
  message: string;
  level: 'info' | 'warning' | 'error';
}
```

**Visual Feedback**:
- Animated progress bar with percentage
- Step-by-step status updates
- Estimated time remaining
- Cancel generation button
- Queue position (if applicable)
- Real-time generation preview (if API supports)

---

#### 9. Download & Export Manager

**Download Options**:
```typescript
interface DownloadConfig {
  format: 'png' | 'jpeg' | 'webp' | 'tiff';
  quality: number; // 1-100 for JPEG
  resolution: ResolutionPreset;
  includeMetadata: boolean;
  watermark: {
    enabled: boolean;
    text?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
  filename: string;
}
```

**Export Features**:
- Multiple format support
- Resolution selection for download
- Batch download (ZIP archive)
- Share to social media
- Copy to clipboard
- Save to cloud storage (Google Drive, Dropbox)
- Email generated image
- Print-ready export with proper DPI

---

#### 10. History & Session Management

**Features**:
```typescript
interface GenerationHistory {
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

interface SessionManager {
  saveSession(): void;
  loadSession(): void;
  clearHistory(): void;
  exportHistory(): void;
  importHistory(file: File): void;
  searchHistory(query: string): GenerationHistory[];
}
```

**UI Components**:
- Generation history sidebar
- Filter by date, API, occasion
- Search functionality
- Favorite/bookmark system
- Delete/export options
- Regenerate with same settings

---

## 🎨 UI/UX DESIGN SPECIFICATIONS

### Design System

**Color Palette**:
```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  /* Secondary Colors */
  --color-secondary-50: #faf5ff;
  --color-secondary-500: #a855f7;
  --color-secondary-900: #581c87;
  
  /* Accent Colors */
  --color-accent-pink: #ec4899;
  --color-accent-purple: #8b5cf6;
  --color-accent-indigo: #6366f1;
  
  /* Neutrals */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

**Typography**:
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Poppins', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

**Spacing System**:
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

---

### Layout Structure

**Main Layout**:
```
┌─────────────────────────────────────────────────────┐
│                    Header (Fixed)                     │
│  Logo | Navigation | API Selector | Settings | Help  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │                  │  │                          │ │
│  │  Upload Zone     │  │   Preview & Results      │ │
│  │  ┌────────────┐  │  │                          │ │
│  │  │ Drop Image │  │  │   ┌──────────────────┐   │ │
│  │  │   or       │  │  │   │  Generated Image  │   │ │
│  │  │   Click    │  │  │   │                  │   │ │
│  │  └────────────┘  │  │   └──────────────────┘   │ │
│  │                  │  │                          │ │
│  ├──────────────────┤  │   [Download] [Share]     │ │
│  │  Occasion        │  │   [Regenerate] [Edit]    │ │
│  │  Selection       │  └──────────────────────────┘ │
│  │  ┌─┐ ┌─┐ ┌─┐    │                                │
│  │  │🎂│ │💒│ │🎓│   │  ┌─────────────────────────┐  │
│  │  └─┘ └─┘ └─┘    │  │  Advanced Configuration  │  │
│  │                  │  │  ├─ Style Settings       │  │
│  ├──────────────────┤  │  ├─ Lighting Controls    │  │
│  │  Quality         │  │  ├─ Camera Settings      │  │
│  │  Settings        │  │  ├─ Face Preservation    │  │
│  │  ● Standard      │  │  └─ Background Options   │  │
│  │  ○ High          │  └─────────────────────────┘  │
│  │  ○ Ultra         │                                │
│  │                  │                                │
│  ├──────────────────┤                                │
│  │  [Generate]      │                                │
│  └──────────────────┘                                │
│                                                       │
├─────────────────────────────────────────────────────┤
│  History Sidebar (Collapsible)                       │
└─────────────────────────────────────────────────────┘
```

---

### Component Design Guidelines

#### 1. Image Uploader Component

**Design**:
- Large, prominent drop zone with dashed border
- Hover state with color change
- File type icons display
- Drag-over animation
- Progress indicator for upload
- Thumbnail preview after upload
- Edit/remove buttons
- Multiple image grid layout

**Interactions**:
- Drag and drop
- Click to browse
- Paste from clipboard
- Camera capture (mobile)
- URL import

---

#### 2. API Selector Component

**Design**:
- Card-based layout with logos
- Badge indicators (free, premium, beta)
- Feature comparison tooltip
- Color-coded status indicators
- Expandable details panel
- API key input modal

**States**:
- Available (green)
- Needs authentication (yellow)
- Rate limited (orange)
- Unavailable (red)
- Selected (highlighted)

---

#### 3. Occasion Selector Component

**Design**:
- Grid of cards with icons
- Category tabs/filters
- Search/filter functionality
- Hover preview of sample results
- Selected state with checkmark
- Custom occasion creation button

**Interaction**:
- Single click to select
- Hover to preview
- Double-click for instant generation

---

#### 4. Advanced Settings Panel

**Design**:
- Collapsible accordion sections
- Slider controls with value display
- Toggle switches for boolean options
- Dropdown selects for enums
- Color pickers for color options
- Preset buttons for quick selection
- Reset to defaults button
- Save preset functionality

**Sections**:
- General Settings
- Face Preservation
- Lighting & Photography
- Style & Color Grading
- Background & Environment
- Camera Settings
- Post-Processing

---

#### 5. Preview Component

**Design**:
- Large image display area
- Zoom controls (fit, fill, 1:1, custom)
- Pan functionality
- Comparison slider (before/after)
- Metadata overlay (toggleable)
- Full-screen mode
- Loading skeleton/placeholder

**Tools**:
- Zoom in/out
- Pan
- Rotate
- Compare (slider)
- Full screen
- Show metadata
- Download
- Share
- Edit/regenerate

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### State Management

```typescript
interface AppState {
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
```

---

### API Service Layer

```typescript
// Base API Interface
interface ImageGenerationAPI {
  name: string;
  authenticate(apiKey: string): Promise<boolean>;
  checkAvailability(): Promise<boolean>;
  generateImage(config: GenerationConfig): Promise<GeneratedImage>;
  getStatus(jobId: string): Promise<GenerationStatus>;
  cancelGeneration(jobId: string): Promise<boolean>;
  estimateCost(config: GenerationConfig): number;
}

// API Factory Pattern
class APIFactory {
  createAPI(apiType: string): ImageGenerationAPI {
    switch (apiType) {
      case 'anthropic':
        return new AnthropicAPI();
      case 'gemini':
        return new GeminiAPI();
      case 'stability':
        return new StabilityAPI();
      case 'replicate':
        return new ReplicateAPI();
      case 'huggingface':
        return new HuggingFaceAPI();
      default:
        throw new Error(`Unknown API type: ${apiType}`);
    }
  }
}
```

---

### Error Handling & Retry Logic

```typescript
class APIRequestHandler {
  async executeWithRetry<T>(
    request: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
        
        if (!this.isRetryableError(error) || attempt === options.maxRetries) {
          throw error;
        }
        
        const delay = this.calculateBackoff(attempt, options);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  private isRetryableError(error: Error): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes((error as any).status);
  }
  
  private calculateBackoff(attempt: number, options: RetryOptions): number {
    return options.baseDelay * Math.pow(2, attempt - 1);
  }
}
```

---

### Image Processing Utilities

```typescript
class ImageProcessor {
  // Compress image before upload
  async compressImage(file: File, quality: number): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality);
    });
  }
  
  // Convert image to base64
  async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  // Detect faces in image
  async detectFaces(imageData: ImageData): Promise<FaceDetection[]> {
    // Implement face detection logic
    // Can use face-api.js or similar library
  }
  
  // Resize image to target dimensions
  async resize(image: HTMLImageElement, width: number, height: number): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0, width, height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  }
}
```

---

### Local Storage & Caching

```typescript
class StorageManager {
  // Save configuration
  saveConfig(key: string, config: any): void {
    localStorage.setItem(key, JSON.stringify(config));
  }
  
  // Load configuration
  loadConfig<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  
  // Save generation history
  saveHistory(history: GenerationHistory[]): void {
    // Use IndexedDB for large data
    const db = await this.openDatabase();
    const transaction = db.transaction(['history'], 'readwrite');
    const store = transaction.objectStore('history');
    
    history.forEach(item => store.put(item));
  }
  
  // Cache API responses
  cacheResponse(key: string, response: any, ttl: number): void {
    const cached = {
      data: response,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cached));
  }
  
  // Get cached response
  getCachedResponse(key: string): any | null {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;
    
    const { data, timestamp, ttl } = JSON.parse(cached);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return data;
  }
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Mobile Optimizations

- Touch-friendly tap targets (min 44x44px)
- Swipe gestures for comparison
- Bottom sheet for settings
- Sticky header with minimal height
- Optimized image loading
- Reduced animation complexity
- Simplified navigation

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- API service methods
- Image processing utilities
- Prompt builder logic
- State management
- Validation functions

### Integration Tests
- API integration flows
- Image upload and processing
- Generation pipeline
- Download functionality

### E2E Tests
- Complete generation flow
- Multi-API switching
- Error handling scenarios
- Mobile responsiveness

---

## 📦 DEPLOYMENT SPECIFICATIONS

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'api-services': ['./src/services/api'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
});
```

### Environment Variables

```env
# Required API Keys
VITE_ANTHROPIC_API_KEY=
VITE_GEMINI_API_KEY=
VITE_STABILITY_API_KEY=
VITE_REPLICATE_API_TOKEN=
VITE_HUGGINGFACE_API_KEY=
VITE_LEONARDO_API_KEY=
VITE_OPENAI_API_KEY=

# Optional Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_DEFAULT_API=anthropic
VITE_ENABLE_ANALYTICS=false
VITE_CACHE_TTL=3600000
```

---

## 📖 DOCUMENTATION REQUIREMENTS

### README.md Structure

1. Project Overview
2. Features List
3. Installation Instructions
4. API Setup Guide
5. Usage Examples
6. Configuration Options
7. Troubleshooting
8. Contributing Guidelines
9. License Information

### In-App Help System

- Tooltips for all controls
- Interactive tutorial on first use
- Context-sensitive help
- FAQ section
- Video tutorials (optional)

---

## 🎯 DELIVERABLES CHECKLIST

### Code Deliverables

- [ ] Complete React TypeScript application
- [ ] All component files properly organized
- [ ] API service layer with all integrations
- [ ] Utility functions and helpers
- [ ] Type definitions for all interfaces
- [ ] Configuration files (tsconfig, tailwind, vite)
- [ ] Package.json with all dependencies
- [ ] Environment variable template

### Documentation Deliverables

- [ ] Comprehensive README.md
- [ ] API integration guides
- [ ] Component documentation
- [ ] Configuration guide
- [ ] Deployment instructions
- [ ] Troubleshooting guide

### Testing Deliverables

- [ ] Unit test suite
- [ ] Integration tests
- [ ] E2E test scenarios
- [ ] Test coverage report

---

## 🚀 IMPLEMENTATION INSTRUCTIONS FOR CLAUDE CODE

### Step 1: Project Initialization

```bash
# Create new React + TypeScript + Vite project
npm create vite@latest photo-generation-app -- --template react-ts

# Navigate to project
cd photo-generation-app

# Install dependencies
npm install

# Install additional packages
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 2: Project Structure Setup

Create the complete folder structure as specified in the Architecture section.

### Step 3: Implementation Order

1. **Setup Base Configuration**
   - Configure Tailwind CSS
   - Setup TypeScript paths
   - Create type definitions

2. **Implement Core Components**
   - ImageUploader
   - APISelector
   - OccasionSelector
   - QualitySettings
   - ImagePreview

3. **Build API Services**
   - Create base API interface
   - Implement each API integration
   - Add error handling and retry logic

4. **Add Advanced Features**
   - Face preservation settings
   - Advanced configuration panel
   - Prompt builder system
   - Generation progress tracking

5. **Implement State Management**
   - Setup app-wide state
   - Create custom hooks
   - Add local storage persistence

6. **Polish UI/UX**
   - Responsive design
   - Animations and transitions
   - Loading states
   - Error displays

7. **Add History & Download**
   - Generation history
   - Download manager
   - Export functionality

8. **Testing & Documentation**
   - Write tests
   - Create documentation
   - Add in-app help

---

## 🎨 DESIGN SYSTEM TOKENS

Create a comprehensive design token system:

```typescript
// src/config/designTokens.ts
export const designTokens = {
  colors: { /* color definitions */ },
  typography: { /* font definitions */ },
  spacing: { /* spacing scale */ },
  shadows: { /* shadow definitions */ },
  borderRadius: { /* radius scale */ },
  transitions: { /* animation definitions */ },
  zIndex: { /* z-index scale */ }
};
```

---

## 🔒 SECURITY CONSIDERATIONS

1. **API Key Management**
   - Never expose API keys in frontend code
   - Use environment variables
   - Implement secure storage
   - Add key rotation capability

2. **Input Validation**
   - Validate file types and sizes
   - Sanitize user inputs
   - Prevent XSS attacks
   - Rate limiting on client side

3. **Data Privacy**
   - No server-side storage of images
   - Clear privacy policy
   - GDPR compliance
   - User consent for data usage

---

## 🎯 SUCCESS CRITERIA

The application is considered complete when:

1. ✅ All API integrations are functional
2. ✅ Face preservation works accurately
3. ✅ UI is responsive across all devices
4. ✅ Generation quality meets 8K standards
5. ✅ Error handling is robust
6. ✅ Performance is optimized (fast load times)
7. ✅ Documentation is comprehensive
8. ✅ Code is well-structured and maintainable
9. ✅ All features work as specified
10. ✅ Tests pass with good coverage

---

## 🎊 FINAL NOTES

This master prompt provides a **complete specification** for building a production-ready, multi-API photo generation application. Follow the specifications exactly, maintain code quality, and ensure all features are implemented as described.

**Generate the complete application with:**
- Clean, maintainable code
- Proper TypeScript typing
- Comprehensive error handling
- Beautiful, responsive UI
- Excellent user experience
- Production-ready quality

---

## 📞 SUPPORT & MAINTENANCE

Include in the application:
- Version number display
- Changelog section
- Bug report functionality
- Feature request system
- Community links (if applicable)

---

**END OF MASTER PROMPT**

*This document serves as the complete specification for Claude Code to generate a fully functional, production-ready photo generation application with multiple API integrations and extensive configuration options.*
