import { db } from '../../../db/client'
import { links } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CodePage({ params }: { params: { code: string } }) {
  const rows = await db.select().from(links).where(eq(links.code, params.code)).limit(1)
  if (!rows.length) {
    return (
      <main className="space-y-4">
        <h2 className="text-xl font-semibold">Not found</h2>
        <p className="text-sm text-gray-600">No link exists for code "{params.code}".</p>
      </main>
    )
  }
  const r: any = rows[0] as any
  const data = {
    code: r.code,
    url: r.url,
    clicks: r.clicks ?? 0,
    lastClickedAt: r.lastClickedAt ? new Date(r.lastClickedAt).toISOString() : null,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : ''
  }
  const base = process.env.BASE_URL || 'http://localhost:3000'
  return (
    <main className="space-y-6">
      <div className="p-4 bg-white rounded-md shadow border">
        <h2 className="text-lg font-semibold">Link stats</h2>
        <div className="mt-3 space-y-2">
          <div className="flex gap-2"><span className="w-32 text-gray-600">Short</span><span className="font-mono">{`${base}/${data.code}`}</span></div>
          <div className="flex gap-2"><span className="w-32 text-gray-600">Target</span><a href={data.url} className="text-blue-600 break-all">{data.url}</a></div>
          <div className="flex gap-2"><span className="w-32 text-gray-600">Total clicks</span><span>{data.clicks}</span></div>
          <div className="flex gap-2"><span className="w-32 text-gray-600">Last clicked</span><span>{data.lastClickedAt ?? ''}</span></div>
          <div className="flex gap-2"><span className="w-32 text-gray-600">Created</span><span>{data.createdAt ?? ''}</span></div>
        </div>
      </div>
    </main>
  )
}