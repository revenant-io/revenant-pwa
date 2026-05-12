import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const upstream = await fetch(`${API_URL}/api/v1/expenses/${id}/participants`, {
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
