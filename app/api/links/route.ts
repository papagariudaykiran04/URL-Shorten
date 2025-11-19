// c:\Users\papag\OneDrive\Desktop\Trae\app\api\links\route.ts
import { db, sql } from '../../../db/client'
import { links } from '../../../db/schema'
import { isValidUrl, isValidCode } from '../../../lib/validation'
import { eq, desc } from 'drizzle-orm'

function generateCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const len = 6 + Math.floor(Math.random() * 3) // 6–8
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export async function POST(req: Request) {
  try {
    const { url, code } = await req.json()

    console.log("Incoming Request:", { url, code })

    if (!url || !isValidUrl(url)) {
      console.error("Invalid URL received:", url)
      return new Response('Invalid input', { status: 400 })
    }

    let finalCode = typeof code === 'string' && code.trim() ? code.trim() : ''

    if (finalCode) {
      if (!isValidCode(finalCode)) {
        console.error("Invalid Code format:", finalCode)
        return new Response('Invalid input', { status: 400 })
      }

      const existing = await db.select().from(links).where(eq(links.code, finalCode)).limit(1)
      if (existing.length) {
        console.error("Code already exists:", finalCode)
        return new Response('Conflict', { status: 409 })
      }

    } else {
      for (let i = 0; i < 6; i++) {
        const candidate = generateCode()
        const existing = await db.select().from(links).where(eq(links.code, candidate)).limit(1)
        console.log(`Generated candidate: ${candidate}, exists:`, existing.length > 0)

        if (!existing.length) {
          finalCode = candidate
          break
        }
      }

      if (!finalCode) {
        console.error("Failed to generate unique code")
        return new Response('Unexpected error', { status: 500 })
      }
    }

    try {
      await db.insert(links).values({ url, code: finalCode })
      console.log("Inserted successfully:", { url, finalCode })
      return Response.json({ code: finalCode, url }, { status: 201 })

    } catch (err: any) {
      console.error("DB Insert Error:", err)

      const msg = String(err?.message || err)
      if (err?.code === '23505' || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        return new Response('Conflict', { status: 409 })
      }

      return new Response('Unexpected error', { status: 500 })
    }

  } catch (err: any) {
    console.error("API Outer Error:", err)
    return new Response('Unexpected error', { status: 500 })
  }
}


export async function GET() {
  try {
    const rows = await db.select().from(links).orderBy(desc(links.createdAt))
    const data = (rows as any[]).map((r: any) => ({
      id: r.id,
      code: r.code,
      url: r.url,
      clicks: r.clicks ?? 0,
      lastClickedAt: r.lastClickedAt ? new Date(r.lastClickedAt).toISOString() : null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : ''
    }))
    return Response.json(data, { status: 201 })
  } catch {
    return new Response('Unexpected error', { status: 500 })
  }
}