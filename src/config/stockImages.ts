/**
 * Professional Stock Photography Configuration
 * High-quality Unsplash images for Studio AI
 *
 * All images are sourced from Unsplash's free collection
 * with proper sizing for optimal performance
 */

// Hero Section Images - Before/After Slider
export const heroImages = {
  // Casual portrait - before transformation
  before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
  // Professional studio headshot - after transformation
  after: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face',
  // Alternative hero images
  beforeAlt: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face',
  afterAlt: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face',
};

// Template Category Preview Images
export const templateImages: Record<string, string> = {
  // Professional Category
  'business-portrait': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
  'linkedin-profile': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
  'corporate-headshot': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
  'executive-portrait': 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop&crop=face',
  'startup-founder': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'consultant': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',

  // Celebrations Category
  'wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop&crop=face',
  'wedding-portrait': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop&crop=face',
  'birthday-party': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&crop=face',
  'birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&crop=face',
  'graduation': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=500&fit=crop&crop=face',
  'graduation-portrait': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=500&fit=crop&crop=face',
  'anniversary': 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&h=500&fit=crop&crop=face',
  'engagement': 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=500&fit=crop&crop=face',
  'baby-shower': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=500&fit=crop&crop=face',

  // Holidays Category
  'christmas': 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=500&fit=crop&crop=face',
  'christmas-portrait': 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=500&fit=crop&crop=face',
  'new-year': 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=500&fit=crop&crop=face',
  'halloween': 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=500&fit=crop&crop=face',
  'easter': 'https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=400&h=500&fit=crop&crop=face',
  'diwali': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=500&fit=crop&crop=face',
  'thanksgiving': 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&h=500&fit=crop&crop=face',
  'valentines': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop&crop=face',

  // Events Category
  'concert': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop&crop=face',
  'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=500&fit=crop&crop=face',
  'conference': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop&crop=face',
  'sports-event': 'https://images.unsplash.com/photo-1461896836934- voices-of-africa?w=400&h=500&fit=crop&crop=face',
  'gala': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=500&fit=crop&crop=face',

  // Lifestyle & Fun Category
  'beach': 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=500&fit=crop&crop=face',
  'beach-vacation': 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=500&fit=crop&crop=face',
  'urban': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
  'urban-portrait': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
  'fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=face',
  'fitness-portrait': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=face',
  'travel': 'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=400&h=500&fit=crop&crop=face',
  'adventure': 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=500&fit=crop&crop=face',
  'casual': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'casual-portrait': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',

  // Artistic Category
  'cinematic': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face',
  'cinematic-portrait': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face',
  'artistic': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
  'artistic-portrait': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
  'fashion': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&crop=face',
  'fashion-portrait': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&crop=face',
  'vintage': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  'black-white': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  'neon': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop&crop=face',
  'retro': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face',
};

// Category Cover Images (for landing page category tabs)
export const categoryImages: Record<string, string> = {
  professional: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=200&fit=crop',
  celebrations: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
  holidays: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=300&h=200&fit=crop',
  events: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
  lifestyle: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=300&h=200&fit=crop',
  artistic: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=200&fit=crop',
  fun: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=200&fit=crop',
};

// Fallback image for templates without a specific image
export const fallbackImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face';

// Placeholder blur data URL for loading states
export const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQFBhESITFBUXH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAEDAAIREv/aAAwDAQACEQMRAD8Azuxu7nTupJ7Wa8kuI4pTGElkLMApI7J+auySTkkkn1SlK5NRbL2zEq//2Q==';

// Get template image with fallback
export function getTemplateImage(templateId: string): string {
  // Normalize the template ID (lowercase, handle variations)
  const normalizedId = templateId.toLowerCase().replace(/[\s_]/g, '-');

  // Try exact match first
  if (templateImages[normalizedId]) {
    return templateImages[normalizedId];
  }

  // Try partial match
  const partialMatch = Object.keys(templateImages).find(key =>
    normalizedId.includes(key) || key.includes(normalizedId)
  );

  if (partialMatch) {
    return templateImages[partialMatch];
  }

  // Return fallback
  return fallbackImage;
}

// Preload critical images for better UX
export function preloadImages(imageUrls: string[]): void {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Get optimized image URL with specific dimensions
export function getOptimizedImageUrl(
  baseUrl: string,
  width: number = 400,
  height: number = 500,
  quality: number = 80
): string {
  // If it's an Unsplash URL, we can modify the parameters
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('crop', 'face');
    return url.toString();
  }
  return baseUrl;
}

// Featured templates for landing page showcase
export const featuredTemplates = [
  {
    id: 'business-portrait',
    name: 'Business Portrait',
    category: 'Professional',
    image: templateImages['business-portrait'],
    description: 'Perfect for LinkedIn and corporate profiles',
  },
  {
    id: 'wedding',
    name: 'Wedding Portrait',
    category: 'Celebrations',
    image: templateImages['wedding'],
    description: 'Elegant wedding day memories',
  },
  {
    id: 'linkedin-profile',
    name: 'LinkedIn Profile',
    category: 'Professional',
    image: templateImages['linkedin-profile'],
    description: 'Stand out on LinkedIn',
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    category: 'Celebrations',
    image: templateImages['birthday'],
    description: 'Celebrate in style',
  },
  {
    id: 'cinematic',
    name: 'Cinematic Portrait',
    category: 'Artistic',
    image: templateImages['cinematic'],
    description: 'Movie-quality dramatic lighting',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    category: 'Celebrations',
    image: templateImages['graduation'],
    description: 'Capture your achievement',
  },
];

export default {
  heroImages,
  templateImages,
  categoryImages,
  fallbackImage,
  blurDataURL,
  getTemplateImage,
  preloadImages,
  getOptimizedImageUrl,
  featuredTemplates,
};
