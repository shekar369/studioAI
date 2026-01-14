import type { ImageGenerationAPI, GeneratedImage, GenerationConfig, GenerationStatus } from '../../types/api.types';
import { APIError, executeWithRetry, createErrorFromResponse } from '../../utils/errorHandling';

export class OpenAIAPI implements ImageGenerationAPI {
  name = 'OpenAI';
  private apiKey: string = '';
  private baseURL = 'https://api.openai.com/v1';
  private defaultModel = 'gpt-image-1'; // Best model for image editing with face preservation

  /**
   * Authenticate with API key
   */
  async authenticate(apiKey: string): Promise<boolean> {
    this.apiKey = apiKey;

    try {
      // Test authentication with models endpoint
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });

      return response.ok;
    } catch (error) {
      console.error('OpenAI authentication failed:', error);
      return false;
    }
  }

  /**
   * Check API availability
   */
  async checkAvailability(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Edit/enhance image using gpt-image-1 (preserves original photo)
   */
  async editImage(imageBlob: Blob, prompt: string, size: string = '1024x1024'): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new APIError('API key not configured', this.name);
    }

    try {
      // Create FormData for image edit
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.png');
      formData.append('prompt', prompt);
      formData.append('model', 'gpt-image-1');
      formData.append('size', size);
      // Note: /images/edits endpoint doesn't support response_format parameter

      const data = await executeWithRetry(async () => {
        console.log('Editing image with OpenAI gpt-image-1...');
        console.log('Prompt:', prompt);

        const response = await fetch(`${this.baseURL}/images/edits`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw await createErrorFromResponse(response, this.name);
        }

        return await response.json();
      });

      // Get the URL from response
      const imageUrl = data.data[0].url;

      // Fetch the image and convert to blob to avoid CORS issues
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const url = URL.createObjectURL(blob);

      const [width, height] = size.split('x').map(Number);

      const result: GeneratedImage = {
        id: `openai-edit-${Date.now()}`,
        url,
        blob,
        width,
        height,
        format: 'image/png',
        metadata: {
          prompt,
          model: 'gpt-image-1',
          steps: 50,
          guidanceScale: 7,
          generationTime: 0,
          api: this.name,
          timestamp: new Date()
        }
      };

      return result;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        `Failed to edit image: ${error}`,
        this.name
      );
    }
  }

  /**
   * Generate image using DALL-E (or edit if image provided)
   */
  async generateImage(config: GenerationConfig, sourceImage?: Blob): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new APIError('API key not configured', this.name);
    }

    // If source image is provided, use edit endpoint for face preservation
    if (sourceImage) {
      // gpt-image-1 only supports specific sizes
      // Supported: 1024x1024, 1024x1536, 1536x1024
      let size = '1024x1024'; // Default square

      const aspectRatio = config.width / config.height;

      if (aspectRatio > 1.2) {
        // Landscape - use 1536x1024
        size = '1536x1024';
      } else if (aspectRatio < 0.8) {
        // Portrait - use 1024x1536
        size = '1024x1536';
      } else {
        // Square or close to square - use 1024x1024
        size = '1024x1024';
      }

      return this.editImage(sourceImage, config.prompt, size);
    }

    const model = config.modelId || this.defaultModel;

    // DALL-E 3 supports 1024x1024, 1024x1792, 1792x1024
    // DALL-E 2 supports 256x256, 512x512, 1024x1024
    let size = '1024x1024';
    if (model === 'dall-e-3') {
      if (config.width === 1792 || config.height === 1792) {
        size = config.width > config.height ? '1792x1024' : '1024x1792';
      } else {
        size = '1024x1024';
      }
    } else if (model === 'dall-e-2') {
      if (config.width <= 256) {
        size = '256x256';
      } else if (config.width <= 512) {
        size = '512x512';
      } else {
        size = '1024x1024';
      }
    }

    const requestBody: any = {
      model,
      prompt: config.prompt,
      n: config.numImages || 1,
      size,
      response_format: 'b64_json' // Use base64 instead of URL to avoid CORS
    };

    // Only DALL-E 3 supports 'quality' and 'style' parameters
    if (model === 'dall-e-3') {
      requestBody.quality = config.quality === 'ultra' || config.quality === 'maximum' ? 'hd' : 'standard';
      requestBody.style = 'natural'; // or 'vivid' for more dramatic images
    }

    try {
      const data = await executeWithRetry(async () => {
        console.log('Generating image with OpenAI DALL-E:', model);
        console.log('Request:', requestBody);

        const response = await fetch(`${this.baseURL}/images/generations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw await createErrorFromResponse(response, this.name);
        }

        return await response.json();
      });

      // DALL-E returns base64 encoded image
      const imageBase64 = data.data[0].b64_json;

      // Convert base64 to blob
      const binaryString = atob(imageBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      const [width, height] = size.split('x').map(Number);

      const result: GeneratedImage = {
        id: `openai-${Date.now()}`,
        url,
        blob,
        width,
        height,
        format: 'image/png',
        metadata: {
          prompt: config.prompt,
          negativePrompt: config.negativePrompt,
          model,
          steps: config.steps || 50,
          guidanceScale: config.guidanceScale || 7,
          seed: config.seed,
          generationTime: 0,
          api: this.name,
          timestamp: new Date()
        }
      };

      return result;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        `Failed to generate image: ${error}`,
        this.name
      );
    }
  }

  /**
   * Get generation status
   */
  async getStatus(_jobId: string): Promise<GenerationStatus> {
    throw new Error('Status checking not applicable for OpenAI API');
  }

  /**
   * Cancel generation
   */
  async cancelGeneration(_jobId: string): Promise<boolean> {
    return false;
  }

  /**
   * Estimate cost
   */
  estimateCost(config: GenerationConfig): number {
    const model = config.modelId || this.defaultModel;

    if (model === 'dall-e-3') {
      // DALL-E 3: $0.040 per image (standard), $0.080 per image (HD)
      const isHD = config.quality === 'ultra' || config.quality === 'maximum';
      return isHD ? 0.080 : 0.040;
    } else if (model === 'dall-e-2') {
      // DALL-E 2: $0.020 per image (1024x1024)
      return 0.020;
    }

    return 0.040;
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'dall-e-3', // Latest, highest quality
      'dall-e-2'  // Faster, cheaper
    ];
  }
}

// Export helper for testing
export const testOpenAIConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const api = new OpenAIAPI();
    return await api.authenticate(apiKey);
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
