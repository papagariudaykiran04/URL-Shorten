export const dynamic = 'force-dynamic'

export const revalidate = 0
import LinkForm from '../components/LinkForm'
import LinksTable from '../components/LinksTable'
import { db } from '../db/client'
import { links } from '../db/schema'
import { desc } from 'drizzle-orm'

export default async function HomePage() {
  const rows = await db.select().from(links).orderBy(desc(links.createdAt))
  const base = process.env.BASE_URL || 'https://url-shorten-8v9x.onrender.com'
  const plainRows = (rows as any[]).map((r: any) => ({
    id: r.id,
    code: r.code,
    url: r.url,
    clicks: r.clicks ?? 0,
    lastClickedAt: r.lastClickedAt ? new Date(r.lastClickedAt).toISOString() : null,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : ''
  }))
  return (
    <main className="space-y-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Create a short link</h2>
          <p className="text-sm text-gray-600">Paste a long URL and add an optional custom code.</p>
          <div className="mt-4">
            <LinkForm />
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your links</h2>
          </div>
          <div className="mt-4">
            <LinksTable rows={plainRows as any} base={base} />
          </div>
        </div>
      </section>
    </main>
  )
}
