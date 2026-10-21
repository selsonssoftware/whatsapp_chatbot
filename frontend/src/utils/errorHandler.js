export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error occurred', details = null) {
    super(message, 'NETWORK_ERROR', details)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details = null) {
    super(message, 'AUTH_ERROR', details)
    this.name = 'AuthenticationError'
  }
}

export function handleError(error) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    }
  }

  if (error instanceof TypeError) {
    return {
      message: 'A type error occurred',
      code: 'TYPE_ERROR',
      details: error.message,
    }
  }

  if (error instanceof SyntaxError) {
    return {
      message: 'A syntax error occurred',
      code: 'SYNTAX_ERROR',
      details: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    details: error.message,
  }
}

export function getErrorMessage(error) {
  const handled = handleError(error)
  return handled.message
}

export function logError(error, context = {}) {
  console.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    context,
  })
}
