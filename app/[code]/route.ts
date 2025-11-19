import { db, sql } from '../../db/client'
import { links } from '../../db/schema'
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
    await sql`UPDATE links SET clicks = clicks + 1, last_clicked_at = now() WHERE code = ${code}`
    return Response.redirect(r.url, 302)
  } catch {
    return new Response('Unexpected error', { status: 500 })
  }
}