import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const upstream = await fetch(`${API_URL}/api/v1/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const upstream = await fetch(`${API_URL}/api/v1/expenses/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const upstream = await fetch(`${API_URL}/api/v1/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
