import 'server-only'

import type { User } from 'payload'
import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export async function requireProductManager(request: Request): Promise<User> {
  const appUser = await appAuth.currentUser()
  if (
    appUser?.collection === 'app-users' &&
    appUser.role === 'admin' &&
    appUser.status !== 'nonaktif'
  ) {
    return appUser
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (user?.collection === 'admins') return user

  throw new Error('UNAUTHORIZED')
}
