import { useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface AppError extends Error {
  code?: string
  statusCode?: number
  isOperational?: boolean
  context?: Record<string, any>
}

interface ErrorHandlerOptions {
  showToast?: boolean
  logToConsole?: boolean
  sendToMonitoring?: boolean
  fallbackMessage?: string
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast()
  const {
    showToast = true,
    logToConsole = true,
    sendToMonitoring = true,
    fallbackMessage = 'An unexpected error occurred',
  } = options

  const handleError = useCallback((error: Error | AppError, context?: Record<string, any>) => {
    // Log to console in development
    if (logToConsole && process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
      if (context) console.error('Context:', context)
    }

    // Determine error message for user
    let userMessage = fallbackMessage
    let errorTitle = 'Error'

    if (error instanceof Error) {
      // Check if it's an operational error we can show to user
      if ('isOperational' in error && error.isOperational) {
        userMessage = error.message
      }
      
      // Handle specific error codes
      if ('code' in error) {
        switch (error.code) {
          case 'AUTH_REQUIRED':
            errorTitle = 'Authentication Required'
            userMessage = 'Please sign in to continue'
            break
          case 'PERMISSION_DENIED':
            errorTitle = 'Permission Denied'
            userMessage = 'You do not have permission to perform this action'
            break
          case 'VALIDATION_ERROR':
            errorTitle = 'Validation Error'
            userMessage = error.message
            break
          case 'NETWORK_ERROR':
            errorTitle = 'Network Error'
            userMessage = 'Please check your internet connection'
            break
          case 'API_LIMIT':
            errorTitle = 'Rate Limit Exceeded'
            userMessage = 'Too many requests. Please try again later'
            break
        }
      }

      // Handle HTTP status codes
      if ('statusCode' in error) {
        switch (error.statusCode) {
          case 400:
            errorTitle = 'Bad Request'
            break
          case 401:
            errorTitle = 'Unauthorized'
            userMessage = 'Please sign in again'
            break
          case 403:
            errorTitle = 'Forbidden'
            userMessage = 'You do not have access to this resource'
            break
          case 404:
            errorTitle = 'Not Found'
            userMessage = 'The requested resource was not found'
            break
          case 429:
            errorTitle = 'Too Many Requests'
            userMessage = 'Please slow down and try again'
            break
          case 500:
            errorTitle = 'Server Error'
            userMessage = 'Something went wrong on our end'
            break
        }
      }
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: errorTitle,
        description: userMessage,
        variant: 'destructive',
      })
    }

    // Send to monitoring service
    if (sendToMonitoring && process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry or other monitoring service
      // Example:
      // Sentry.captureException(error, {
      //   contexts: {
      //     app: context,
      //   },
      // })
    }

    return { userMessage, errorTitle }
  }, [toast, showToast, logToConsole, sendToMonitoring, fallbackMessage])

  // Global error handler for uncaught errors
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      handleError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(event.reason), {
        type: 'unhandledRejection',
      })
    }

    window.addEventListener('error', handleUnhandledError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleUnhandledError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [handleError])

  return { handleError }
}

// Async error boundary wrapper
export function useAsyncError() {
  const { handleError } = useErrorHandler()
  
  return useCallback((error: Error) => {
    handleError(error)
    throw error // Re-throw to trigger error boundary
  }, [handleError])
}