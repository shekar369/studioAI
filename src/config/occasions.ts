import type { OccasionTemplate } from '../types/ui.types';

// Pre-configured occasion templates with 34+ options
export const occasionTemplates: OccasionTemplate[] = [
  // CELEBRATION CATEGORY (8 templates)
  {
    id: 'birthday',
    category: 'celebration',
    name: 'Birthday Party',
    icon: '🎂',
    description: 'Colorful balloons, cake, festive atmosphere',
    basePrompt: 'birthday celebration party scene, colorful balloons, birthday cake, festive decorations, joyful atmosphere, party lights',
    styleModifiers: ['vibrant colors', 'festive mood', 'cheerful', 'celebratory'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 80,
      colorTemperature: 5500,
      shadows: { intensity: 30, softness: 70 },
      highlights: { intensity: 60, bloom: true }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 400,
      bokeh: { enabled: true, intensity: 60, shape: 'circular' },
      filmGrain: 10,
      vignette: 15
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/birthday.jpg'
  },
  {
    id: 'wedding',
    category: 'celebration',
    name: 'Wedding Ceremony',
    icon: '💒',
    description: 'Elegant, romantic, formal wedding setting',
    basePrompt: 'elegant wedding ceremony, romantic atmosphere, formal attire, wedding venue, floral decorations, love and joy',
    styleModifiers: ['romantic', 'elegant', 'formal', 'dreamy'],
    lightingPreset: {
      type: 'soft',
      direction: 'front',
      intensity: 75,
      colorTemperature: 5000,
      shadows: { intensity: 25, softness: 80 },
      highlights: { intensity: 70, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/160',
      iso: 320,
      bokeh: { enabled: true, intensity: 80, shape: 'circular' },
      filmGrain: 5,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'anthropic', 'replicate'],
    thumbnail: '/templates/wedding.jpg'
  },
  {
    id: 'graduation',
    category: 'celebration',
    name: 'Graduation',
    icon: '🎓',
    description: 'Academic, celebratory achievement',
    basePrompt: 'graduation ceremony, academic regalia, cap and gown, proud achievement, celebratory moment, campus setting',
    styleModifiers: ['proud', 'academic', 'formal', 'achievement'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 70,
      colorTemperature: 5500,
      shadows: { intensity: 35, softness: 60 },
      highlights: { intensity: 55, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 400,
      bokeh: { enabled: true, intensity: 50, shape: 'circular' },
      filmGrain: 8,
      vignette: 12
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/graduation.jpg'
  },
  {
    id: 'anniversary',
    category: 'celebration',
    name: 'Anniversary',
    icon: '🎉',
    description: 'Romantic, elegant celebration',
    basePrompt: 'anniversary celebration, romantic dinner, candlelight, elegant setting, intimate atmosphere, love and romance',
    styleModifiers: ['romantic', 'intimate', 'elegant', 'warm'],
    lightingPreset: {
      type: 'golden-hour',
      direction: 'side',
      intensity: 65,
      colorTemperature: 3500,
      shadows: { intensity: 40, softness: 75 },
      highlights: { intensity: 75, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/100',
      iso: 640,
      bokeh: { enabled: true, intensity: 85, shape: 'circular' },
      filmGrain: 12,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/anniversary.jpg'
  },
  {
    id: 'newyear',
    category: 'celebration',
    name: 'New Year',
    icon: '🎊',
    description: 'Fireworks, celebration, party atmosphere',
    basePrompt: 'New Year celebration, fireworks, party atmosphere, countdown, festive lights, champagne, celebration',
    styleModifiers: ['festive', 'spectacular', 'exciting', 'vibrant'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'front',
      intensity: 85,
      colorTemperature: 6000,
      shadows: { intensity: 50, softness: 50 },
      highlights: { intensity: 90, bloom: true }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/60',
      iso: 800,
      bokeh: { enabled: true, intensity: 70, shape: 'hexagonal' },
      filmGrain: 15,
      vignette: 18
    },
    recommendedAPIs: ['stability', 'huggingface', 'replicate'],
    thumbnail: '/templates/newyear.jpg'
  },
  {
    id: 'halloween',
    category: 'celebration',
    name: 'Halloween',
    icon: '🎃',
    description: 'Spooky, creative costumes',
    basePrompt: 'Halloween celebration, creative costume, spooky atmosphere, pumpkins, autumn decorations, trick or treat',
    styleModifiers: ['spooky', 'creative', 'atmospheric', 'fun'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 60,
      colorTemperature: 2800,
      shadows: { intensity: 70, softness: 40 },
      highlights: { intensity: 50, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 640,
      bokeh: { enabled: true, intensity: 65, shape: 'circular' },
      filmGrain: 20,
      vignette: 30
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/halloween.jpg'
  },
  {
    id: 'thanksgiving',
    category: 'celebration',
    name: 'Thanksgiving',
    icon: '🦃',
    description: 'Warm family gathering, feast',
    basePrompt: 'Thanksgiving dinner, family gathering, warm atmosphere, feast table, autumn colors, gratitude and togetherness',
    styleModifiers: ['warm', 'cozy', 'family-oriented', 'grateful'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 70,
      colorTemperature: 3800,
      shadows: { intensity: 35, softness: 70 },
      highlights: { intensity: 65, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 500,
      bokeh: { enabled: true, intensity: 55, shape: 'circular' },
      filmGrain: 10,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/thanksgiving.jpg'
  },
  {
    id: 'valentine',
    category: 'celebration',
    name: "Valentine's Day",
    icon: '💝',
    description: 'Romantic, intimate setting',
    basePrompt: "Valentine's Day romance, hearts and roses, romantic dinner, candlelight, love and affection, intimate moment",
    styleModifiers: ['romantic', 'intimate', 'loving', 'passionate'],
    lightingPreset: {
      type: 'soft',
      direction: 'side',
      intensity: 60,
      colorTemperature: 3000,
      shadows: { intensity: 45, softness: 80 },
      highlights: { intensity: 70, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/80',
      iso: 800,
      bokeh: { enabled: true, intensity: 90, shape: 'circular' },
      filmGrain: 8,
      vignette: 28
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/valentine.jpg'
  },

  // PROFESSIONAL CATEGORY (6 templates)
  {
    id: 'corporate-headshot',
    category: 'professional',
    name: 'Corporate Headshot',
    icon: '💼',
    description: 'Clean, professional business photo',
    basePrompt: 'professional corporate headshot, business attire, clean background, confident expression, studio lighting, professional quality',
    styleModifiers: ['professional', 'clean', 'confident', 'business'],
    lightingPreset: {
      type: 'studio',
      direction: 'butterfly',
      intensity: 85,
      colorTemperature: 5500,
      shadows: { intensity: 20, softness: 80 },
      highlights: { intensity: 60, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 200,
      bokeh: { enabled: true, intensity: 40, shape: 'circular' },
      filmGrain: 0,
      vignette: 5
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/corporate-headshot.jpg'
  },
  {
    id: 'business-portrait',
    category: 'professional',
    name: 'Business Portrait',
    icon: '👔',
    description: 'Formal studio portrait',
    basePrompt: 'formal business portrait, professional attire, studio setting, executive presence, polished appearance, high-end photography',
    styleModifiers: ['formal', 'executive', 'polished', 'authoritative'],
    lightingPreset: {
      type: 'studio',
      direction: 'front',
      intensity: 80,
      colorTemperature: 5500,
      shadows: { intensity: 25, softness: 75 },
      highlights: { intensity: 55, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 200,
      bokeh: { enabled: true, intensity: 45, shape: 'circular' },
      filmGrain: 0,
      vignette: 8
    },
    recommendedAPIs: ['stability', 'anthropic', 'replicate'],
    thumbnail: '/templates/business-portrait.jpg'
  },
  {
    id: 'linkedin-profile',
    category: 'professional',
    name: 'LinkedIn Profile',
    icon: '📸',
    description: 'Approachable professional photo',
    basePrompt: 'LinkedIn profile photo, approachable professional, business casual attire, friendly expression, clean background, well-lit',
    styleModifiers: ['approachable', 'professional', 'friendly', 'trustworthy'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 75,
      colorTemperature: 5500,
      shadows: { intensity: 30, softness: 70 },
      highlights: { intensity: 50, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 320,
      bokeh: { enabled: true, intensity: 35, shape: 'circular' },
      filmGrain: 3,
      vignette: 10
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/linkedin.jpg'
  },
  {
    id: 'actor-headshot',
    category: 'professional',
    name: 'Actor Headshot',
    icon: '🎬',
    description: 'Dramatic lighting, expressive',
    basePrompt: 'actor headshot, dramatic lighting, expressive face, professional casting photo, theatrical quality, engaging presence',
    styleModifiers: ['dramatic', 'expressive', 'theatrical', 'engaging'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 75,
      colorTemperature: 5000,
      shadows: { intensity: 55, softness: 60 },
      highlights: { intensity: 70, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/160',
      iso: 400,
      bokeh: { enabled: true, intensity: 60, shape: 'circular' },
      filmGrain: 5,
      vignette: 15
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/actor.jpg'
  },
  {
    id: 'executive-portrait',
    category: 'professional',
    name: 'Executive Portrait',
    icon: '👨‍💼',
    description: 'Powerful, confident presence',
    basePrompt: 'executive portrait, powerful presence, confident expression, luxury office setting, high-end professional photography',
    styleModifiers: ['powerful', 'confident', 'authoritative', 'prestigious'],
    lightingPreset: {
      type: 'studio',
      direction: 'front',
      intensity: 85,
      colorTemperature: 5500,
      shadows: { intensity: 30, softness: 70 },
      highlights: { intensity: 65, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 200,
      bokeh: { enabled: true, intensity: 50, shape: 'circular' },
      filmGrain: 0,
      vignette: 12
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/executive.jpg'
  },
  {
    id: 'corporate-event',
    category: 'professional',
    name: 'Corporate Event',
    icon: '🏢',
    description: 'Business casual, event setting',
    basePrompt: 'corporate event photo, business casual attire, professional gathering, networking atmosphere, conference setting',
    styleModifiers: ['professional', 'social', 'business-casual', 'engaged'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 70,
      colorTemperature: 5200,
      shadows: { intensity: 35, softness: 65 },
      highlights: { intensity: 55, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 640,
      bokeh: { enabled: true, intensity: 45, shape: 'circular' },
      filmGrain: 8,
      vignette: 15
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/corporate-event.jpg'
  },

  // LIFESTYLE CATEGORY (8 templates)
  {
    id: 'beach-vacation',
    category: 'lifestyle',
    name: 'Beach Vacation',
    icon: '🏖️',
    description: 'Tropical, relaxed beach setting',
    basePrompt: 'beach vacation photo, tropical paradise, relaxed atmosphere, ocean backdrop, summer vibes, carefree moment',
    styleModifiers: ['relaxed', 'tropical', 'sunny', 'carefree'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 85,
      colorTemperature: 6500,
      shadows: { intensity: 45, softness: 50 },
      highlights: { intensity: 80, bloom: true }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/250',
      iso: 100,
      bokeh: { enabled: false, intensity: 20, shape: 'circular' },
      filmGrain: 5,
      vignette: 10
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/beach.jpg'
  },
  {
    id: 'mountain-adventure',
    category: 'lifestyle',
    name: 'Mountain Adventure',
    icon: '⛰️',
    description: 'Outdoor, adventurous mountain setting',
    basePrompt: 'mountain adventure photo, outdoor adventure, mountain landscape, hiking atmosphere, natural beauty, adventurous spirit',
    styleModifiers: ['adventurous', 'outdoor', 'natural', 'energetic'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 80,
      colorTemperature: 6000,
      shadows: { intensity: 40, softness: 55 },
      highlights: { intensity: 75, bloom: false }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/4',
      shutterSpeed: '1/200',
      iso: 200,
      bokeh: { enabled: false, intensity: 25, shape: 'circular' },
      filmGrain: 10,
      vignette: 12
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/mountain.jpg'
  },
  {
    id: 'urban-explorer',
    category: 'lifestyle',
    name: 'Urban Explorer',
    icon: '🏙️',
    description: 'City, modern urban setting',
    basePrompt: 'urban exploration photo, city backdrop, modern architecture, street style, contemporary urban atmosphere',
    styleModifiers: ['urban', 'modern', 'stylish', 'contemporary'],
    lightingPreset: {
      type: 'natural',
      direction: 'side',
      intensity: 70,
      colorTemperature: 5500,
      shadows: { intensity: 50, softness: 50 },
      highlights: { intensity: 60, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 400,
      bokeh: { enabled: true, intensity: 55, shape: 'circular' },
      filmGrain: 12,
      vignette: 18
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/urban.jpg'
  },
  {
    id: 'golden-hour',
    category: 'lifestyle',
    name: 'Golden Hour Portrait',
    icon: '🌅',
    description: 'Sunset, dreamy atmosphere',
    basePrompt: 'golden hour portrait, sunset lighting, dreamy atmosphere, warm glow, magical hour photography, soft natural light',
    styleModifiers: ['dreamy', 'warm', 'romantic', 'magical'],
    lightingPreset: {
      type: 'golden-hour',
      direction: 'side',
      intensity: 75,
      colorTemperature: 3200,
      shadows: { intensity: 35, softness: 80 },
      highlights: { intensity: 85, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/100',
      iso: 200,
      bokeh: { enabled: true, intensity: 75, shape: 'circular' },
      filmGrain: 8,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/golden-hour.jpg'
  },
  {
    id: 'artistic-portrait',
    category: 'lifestyle',
    name: 'Artistic Portrait',
    icon: '🎨',
    description: 'Creative, expressive style',
    basePrompt: 'artistic portrait, creative expression, unique composition, artistic lighting, expressive mood, creative photography',
    styleModifiers: ['artistic', 'creative', 'expressive', 'unique'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 70,
      colorTemperature: 5000,
      shadows: { intensity: 60, softness: 55 },
      highlights: { intensity: 70, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/125',
      iso: 400,
      bokeh: { enabled: true, intensity: 65, shape: 'hexagonal' },
      filmGrain: 15,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/artistic.jpg'
  },
  {
    id: 'fitness-sports',
    category: 'lifestyle',
    name: 'Fitness/Sports',
    icon: '💪',
    description: 'Athletic, energetic',
    basePrompt: 'fitness sports photo, athletic pose, energetic mood, workout setting, strength and vitality, active lifestyle',
    styleModifiers: ['athletic', 'energetic', 'powerful', 'dynamic'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 80,
      colorTemperature: 5500,
      shadows: { intensity: 55, softness: 45 },
      highlights: { intensity: 75, bloom: false }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/200',
      iso: 640,
      bokeh: { enabled: true, intensity: 50, shape: 'circular' },
      filmGrain: 10,
      vignette: 15
    },
    recommendedAPIs: ['stability', 'huggingface', 'replicate'],
    thumbnail: '/templates/fitness.jpg'
  },
  {
    id: 'wellness-yoga',
    category: 'lifestyle',
    name: 'Wellness/Yoga',
    icon: '🧘',
    description: 'Peaceful, zen atmosphere',
    basePrompt: 'wellness yoga photo, peaceful atmosphere, zen mood, mindful moment, serene setting, inner peace and balance',
    styleModifiers: ['peaceful', 'zen', 'serene', 'mindful'],
    lightingPreset: {
      type: 'soft',
      direction: 'front',
      intensity: 65,
      colorTemperature: 5000,
      shadows: { intensity: 25, softness: 85 },
      highlights: { intensity: 50, bloom: true }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 320,
      bokeh: { enabled: true, intensity: 60, shape: 'circular' },
      filmGrain: 5,
      vignette: 18
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/wellness.jpg'
  },
  {
    id: 'fashion-editorial',
    category: 'lifestyle',
    name: 'Fashion/Editorial',
    icon: '🎭',
    description: 'Stylish, high-fashion look',
    basePrompt: 'fashion editorial photo, high-fashion style, editorial quality, runway-inspired, stylish and sophisticated, magazine-worthy',
    styleModifiers: ['stylish', 'sophisticated', 'editorial', 'fashionable'],
    lightingPreset: {
      type: 'studio',
      direction: 'side',
      intensity: 80,
      colorTemperature: 5500,
      shadows: { intensity: 50, softness: 60 },
      highlights: { intensity: 75, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 320,
      bokeh: { enabled: true, intensity: 70, shape: 'octagonal' },
      filmGrain: 5,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/fashion.jpg'
  },

  // SEASONAL CATEGORY (4 templates)
  {
    id: 'christmas',
    category: 'seasonal',
    name: 'Christmas/Holiday',
    icon: '🎄',
    description: 'Cozy, festive lights',
    basePrompt: 'Christmas holiday photo, cozy atmosphere, festive lights, winter decorations, holiday spirit, warm and joyful',
    styleModifiers: ['cozy', 'festive', 'warm', 'magical'],
    lightingPreset: {
      type: 'soft',
      direction: 'front',
      intensity: 70,
      colorTemperature: 3500,
      shadows: { intensity: 30, softness: 75 },
      highlights: { intensity: 70, bloom: true }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 640,
      bokeh: { enabled: true, intensity: 80, shape: 'circular' },
      filmGrain: 12,
      vignette: 22
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/christmas.jpg'
  },
  {
    id: 'spring-blossom',
    category: 'seasonal',
    name: 'Spring Blossom',
    icon: '🌸',
    description: 'Flowers, fresh spring atmosphere',
    basePrompt: 'spring blossom photo, cherry blossoms, fresh spring atmosphere, blooming flowers, renewal and growth, soft pastel colors',
    styleModifiers: ['fresh', 'delicate', 'soft', 'natural'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 75,
      colorTemperature: 5800,
      shadows: { intensity: 30, softness: 75 },
      highlights: { intensity: 65, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 200,
      bokeh: { enabled: true, intensity: 75, shape: 'circular' },
      filmGrain: 5,
      vignette: 15
    },
    recommendedAPIs: ['stability', 'huggingface', 'gemini'],
    thumbnail: '/templates/spring.jpg'
  },
  {
    id: 'summer-vibes',
    category: 'seasonal',
    name: 'Summer Vibes',
    icon: '☀️',
    description: 'Bright, warm summer atmosphere',
    basePrompt: 'summer vibes photo, bright sunshine, warm atmosphere, vibrant summer colors, cheerful mood, sunny day',
    styleModifiers: ['bright', 'vibrant', 'cheerful', 'warm'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 85,
      colorTemperature: 6500,
      shadows: { intensity: 45, softness: 50 },
      highlights: { intensity: 80, bloom: true }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/4',
      shutterSpeed: '1/250',
      iso: 100,
      bokeh: { enabled: false, intensity: 30, shape: 'circular' },
      filmGrain: 5,
      vignette: 10
    },
    recommendedAPIs: ['stability', 'huggingface', 'replicate'],
    thumbnail: '/templates/summer.jpg'
  },
  {
    id: 'autumn-fall',
    category: 'seasonal',
    name: 'Autumn/Fall',
    icon: '🍂',
    description: 'Warm tones, fall leaves',
    basePrompt: 'autumn fall photo, warm orange and red tones, falling leaves, cozy atmosphere, golden autumn light, seasonal beauty',
    styleModifiers: ['warm', 'cozy', 'nostalgic', 'rich'],
    lightingPreset: {
      type: 'golden-hour',
      direction: 'side',
      intensity: 70,
      colorTemperature: 3800,
      shadows: { intensity: 40, softness: 70 },
      highlights: { intensity: 75, bloom: true }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 320,
      bokeh: { enabled: true, intensity: 65, shape: 'circular' },
      filmGrain: 10,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/autumn.jpg'
  },

  // ARTISTIC STYLES CATEGORY (8 templates)
  {
    id: 'oil-painting',
    category: 'artistic',
    name: 'Oil Painting Style',
    icon: '🎨',
    description: 'Renaissance oil painting look',
    basePrompt: 'oil painting style portrait, renaissance art, classical painting technique, rich colors, artistic brushstrokes, museum quality',
    styleModifiers: ['painterly', 'classical', 'artistic', 'rich'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 65,
      colorTemperature: 4500,
      shadows: { intensity: 60, softness: 50 },
      highlights: { intensity: 70, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 400,
      bokeh: { enabled: true, intensity: 60, shape: 'circular' },
      filmGrain: 20,
      vignette: 30
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/oil-painting.jpg'
  },
  {
    id: 'watercolor',
    category: 'artistic',
    name: 'Watercolor Style',
    icon: '🖼️',
    description: 'Soft watercolor artistic look',
    basePrompt: 'watercolor painting style, soft artistic rendering, delicate brush strokes, pastel colors, artistic interpretation, dreamy quality',
    styleModifiers: ['soft', 'delicate', 'artistic', 'dreamy'],
    lightingPreset: {
      type: 'soft',
      direction: 'front',
      intensity: 60,
      colorTemperature: 5500,
      shadows: { intensity: 25, softness: 85 },
      highlights: { intensity: 60, bloom: true }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 320,
      bokeh: { enabled: true, intensity: 70, shape: 'circular' },
      filmGrain: 15,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'huggingface', 'replicate'],
    thumbnail: '/templates/watercolor.jpg'
  },
  {
    id: 'film-noir',
    category: 'artistic',
    name: 'Film Noir',
    icon: '📷',
    description: 'Dramatic black and white',
    basePrompt: 'film noir style, dramatic black and white, high contrast lighting, cinematic shadows, classic Hollywood mood, noir atmosphere',
    styleModifiers: ['dramatic', 'noir', 'cinematic', 'mysterious'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 75,
      colorTemperature: 5000,
      shadows: { intensity: 80, softness: 30 },
      highlights: { intensity: 85, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 640,
      bokeh: { enabled: true, intensity: 55, shape: 'circular' },
      filmGrain: 30,
      vignette: 40
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/film-noir.jpg'
  },
  {
    id: 'cinematic',
    category: 'artistic',
    name: 'Cinematic',
    icon: '🌟',
    description: 'Movie poster style',
    basePrompt: 'cinematic style photo, movie poster quality, dramatic lighting, epic atmosphere, Hollywood production value, professional color grading',
    styleModifiers: ['cinematic', 'dramatic', 'epic', 'professional'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 80,
      colorTemperature: 5200,
      shadows: { intensity: 55, softness: 55 },
      highlights: { intensity: 80, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160',
      iso: 400,
      bokeh: { enabled: true, intensity: 75, shape: 'circular' },
      filmGrain: 12,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/cinematic.jpg'
  },
  {
    id: 'vintage',
    category: 'artistic',
    name: 'Vintage',
    icon: '🎭',
    description: 'Retro, aged look',
    basePrompt: 'vintage photo style, retro aesthetic, aged photo quality, nostalgic mood, classic color grading, timeless quality',
    styleModifiers: ['vintage', 'retro', 'nostalgic', 'classic'],
    lightingPreset: {
      type: 'natural',
      direction: 'front',
      intensity: 65,
      colorTemperature: 4500,
      shadows: { intensity: 40, softness: 65 },
      highlights: { intensity: 60, bloom: false }
    },
    cameraSettings: {
      lens: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/100',
      iso: 400,
      bokeh: { enabled: true, intensity: 50, shape: 'circular' },
      filmGrain: 35,
      vignette: 35
    },
    recommendedAPIs: ['stability', 'huggingface', 'replicate'],
    thumbnail: '/templates/vintage.jpg'
  },
  {
    id: 'fantasy-ethereal',
    category: 'artistic',
    name: 'Fantasy/Ethereal',
    icon: '🔮',
    description: 'Magical, dreamlike atmosphere',
    basePrompt: 'fantasy ethereal style, magical atmosphere, dreamlike quality, mystical mood, fantasy world, otherworldly beauty',
    styleModifiers: ['magical', 'ethereal', 'dreamlike', 'mystical'],
    lightingPreset: {
      type: 'soft',
      direction: 'front',
      intensity: 70,
      colorTemperature: 6000,
      shadows: { intensity: 35, softness: 80 },
      highlights: { intensity: 80, bloom: true }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/100',
      iso: 320,
      bokeh: { enabled: true, intensity: 85, shape: 'circular' },
      filmGrain: 10,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/fantasy.jpg'
  },
  {
    id: 'scifi-futuristic',
    category: 'artistic',
    name: 'Sci-Fi/Futuristic',
    icon: '🤖',
    description: 'Tech, neon, futuristic',
    basePrompt: 'sci-fi futuristic style, cyberpunk atmosphere, neon lights, high-tech setting, futuristic aesthetic, advanced technology',
    styleModifiers: ['futuristic', 'cyberpunk', 'technological', 'neon'],
    lightingPreset: {
      type: 'dramatic',
      direction: 'side',
      intensity: 75,
      colorTemperature: 7000,
      shadows: { intensity: 60, softness: 40 },
      highlights: { intensity: 85, bloom: true }
    },
    cameraSettings: {
      lens: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 640,
      bokeh: { enabled: true, intensity: 70, shape: 'hexagonal' },
      filmGrain: 15,
      vignette: 20
    },
    recommendedAPIs: ['stability', 'replicate', 'huggingface'],
    thumbnail: '/templates/scifi.jpg'
  },
  {
    id: 'classical-art',
    category: 'artistic',
    name: 'Classical Art',
    icon: '🏛️',
    description: 'Museum quality portrait',
    basePrompt: 'classical art style, museum quality portrait, fine art photography, renaissance inspired, timeless elegance, masterpiece quality',
    styleModifiers: ['classical', 'elegant', 'timeless', 'refined'],
    lightingPreset: {
      type: 'studio',
      direction: 'side',
      intensity: 70,
      colorTemperature: 5000,
      shadows: { intensity: 50, softness: 60 },
      highlights: { intensity: 65, bloom: false }
    },
    cameraSettings: {
      lens: '85mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/125',
      iso: 320,
      bokeh: { enabled: true, intensity: 60, shape: 'circular' },
      filmGrain: 8,
      vignette: 25
    },
    recommendedAPIs: ['stability', 'replicate', 'anthropic'],
    thumbnail: '/templates/classical.jpg'
  }
];

// Group occasions by category for easier UI filtering
export const occasionsByCategory = {
  celebration: occasionTemplates.filter(t => t.category === 'celebration'),
  professional: occasionTemplates.filter(t => t.category === 'professional'),
  lifestyle: occasionTemplates.filter(t => t.category === 'lifestyle'),
  seasonal: occasionTemplates.filter(t => t.category === 'seasonal'),
  artistic: occasionTemplates.filter(t => t.category === 'artistic')
};

// Get occasion by ID
export const getOccasionById = (id: string): OccasionTemplate | undefined => {
  return occasionTemplates.find(t => t.id === id);
};

// Search occasions by name or description
export const searchOccasions = (query: string): OccasionTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return occasionTemplates.filter(
    t => t.name.toLowerCase().includes(lowerQuery) ||
         t.description.toLowerCase().includes(lowerQuery)
  );
};
