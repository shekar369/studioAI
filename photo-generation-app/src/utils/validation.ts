// Validation utility functions

const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file format
 */
export const validateImageFormat = (file: File): ValidationResult => {
  if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format. Allowed formats: JPG, PNG, WEBP, HEIC`
    };
  }
  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSize: number = MAX_FILE_SIZE): ValidationResult => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    };
  }
  return { valid: true };
};

/**
 * Validate image file (format and size)
 */
export const validateImageFile = (file: File): ValidationResult => {
  const formatCheck = validateImageFormat(file);
  if (!formatCheck.valid) return formatCheck;

  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  return { valid: true };
};

/**
 * Validate API key format
 */
export const validateAPIKey = (apiKey: string, apiId: string): ValidationResult => {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      valid: false,
      error: 'API key is required'
    };
  }

  // Basic length validation
  if (apiKey.length < 10) {
    return {
      valid: false,
      error: 'API key appears to be invalid (too short)'
    };
  }

  // API-specific validation
  switch (apiId) {
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        return {
          valid: false,
          error: 'Invalid Anthropic API key format (should start with sk-ant-)'
        };
      }
      break;
    case 'gemini':
      // Gemini keys are typically 39 characters
      if (apiKey.length < 30) {
        return {
          valid: false,
          error: 'Invalid Gemini API key format'
        };
      }
      break;
    case 'stability':
      if (!apiKey.startsWith('sk-')) {
        return {
          valid: false,
          error: 'Invalid Stability AI API key format (should start with sk-)'
        };
      }
      break;
  }

  return { valid: true };
};

/**
 * Validate resolution dimensions
 */
export const validateResolution = (width: number, height: number): ValidationResult => {
  const MIN_SIZE = 256;
  const MAX_SIZE = 8192;

  if (width < MIN_SIZE || height < MIN_SIZE) {
    return {
      valid: false,
      error: `Resolution too small. Minimum: ${MIN_SIZE}x${MIN_SIZE}`
    };
  }

  if (width > MAX_SIZE || height > MAX_SIZE) {
    return {
      valid: false,
      error: `Resolution too large. Maximum: ${MAX_SIZE}x${MAX_SIZE}`
    };
  }

  return { valid: true };
};

/**
 * Validate prompt text
 */
export const validatePrompt = (prompt: string): ValidationResult => {
  if (!prompt || prompt.trim().length === 0) {
    return {
      valid: false,
      error: 'Prompt is required'
    };
  }

  if (prompt.length < 3) {
    return {
      valid: false,
      error: 'Prompt is too short (minimum 3 characters)'
    };
  }

  if (prompt.length > 2000) {
    return {
      valid: false,
      error: 'Prompt is too long (maximum 2000 characters)'
    };
  }

  return { valid: true };
};

/**
 * Validate number range
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  name: string
): ValidationResult => {
  if (value < min || value > max) {
    return {
      valid: false,
      error: `${name} must be between ${min} and ${max}`
    };
  }
  return { valid: true };
};

/**
 * Sanitize filename for download
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Validate email format (for sharing features)
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }
  return { valid: true };
};

/**
 * Check if value is a valid URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
