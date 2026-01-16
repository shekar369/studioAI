# Studio AI - Professional Photo Enhancement Platform

Transform your photos into professional-quality images with AI-powered enhancement and face preservation technology.

## Features

### Core Capabilities
- **Face Preservation Technology**: Maintains original facial identity, skin tone, age, and features
- **34+ Occasion Templates**: Pre-configured styles for birthdays, weddings, graduations, holidays, and professional settings
- **Multi-API Support**: Integrates with OpenAI, Hugging Face, and Google Gemini
- **Real-time Preview**: Side-by-side comparison of original and enhanced images
- **High-Quality Output**: Professional DSLR-style results with cinematic lighting

### Key Features
- **Quick Demo Mode**: Fast birthday photo generation with one click
- **Full Application Mode**: Complete customization with 34 templates across 5 categories
- **Settings Management**: Easy API key configuration and testing
- **Quality Presets**: Draft, Standard, High Quality, and Ultra options
- **Secure Storage**: API keys stored locally in browser (never sent to external servers)

## Categories & Templates

### 1. Celebrations (7 templates)
Birthday Party, Wedding, Anniversary, Graduation, Baby Shower, Engagement, Bridal Shower

### 2. Holidays (9 templates)
Christmas, New Year, Halloween, Thanksgiving, Valentine's Day, Easter, Diwali, Holi, Ramadan

### 3. Professional (6 templates)
Business Portrait, LinkedIn Profile, Corporate Headshot, Conference Speaker, Professional Casual, Team Photo

### 4. Events (7 templates)
Concert, Festival, Beach Party, Pool Party, Garden Party, Formal Gala, Cocktail Party

### 5. Casual & Fun (5 templates)
Travel Adventure, Fitness, Gaming, Foodie, Pet Lover

## Technology Stack

- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.1.18
- **AI Models**:
  - OpenAI gpt-image-1 (Face preservation)
  - OpenAI DALL-E 3 (High-quality generation)
  - Hugging Face FLUX.1-dev
  - Google Gemini 2.0 Flash
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys from OpenAI (recommended for best results)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/shekar369/studioAI.git
cd studioAI
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_HUGGINGFACE_API_KEY=your-huggingface-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

4. Start the application:
```bash
npm start
```

This will launch:
- Frontend: http://localhost:5173
- Proxy Server: http://localhost:3001

## Getting API Keys

### OpenAI (Recommended)
1. Visit [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-proj-...`)

**Cost**: ~$0.04 per image edit with gpt-image-1

### Hugging Face (Free Tier)
1. Visit [huggingface.co](https://huggingface.co/)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create new token (Read access)
5. Copy the token (starts with `hf_...`)

**Cost**: Free tier available with rate limits

### Google Gemini (Free Tier)
1. Visit [ai.google.dev](https://ai.google.dev/)
2. Click "Get API Key"
3. Create or select project
4. Generate API key
5. Copy the key

**Cost**: Free tier available (1,500 requests/month)

## Usage

### Quick Demo Mode
1. Click on "Quick Demo" tab
2. Upload your photo (JPG, PNG, or WEBP, max 10MB)
3. Click "Generate Birthday Photo"
4. Download your enhanced image

### Full Application Mode
1. Click on "Full Application" tab
2. Upload your photo
3. Select API provider (OpenAI recommended)
4. Choose an occasion from 34 templates
5. Select quality preset
6. Click "Generate Image"
7. Preview and download result

### Settings Page
1. Click on "Settings" tab
2. Enter your API keys for each provider
3. Click "Test" to validate keys
4. Click "Save" to store locally
5. Select default model preferences

## Project Structure

```
photo-generation-app/
├── src/
│   ├── components/         # React components
│   │   ├── APISelector.tsx
│   │   ├── DemoPage.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── OccasionSelector.tsx
│   │   ├── SettingsPage.tsx
│   │   └── ...
│   ├── config/            # Configuration files
│   │   ├── apiConfigs.ts
│   │   ├── occasions.ts
│   │   ├── presets.ts
│   │   └── styles.ts
│   ├── services/          # API services
│   │   ├── api/
│   │   │   ├── openaiAPI.ts
│   │   │   ├── huggingfaceAPI.ts
│   │   │   ├── geminiAPI.ts
│   │   │   └── apiFactory.ts
│   │   └── promptBuilder.ts
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application
├── proxy-server.js        # CORS proxy for Hugging Face
├── .env                   # Environment variables
└── package.json
```

## Development

### Available Scripts

```bash
# Start development server and proxy
npm start

# Start only frontend (port 5173)
npm run dev

# Start only proxy server (port 3001)
npm run proxy

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding New Templates

Edit `src/config/occasions.ts`:

```typescript
{
  id: 'custom-event',
  category: 'events',
  name: 'Custom Event',
  icon: '🎉',
  basePrompt: 'your custom prompt here',
  styleModifiers: ['style1', 'style2'],
  lightingPreset: { type: 'natural', direction: 'front', intensity: 80 }
}
```

## Architecture

### Face Preservation Technology
The application uses OpenAI's gpt-image-1 model with the `/images/edits` endpoint to maintain facial identity while applying thematic enhancements. The prompt engineering includes absolute constraints:
- Preserve original facial identity exactly
- Same face shape, skin tone, age, gender, ethnicity
- No face swapping or beautification
- Maintain natural skin texture

### Image Processing Flow
1. User uploads image → Stored as Blob
2. Select occasion → Prompt built with template + constraints
3. API call → OpenAI image editing endpoint
4. Base64 response → Converted to Blob (avoids CORS)
5. Display and download

### CORS Handling
The application includes a Node.js/Express proxy server to handle Hugging Face API calls, bypassing browser CORS restrictions.

## Troubleshooting

### Common Issues

**Error: API key not configured**
- Check `.env` file exists in root directory
- Verify key format (OpenAI: `sk-proj-...`, Hugging Face: `hf_...`)
- Restart the dev server after adding keys

**Error: Failed to fetch / CORS policy**
- Ensure proxy server is running (`npm run proxy`)
- Check proxy server console for errors
- For OpenAI, ensure using base64 format (already configured)

**Error: Generate button not active**
- Upload an image first
- Select an occasion template
- Verify API key is saved in Settings page
- Check browser console for authentication errors

**Poor quality results**
- Switch to OpenAI API for best face preservation
- Use "High Quality" or "Ultra" preset
- Ensure uploaded photo is clear and well-lit
- Try different occasion templates

**Models returning 410 errors**
- Some Hugging Face models may be unavailable
- Switch to OpenAI (most reliable)
- Check model status on Hugging Face website

### Browser Console
Press F12 to open developer tools and check console for detailed error messages.

### Clear Settings
If experiencing persistent issues:
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Reload page
4. Re-enter API keys in Settings

## Security Notes

- API keys are stored in browser localStorage only
- Keys are never sent to any server except the respective API providers
- For production deployment, use environment variables on server
- Never commit `.env` file to version control
- Never share API keys publicly

## Cost Considerations

### OpenAI Pricing (Best Quality)
- gpt-image-1 (Image Editing): ~$0.04 per edit
- DALL-E 3 Standard: $0.04 per image
- DALL-E 3 HD: $0.08 per image
- DALL-E 2: $0.02 per image

### Hugging Face (Free Tier)
- Free tier: 1,000 requests/month
- Rate limit: 30 requests/minute
- Some models may be unavailable

### Google Gemini (Free Tier)
- Free tier: 1,500 requests/month
- Rate limit: 60 requests/minute
- Lower quality for photo editing

**Recommendation**: Use OpenAI for production with face preservation requirements.

## Roadmap

- [ ] Batch processing support
- [ ] Advanced lighting and camera controls
- [ ] Generation history with favorites
- [ ] Custom template builder
- [ ] Mobile app version
- [ ] Stability AI integration
- [ ] Replicate API support
- [ ] Social sharing features

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Shekar**
- GitHub: [@shekar369](https://github.com/shekar369)
- Repository: [studioAI](https://github.com/shekar369/studioAI)

## Acknowledgments

- OpenAI for gpt-image-1 and DALL-E models
- Hugging Face for FLUX.1 and inference API
- Google for Gemini 2.0 Flash model
- React and Vite teams for excellent developer tools

## Support

For issues, questions, or feature requests:
- Open an issue on [GitHub](https://github.com/shekar369/studioAI/issues)
- Check existing documentation in `/docs` folder
- Review troubleshooting section above

---

**Version**: 1.1.0
**Last Updated**: January 2026
**Status**: Fully Operational
