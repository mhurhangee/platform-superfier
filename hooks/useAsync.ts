import { useState, useCallback, useRef, useEffect } from 'react'
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

  // Use a ref for options to prevent unnecessary recreation of the execute function
  const optionsRef = useRef(options)
  
  // Update the ref when options change
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, isLoading: true, error: null })
      try {
        const result = await asyncFunction(...args)
        setState({ data: result, isLoading: false, error: null })
        
        const { 
          onSuccess, 
          showSuccessToast, 
          successMessage = 'Operation completed successfully' 
        } = optionsRef.current
        
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
        
        const { 
          onError, 
          showErrorToast = true, 
          errorMessage = 'Operation failed' 
        } = optionsRef.current
        
        if (showErrorToast) {
          toast.error(`${errorMessage}: ${error.message}`)
        }
        
        if (onError) {
          onError(error)
        }
        
        throw error
      }
    },
    [asyncFunction] // Only depend on the asyncFunction
  )

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, isLoading: false, error: null })
    }, []),
  }
}
