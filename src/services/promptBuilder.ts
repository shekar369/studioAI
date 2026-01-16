import type { OccasionTemplate, AdvancedSettings } from '../types/ui.types';
import type {
  LightingConfig,
  CameraConfig,
  StyleConfig
} from '../types/generation.types';
import { promptTemplates, negativePrompts } from '../config/styles';

export class PromptBuilder {
  /**
   * Build complete prompt from configuration
   */
  buildPrompt(
    occasion: OccasionTemplate,
    settings: AdvancedSettings,
    customPrompt?: string
  ): string {
    const sections: string[] = [];

    // Start with face preservation if enabled
    if (settings.facePreservation.enabled) {
      sections.push(promptTemplates.facePreservation);
    }

    // Add occasion base prompt
    sections.push(occasion.basePrompt);

    // Add custom prompt if provided
    if (customPrompt && customPrompt.trim()) {
      sections.push(customPrompt);
    }

    // Add style modifiers from occasion
    if (occasion.styleModifiers.length > 0) {
      sections.push(occasion.styleModifiers.join(', '));
    }

    // Add photography style
    sections.push(this.buildPhotographyStyle(settings.style));

    // Add lighting description
    sections.push(this.buildLightingDescription(settings.lighting));

    // Add camera settings
    sections.push(this.buildCameraDescription(settings.camera));

    // Add quality descriptors
    sections.push(promptTemplates.hyperRealistic);
    sections.push(promptTemplates.professionalPhotography);

    // Add background if custom
    if (settings.background.type === 'custom' && settings.background.customPrompt) {
      sections.push(`background: ${settings.background.customPrompt}`);
    } else if (settings.background.environment.location) {
      sections.push(`location: ${settings.background.environment.location}`);
      sections.push(`${settings.background.environment.timeOfDay} lighting`);
    }

    // Add clothing modifications if enabled
    if (settings.clothing.modifyClothing) {
      sections.push(this.buildClothingDescription(settings.clothing));
    }

    // Join all sections with commas
    return sections.filter(Boolean).join(', ');
  }

  /**
   * Build negative prompt
   */
  buildNegativePrompt(settings: AdvancedSettings): string {
    const negatives: string[] = [];

    // Always include common negative prompts
    negatives.push(negativePrompts.common);
    negatives.push(negativePrompts.face);
    negatives.push(negativePrompts.artifacts);
    negatives.push(negativePrompts.technical);

    // Add style-specific negatives if not artistic
    if (settings.style.photographyStyle === 'realistic' ||
        settings.style.photographyStyle === 'portrait') {
      negatives.push(negativePrompts.style);
    }

    return negatives.join(', ');
  }

  /**
   * Build photography style description
   */
  private buildPhotographyStyle(style: StyleConfig): string {
    const parts: string[] = [];

    parts.push(`${style.photographyStyle} photography`);
    parts.push(`${style.colorGrading.preset} color grading`);
    parts.push(`${style.composition.framing} framing`);
    parts.push(`${style.composition.perspective} angle`);

    if (style.composition.ruleOfThirds) {
      parts.push('rule of thirds composition');
    }

    return parts.join(', ');
  }

  /**
   * Build lighting description
   */
  private buildLightingDescription(lighting: LightingConfig): string {
    const parts: string[] = [];

    parts.push(`${lighting.type} lighting`);
    parts.push(`${lighting.direction} light direction`);
    parts.push(`${lighting.colorTemperature}K color temperature`);

    if (lighting.shadows.intensity > 50) {
      parts.push('dramatic shadows');
    } else if (lighting.shadows.intensity < 30) {
      parts.push('soft shadows');
    }

    if (lighting.highlights.bloom) {
      parts.push('glowing highlights');
    }

    return parts.join(', ');
  }

  /**
   * Build camera description
   */
  private buildCameraDescription(camera: CameraConfig): string {
    const parts: string[] = [];

    parts.push(`shot with ${camera.lens} lens`);
    parts.push(`${camera.aperture} aperture`);

    if (camera.bokeh.enabled) {
      parts.push(`beautiful ${camera.bokeh.shape} bokeh`);
      parts.push('shallow depth of field');
    }

    if (camera.filmGrain > 20) {
      parts.push('film grain texture');
    }

    if (camera.vignette > 20) {
      parts.push('subtle vignette');
    }

    return parts.join(', ');
  }

  /**
   * Build clothing description
   */
  private buildClothingDescription(clothing: any): string {
    const parts: string[] = [];

    parts.push(`wearing ${clothing.style} attire`);

    if (clothing.colorScheme && clothing.colorScheme.length > 0) {
      parts.push(`${clothing.colorScheme.join(' and ')} colors`);
    }

    if (clothing.accessories.add.length > 0) {
      parts.push(`with ${clothing.accessories.add.join(', ')}`);
    }

    return parts.join(', ');
  }

  /**
   * Build simplified prompt for preview/draft mode
   */
  buildSimplifiedPrompt(occasion: OccasionTemplate, customPrompt?: string): string {
    const parts: string[] = [];

    parts.push(occasion.basePrompt);

    if (customPrompt && customPrompt.trim()) {
      parts.push(customPrompt);
    }

    parts.push('professional photography');
    parts.push('high quality');

    return parts.join(', ');
  }

  /**
   * Estimate prompt token count (rough estimation)
   */
  estimateTokenCount(prompt: string): number {
    // Rough estimation: ~0.75 tokens per word
    const words = prompt.split(/\s+/).length;
    return Math.ceil(words * 0.75);
  }

  /**
   * Truncate prompt to fit token limit
   */
  truncatePrompt(prompt: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokenCount(prompt);

    if (estimatedTokens <= maxTokens) {
      return prompt;
    }

    // Remove words from the end until we're under the limit
    const words = prompt.split(/\s+/);
    const targetWords = Math.floor(maxTokens / 0.75);

    return words.slice(0, targetWords).join(' ') + '...';
  }
}

// Export singleton instance
export const promptBuilder = new PromptBuilder();
