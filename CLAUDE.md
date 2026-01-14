# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Studio AI - Hyper-Realistic Photo Generation Application**

A production-ready, single-page web application for AI-powered hyper-realistic photo generation with face preservation capabilities. Supports multiple AI image generation APIs with dynamic switching, extensive configuration options, and 8K-quality outputs.

### Key Capabilities
- Face preservation from uploaded images using advanced AI models
- Multi-API support (Anthropic Claude, Google Gemini, Stability AI, Replicate, Hugging Face)
- 34+ pre-configured occasion and style templates
- Professional photography controls (lighting, camera settings, color grading)
- Real-time preview and comparison tools
- 8K resolution output support

## Technology Stack

**Frontend**: React 18+ with TypeScript
**Styling**: Tailwind CSS 3.x with custom design system
**State Management**: React Hooks (useState, useReducer, useContext)
**Build Tool**: Vite
**Icons**: Lucide React
**Image Processing**: Canvas API for client-side operations
**File Handling**: FileReader API for base64 conversion

## Project Structure

```
photo-generation-app/
├── src/
│   ├── components/          # React UI components
│   │   ├── ImageUploader.tsx
│   │   ├── APISelector.tsx
│   │   ├── OccasionSelector.tsx
│   │   ├── StyleConfigurator.tsx
│   │   ├── QualitySettings.tsx
│   │   ├── AdvancedOptions.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── GenerationProgress.tsx
│   │   └── DownloadManager.tsx
│   ├── services/            # Business logic and API integrations
│   │   ├── api/
│   │   │   ├── anthropicAPI.ts
│   │   │   ├── geminiAPI.ts
│   │   │   ├── stabilityAPI.ts
│   │   │   ├── replicateAPI.ts
│   │   │   ├── huggingfaceAPI.ts
│   │   │   └── apiFactory.ts
│   │   ├── imageProcessor.ts
│   │   └── promptBuilder.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── api.types.ts
│   │   ├── generation.types.ts
│   │   └── ui.types.ts
│   ├── config/              # Configuration and presets
│   │   ├── apiConfigs.ts
│   │   ├── occasions.ts
│   │   ├── styles.ts
│   │   └── presets.ts
│   ├── utils/               # Helper functions
│   │   ├── validation.ts
│   │   ├── imageUtils.ts
│   │   └── errorHandling.ts
│   ├── hooks/               # Custom React hooks
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

## Development Commands

### Initial Setup
```bash
# Create project (if not exists)
npm create vite@latest photo-generation-app -- --template react-ts
cd photo-generation-app

# Install dependencies
npm install

# Install additional packages
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code (if configured)
npm run lint
```

## API Integration Architecture

### API Factory Pattern
All API integrations implement a common interface:

```typescript
interface ImageGenerationAPI {
  name: string;
  authenticate(apiKey: string): Promise<boolean>;
  checkAvailability(): Promise<boolean>;
  generateImage(config: GenerationConfig): Promise<GeneratedImage>;
  getStatus(jobId: string): Promise<GenerationStatus>;
  cancelGeneration(jobId: string): Promise<boolean>;
  estimateCost(config: GenerationConfig): number;
}
```

### Supported APIs

1. **Anthropic Claude API** (Primary)
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - Model: `claude-sonnet-4-20250514`
   - Uses Hugging Face MCP for image generation
   - Face preservation via FLUX.1 Kontext Dev

2. **Google Gemini API**
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
   - Models: gemini-2.0-flash-exp, gemini-pro-vision, gemini-1.5-pro

3. **Stability AI**
   - Endpoint: `https://api.stability.ai/v2beta/stable-image/generate/sd3`
   - Models: sd3-medium, sd3-large, sdxl-1.0

4. **Replicate**
   - Endpoint: `https://api.replicate.com/v1/predictions`
   - Multiple models including face-specific variants

5. **Hugging Face Inference**
   - Endpoint: `https://api-inference.huggingface.co/models/{model_id}`
   - Models: FLUX.1-dev, SDXL, Playground-v2.5

### API Configuration Storage
- API keys stored in localStorage (encrypted)
- Configuration persisted between sessions
- Support for environment variables via `.env` files

## Core Feature Implementation

### Image Upload System
- Drag-and-drop support with visual feedback
- Multiple formats: JPG, PNG, WEBP, HEIC
- Max file size: 10MB per image
- Auto-compression before processing
- Face detection for cropping suggestions
- EXIF data handling for rotation

### Face Preservation Technology
```typescript
interface FacePreservationConfig {
  enabled: boolean;
  faceDetectionModel: 'mtcnn' | 'retinaface' | 'dlib';
  preservationStrength: number; // 0.0-1.0
  multipleFaces: boolean;
  faceEnhancement: {
    enabled: boolean;
    skinSmoothing: number;
    eyeEnhancement: boolean;
    teethWhitening: boolean;
  };
}
```

### Occasion Templates (34+ Templates)
Organized into 5 categories:
- **Celebrations** (8): Birthday, Wedding, Graduation, Anniversary, etc.
- **Professional** (6): Corporate Headshot, LinkedIn Profile, Business Portrait
- **Lifestyle** (8): Beach Vacation, Mountain Adventure, Urban Explorer
- **Seasonal** (4): Christmas, Spring Blossom, Summer, Autumn
- **Artistic** (8): Oil Painting, Watercolor, Film Noir, Cinematic

Each template includes:
- Base prompt with style modifiers
- Lighting presets
- Camera settings
- Recommended APIs

### Quality Presets
```typescript
const qualityPresets = [
  { id: 'draft', steps: 15, time: '10-15s', cost: 0.5x },
  { id: 'standard', steps: 25, time: '20-30s', cost: 1.0x },
  { id: 'high', steps: 35, time: '30-45s', cost: 1.5x },
  { id: 'ultra', steps: 50, time: '60-90s', cost: 2.5x },
  { id: 'maximum', steps: 75, time: '2-3min', cost: 4.0x }
];
```

### Advanced Photography Controls

**Lighting Configuration**:
- Type: natural, studio, dramatic, soft, golden-hour, blue-hour
- Direction: front, side, back, rim, butterfly
- Color temperature: 2000K-10000K
- Shadow and highlight control

**Camera Settings**:
- Lens: 24mm, 35mm, 50mm, 85mm, 135mm, 200mm
- Aperture: f/1.2 to f/8
- Bokeh effects with customizable shapes
- Film grain and vignette controls

**Color Grading**:
- Presets: natural, warm, cool, vibrant, muted, vintage, B&W
- Manual controls: saturation, contrast, brightness
- Tint adjustment

## State Management

Central application state:
```typescript
interface AppState {
  uploadedImages: UploadedImage[];
  generatedImages: GeneratedImage[];
  selectedAPI: string;
  apiConfigs: Record<string, APIConfig>;
  isGenerating: boolean;
  generationProgress: GenerationProgress;
  selectedOccasion: string | null;
  qualityPreset: string;
  advancedSettings: AdvancedSettings;
  history: GenerationHistory[];
}
```

State persisted to localStorage for session continuity.

## Error Handling & Retry Logic

All API requests use exponential backoff retry logic:
- Retryable status codes: 408, 429, 500, 502, 503, 504
- Base delay: configurable (default 1000ms)
- Max retries: 3
- Automatic fallback to alternative APIs on failure

## Image Processing Pipeline

1. **Upload & Validation**
   - File type and size validation
   - EXIF data extraction
   - Auto-rotation based on orientation

2. **Pre-processing**
   - Face detection
   - Image compression
   - Base64 conversion for API transmission

3. **Generation**
   - Prompt building based on configuration
   - API request with retry logic
   - Progress tracking

4. **Post-processing**
   - Resolution upscaling (if needed)
   - Format conversion
   - Metadata embedding

5. **Download/Export**
   - Multiple format support (PNG, JPEG, WEBP, TIFF)
   - Quality control
   - Optional watermarking

## Resolution Support

```typescript
const resolutions = [
  { name: 'HD', width: 1280, height: 720, use: 'Web/Social' },
  { name: 'Full HD', width: 1920, height: 1080, use: 'Standard' },
  { name: '2K', width: 2048, height: 1152, use: 'High Quality' },
  { name: '4K', width: 3840, height: 2160, use: 'Professional' },
  { name: '8K', width: 7680, height: 4320, use: 'Ultra HD' },
  { name: 'Square 1K', width: 1024, height: 1024, use: 'Social Media' },
  { name: 'Square 2K', width: 2048, height: 2048, use: 'Print' }
];
```

## Design System

### Color Palette
- Primary: Blue (#3b82f6)
- Secondary: Purple (#a855f7)
- Accent: Pink (#ec4899)
- Semantic: Success (#10b981), Warning (#f59e0b), Error (#ef4444)

### Typography
- Primary Font: Inter
- Heading Font: Poppins
- Monospace: JetBrains Mono

### Spacing Scale
Follows 4px base unit: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Responsive Breakpoints
- sm: 640px (mobile)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

## Security Considerations

1. **API Key Management**
   - Never expose keys in frontend code
   - Use environment variables for development
   - Encrypt keys before localStorage storage
   - Implement key rotation capability

2. **Input Validation**
   - Strict file type and size validation
   - Sanitize all user inputs
   - XSS prevention
   - Client-side rate limiting

3. **Privacy**
   - No server-side image storage
   - Client-side processing only
   - Clear data on session end option
   - GDPR compliance considerations

## Environment Variables

Create `.env` file in root:
```env
# API Keys (optional - can be entered in UI)
VITE_ANTHROPIC_API_KEY=
VITE_GEMINI_API_KEY=
VITE_STABILITY_API_KEY=
VITE_REPLICATE_API_TOKEN=
VITE_HUGGINGFACE_API_KEY=

# Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_DEFAULT_API=anthropic
VITE_CACHE_TTL=3600000
```

## Testing Strategy

### Free API Options for Testing
- **Hugging Face Inference API**: Free tier available
- **Replicate**: Free trial credits
- **Google Gemini**: Free tier with quota

### Testing Approach
1. Test with free APIs first
2. Verify UI/UX with mock data
3. Test error handling with invalid inputs
4. Validate responsive design on multiple devices
5. Test generation pipeline with various image sizes

## Implementation Priority

### Phase 1 - Foundation (Session 1)
1. Project initialization and configuration
2. Basic UI layout and navigation
3. Type definitions and interfaces
4. Core components (ImageUploader, APISelector)

### Phase 2 - Core Features (Session 2)
1. API service layer with factory pattern
2. At least 2 working API integrations (Hugging Face + Gemini)
3. Basic image generation pipeline
4. Simple prompt builder

### Phase 3 - Advanced Features (Session 3)
1. Occasion template system
2. Advanced configuration panel
3. Face preservation settings
4. Quality presets

### Phase 4 - Polish (Session 4)
1. Download manager
2. History and session management
3. Responsive design refinements
4. Error handling improvements

## Known Limitations

- Face preservation quality depends on API model capabilities
- 8K generation may require paid API tiers
- Client-side processing limited by browser capabilities
- Real-time preview depends on API support

## Troubleshooting

### Common Issues

**Images not generating**:
- Verify API key is valid
- Check browser console for errors
- Ensure file size is under 10MB
- Try switching to alternative API

**Slow generation**:
- Reduce quality preset
- Lower resolution setting
- Check internet connection
- Verify API rate limits

**Face preservation not working**:
- Ensure face is clearly visible in uploaded image
- Try increasing preservation strength
- Use APIs with better face consistency (Replicate PhotoMaker)

## Architecture Principles

1. **Modular Design**: Each API integration is independent and swappable
2. **Type Safety**: Comprehensive TypeScript types for all data structures
3. **Error Resilience**: Graceful degradation with fallback options
4. **Performance**: Lazy loading, code splitting, optimized bundle
5. **User Experience**: Progressive disclosure, clear feedback, intuitive controls
6. **Maintainability**: Clear separation of concerns, documented code
7. **Extensibility**: Easy to add new APIs, templates, and features

## Success Criteria

Application is production-ready when:
- ✅ At least 3 API integrations functional
- ✅ Face preservation working with test images
- ✅ All 34+ occasion templates implemented
- ✅ Responsive UI works on mobile and desktop
- ✅ Image upload and download working
- ✅ Quality presets produce expected results
- ✅ Error handling prevents crashes
- ✅ Basic testing completed with free APIs
- ✅ Documentation complete
- ✅ Code is maintainable and well-structured

## Future Enhancements

- Backend API proxy for secure key management
- User authentication and cloud storage
- Batch processing for multiple images
- Custom model fine-tuning
- Social media integration
- Advanced face editing tools
- Video generation support
- Mobile app version
