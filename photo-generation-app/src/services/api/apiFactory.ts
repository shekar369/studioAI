import type { ImageGenerationAPI } from '../../types/api.types';
import { HuggingFaceAPI } from './huggingfaceAPI';
import { GeminiAPI } from './geminiAPI';
import { OpenAIAPI } from './openaiAPI';

/**
 * API Factory for creating API instances
 */
export class APIFactory {
  private static instances: Map<string, ImageGenerationAPI> = new Map();

  /**
   * Get or create API instance
   */
  static getAPI(apiId: string): ImageGenerationAPI {
    // Return existing instance if available
    if (this.instances.has(apiId)) {
      return this.instances.get(apiId)!;
    }

    // Create new instance
    const api = this.createAPI(apiId);
    this.instances.set(apiId, api);
    return api;
  }

  /**
   * Create new API instance
   */
  private static createAPI(apiId: string): ImageGenerationAPI {
    switch (apiId) {
      case 'huggingface':
        return new HuggingFaceAPI();

      case 'gemini':
        return new GeminiAPI();

      case 'openai':
        return new OpenAIAPI();

      case 'stability':
        throw new Error('Stability AI integration coming soon');

      case 'replicate':
        throw new Error('Replicate integration coming soon');

      case 'anthropic':
        throw new Error('Anthropic Claude integration coming soon');

      default:
        throw new Error(`Unknown API: ${apiId}`);
    }
  }

  /**
   * Clear all instances (useful for testing)
   */
  static clearInstances(): void {
    this.instances.clear();
  }

  /**
   * Check if API is supported
   */
  static isSupported(apiId: string): boolean {
    return ['huggingface', 'gemini', 'openai'].includes(apiId);
  }

  /**
   * Get list of supported APIs
   */
  static getSupportedAPIs(): string[] {
    return ['huggingface', 'gemini', 'openai'];
  }
}

/**
 * Helper function to get API instance
 */
export const getAPI = (apiId: string): ImageGenerationAPI => {
  return APIFactory.getAPI(apiId);
};
