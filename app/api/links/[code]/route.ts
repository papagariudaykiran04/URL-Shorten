import { db, sql } from '../../../../db/client'
import { links } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code
    const rows = await db.select().from(links).where(eq(links.code, code)).limit(1)
    if (!rows.length) {
      return new Response('Not found', { status: 404 })
    }
    const r: any = rows[0] as any
    const data = {
      id: r.id,
      code: r.code,
      url: r.url,
      clicks: r.clicks ?? 0,
      lastClickedAt: r.lastClickedAt ? new Date(r.lastClickedAt).toISOString() : null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : ''
    }
    return Response.json(data, { status: 201 })
  } catch {
    return new Response('Unexpected error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code
    const res = await db.delete(links).where(eq(links.code, code))
    return new Response(null, { status: 204 })
  } catch {
    return new Response('Unexpected error', { status: 500 })
  }
}