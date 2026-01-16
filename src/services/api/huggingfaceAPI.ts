import type { ImageGenerationAPI, GeneratedImage, GenerationConfig, GenerationStatus } from '../../types/api.types';
import { APIError, executeWithRetry, createErrorFromResponse } from '../../utils/errorHandling';
import { API_ENDPOINTS } from '../../config/apiConfigs';

export class HuggingFaceAPI implements ImageGenerationAPI {
  name = 'Hugging Face';
  private apiKey: string = '';
  private baseURL = API_ENDPOINTS.huggingface;
  private defaultModel = 'stabilityai/sdxl-turbo'; // Fast SDXL model for inference

  /**
   * Authenticate with API key
   */
  async authenticate(apiKey: string): Promise<boolean> {
    this.apiKey = apiKey;

    try {
      // Test authentication with a simple request
      const response = await fetch(`${this.baseURL}/${this.defaultModel}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'test',
          parameters: { num_inference_steps: 1 }
        })
      });

      // HuggingFace returns 200 even for errors, so check response
      return response.ok || response.status === 503; // 503 means model is loading
    } catch (error) {
      console.error('HuggingFace authentication failed:', error);
      return false;
    }
  }

  /**
   * Check API availability
   */
  async checkAvailability(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${this.baseURL}/${this.defaultModel}`, {
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
   * Generate image
   */
  async generateImage(config: GenerationConfig): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new APIError('API key not configured', this.name);
    }

    const modelId = config.modelId || this.defaultModel;

    // Adjust parameters based on model type
    const isFLUX = modelId.includes('FLUX');
    const steps = isFLUX ? Math.min(config.steps || 4, 8) : (config.steps || 28);

    const requestBody = {
      inputs: config.prompt,
      parameters: {
        negative_prompt: config.negativePrompt,
        num_inference_steps: steps,
        guidance_scale: config.guidanceScale || 7.5,
        width: config.width || 1024,
        height: config.height || 1024,
        seed: config.seed
      },
      options: {
        wait_for_model: true,
        use_cache: false
      }
    };

    try {
      const blob = await executeWithRetry(async () => {
        console.log('Fetching from Hugging Face:', modelId);
        console.log('Request body:', requestBody);

        const response = await fetch(`${this.baseURL}/${modelId}`, {
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

        // HuggingFace returns image as blob
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new APIError('Received empty response', this.name);
        }

        return blob;
      });

      // Convert blob to URL
      const url = URL.createObjectURL(blob);

      const result: GeneratedImage = {
        id: `hf-${Date.now()}`,
        url,
        blob,
        width: config.width || 1024,
        height: config.height || 1024,
        format: 'image/png',
        metadata: {
          prompt: config.prompt,
          negativePrompt: config.negativePrompt,
          model: modelId,
          steps: config.steps || 28,
          guidanceScale: config.guidanceScale || 7.5,
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
   * Get generation status (not supported by HuggingFace Inference API)
   */
  async getStatus(_jobId: string): Promise<GenerationStatus> {
    throw new Error('Status checking not supported by HuggingFace Inference API');
  }

  /**
   * Cancel generation (not supported)
   */
  async cancelGeneration(_jobId: string): Promise<boolean> {
    return false;
  }

  /**
   * Estimate cost
   */
  estimateCost(_config: GenerationConfig): number {
    // HuggingFace Inference API has free tier
    // Rough estimate: $0.002 per image for paid tier
    return 0.002;
  }

  /**
   * List available models
   */
  getAvailableModels(): string[] {
    return [
      'runwayml/stable-diffusion-v1-5', // Classic, reliable (default)
      'CompVis/stable-diffusion-v1-4',
      'stabilityai/stable-diffusion-2-1',
      'prompthero/openjourney',
      'dreamlike-art/dreamlike-photoreal-2.0'
    ];
  }
}

// Export helper for testing
export const testHuggingFaceConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const api = new HuggingFaceAPI();
    return await api.authenticate(apiKey);
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
