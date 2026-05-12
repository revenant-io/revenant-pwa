import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const upstream = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!upstream.ok) {
    const text = await upstream.text()
    return NextResponse.json(
      { error: text || 'Login failed' },
      { status: upstream.status }
    )
  }

  const data = await upstream.json()

  const response = NextResponse.json({ ok: true })

  // HttpOnly cookie for the JWT — not accessible from JS
  response.cookies.set('token', data.token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400,
  })

  // Non-HttpOnly companion cookie for user info — readable from JS
  response.cookies.set('user_info', JSON.stringify(data.user), {
    httpOnly: false,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400,
  })

  return response
}
