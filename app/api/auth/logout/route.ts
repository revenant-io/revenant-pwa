import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })

  response.cookies.set('token', '', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })

  response.cookies.set('user_info', '', {
    httpOnly: false,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })

  return response
}
