import { auth } from '@clerk/nextjs/server'

export async function getUserId() {
  const { userId } = await auth()

  return { userId}
}

export async function getOrgId() {
  const { orgId } = await auth()

  return { orgId }
}