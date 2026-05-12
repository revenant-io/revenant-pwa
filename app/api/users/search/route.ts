import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') ?? ''

  const upstream = await fetch(
    `${API_URL}/api/v1/users/search?username=${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
