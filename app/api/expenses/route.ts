import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const query = type ? `?type=${encodeURIComponent(type)}` : ''

  const upstream = await fetch(`${API_URL}/api/v1/expenses${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const upstream = await fetch(`${API_URL}/api/v1/expenses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
