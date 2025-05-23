export function getEnvironment() {
  const env = process.env.NODE_ENV
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV // Available on Vercel

  if (vercelEnv === 'preview') return '(pre) '
  if (env === 'development') return '(dev) '
  return ''
}
