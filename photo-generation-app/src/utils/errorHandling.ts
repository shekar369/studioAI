// Error handling utilities

export class AppError extends Error {
  code: string;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class APIError extends AppError {
  apiName: string;

  constructor(
    message: string,
    apiName: string,
    statusCode?: number,
    details?: any
  ) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'APIError';
    this.apiName = apiName;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AppError {
  retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    details?: any
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class AuthenticationError extends AppError {
  apiName?: string;

  constructor(message: string = 'Authentication failed', details?: any, apiName?: string) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthenticationError';
    this.apiName = apiName;
  }
}

/**
 * Retry configuration
 */
export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  if (error instanceof NetworkError) return true;
  if (error instanceof RateLimitError) return true;

  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  if (error.statusCode && retryableStatusCodes.includes(error.statusCode)) {
    return true;
  }

  return false;
};

/**
 * Calculate backoff delay
 */
export const calculateBackoff = (attempt: number, options: RetryOptions): number => {
  const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelay);
};

/**
 * Execute function with retry logic
 */
export const executeWithRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = defaultRetryOptions
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if error is not retryable or if this was the last attempt
      if (!isRetryableError(error) || attempt === options.maxRetries) {
        throw error;
      }

      // Wait before retrying
      const delay = calculateBackoff(attempt, options);
      await sleep(delay);

      console.log(`Retry attempt ${attempt}/${options.maxRetries} after ${delay}ms`);
    }
  }

  throw lastError!;
};

/**
 * Sleep utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Parse error message from various error types
 */
export const parseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unknown error occurred';
};

/**
 * Format error for display to user
 */
export const formatErrorForUser = (error: any): string => {
  if (error instanceof ValidationError) {
    return `Validation Error: ${error.message}`;
  }

  if (error instanceof AuthenticationError) {
    return 'Authentication failed. Please check your API key.';
  }

  if (error instanceof RateLimitError) {
    return `Rate limit exceeded. ${error.retryAfter ? `Please try again in ${error.retryAfter} seconds.` : 'Please try again later.'}`;
  }

  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error instanceof APIError) {
    return `${error.apiName} Error: ${error.message}`;
  }

  return parseErrorMessage(error);
};

/**
 * Log error to console (in production, send to error tracking service)
 */
export const logError = (error: any, context?: Record<string, any>): void => {
  console.error('Error occurred:', {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      })
    } : error,
    context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle async errors in event handlers
 */
export const handleAsyncError = <T extends any[]>(
  fn: (...args: T) => Promise<void>
) => {
  return (...args: T) => {
    fn(...args).catch((error) => {
      logError(error, { function: fn.name, args });
    });
  };
};

/**
 * Create error from HTTP response
 */
export const createErrorFromResponse = async (
  response: Response,
  apiName: string
): Promise<APIError> => {
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  let details: any;

  try {
    const body = await response.json();
    errorMessage = body.error?.message || body.message || errorMessage;
    details = body;
  } catch {
    // If response is not JSON, use status text
  }

  // Return APIError for all cases to maintain type consistency
  return new APIError(errorMessage, apiName, response.status, details);
};

/**
 * Wrap promise with timeout
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new AppError(errorMessage, 'TIMEOUT')), timeoutMs)
    )
  ]);
};
