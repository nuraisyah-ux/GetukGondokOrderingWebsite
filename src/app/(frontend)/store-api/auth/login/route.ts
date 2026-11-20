import { appAuth } from '@/lib/app-auth'

const usernames: Record<string, string> = {
  'admin.getuk': 'admin.getuk@getukgondok.local',
  'pemilik.getuk': 'pemilik.getuk@getukgondok.local',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const email = username.includes('@') ? username : usernames[username]

    if (!email || password.length < 6) {
      return Response.json({ error: 'Username atau password tidak valid.' }, { status: 400 })
    }

    const user = await appAuth.login(email, password)
    return Response.json({
      user: { id: String(user.id), name: user.name, role: user.role },
    })
  } catch {
    return Response.json({ error: 'Username atau password salah.' }, { status: 401 })
  }
}
