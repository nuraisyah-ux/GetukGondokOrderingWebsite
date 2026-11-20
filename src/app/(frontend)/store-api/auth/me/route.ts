import { appAuth } from '@/lib/app-auth'

export async function GET() {
  const user = await appAuth.currentUser()
  if (!user) return Response.json({ user: null }, { status: 401 })
  const appUser = user as typeof user & { name: string; role: 'admin' | 'owner' }
  return Response.json({
    user: { id: String(appUser.id), name: appUser.name, role: appUser.role },
  })
}
