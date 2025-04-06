/**
 * Utility functions for API responses
 */

/**
 * Create a standardized error response
 */
export function createErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

/**
 * Create a standardized success response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSuccessResponse(data: any) {
  return Response.json(data)
}
