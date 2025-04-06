import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

interface UseAsyncOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  errorMessage?: string
}

/**
 * A hook for handling async operations with consistent loading and error states
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
  } = options

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, isLoading: true, error: null })
      try {
        const result = await asyncFunction(...args)
        setState({ data: result, isLoading: false, error: null })
        
        if (showSuccessToast) {
          toast.success(successMessage)
        }
        
        if (onSuccess) {
          onSuccess(result)
        }
        
        return result
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        setState({ data: null, isLoading: false, error })
        
        if (showErrorToast) {
          toast.error(`${errorMessage}: ${error.message}`)
        }
        
        if (onError) {
          onError(error)
        }
        
        throw error
      }
    },
    [asyncFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage]
  )

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, isLoading: false, error: null })
    }, []),
  }
}
