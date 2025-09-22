import { AppwriteException } from 'appwrite';

export class AppError extends Error {
  code: string;
  type: string;

  constructor(message: string, code: string, type: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.type = type;
  }
}

export function handleAppwriteError(error: unknown): never {
  if (error instanceof AppwriteException) {
    throw new AppError(
      getReadableErrorMessage(error),
      error.code?.toString() || 'unknown',
      'appwrite'
    );
  }
  
  if (error instanceof Error) {
    throw new AppError(error.message, 'unknown', 'general');
  }
  
  throw new AppError('An unexpected error occurred', 'unknown', 'unknown');
}

function getReadableErrorMessage(error: AppwriteException): string {
  switch (error.code) {
    case 401:
      return 'Please sign in to continue';
    case 403:
      return 'You don\'t have permission to perform this action';
    case 404:
      return 'The requested resource was not found';
    case 429:
      return 'Too many requests. Please try again later';
    case 500:
      return 'Server error. Please try again later';
    default:
      return error.message || 'An unexpected error occurred';
  }
}