import DeleteButton from './DeleteButton'
type Row = {
  id: number | string
  code: string
  url: string
  clicks?: number
  lastClickedAt?: string | null
  createdAt?: string
}

export default function LinksTable({ rows, base }: { rows: Row[]; base: string }) {
  return (
    <table className="w-full text-sm table-auto">
      <thead>
        <tr className="text-left bg-gray-100">
          <th className="p-2">Short</th>
          <th className="p-2">Target</th>
          <th className="p-2 text-center w-20">Clicks</th>
          <th className="p-2 text-center w-40">Last</th>
          <th className="p-2 text-center w-40">Created</th>
          <th className="p-2 text-right w-32">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t odd:bg-gray-50 hover:bg-gray-100 transition-colors">
            <td className="p-2 font-mono">
              <a href={`${base}/${r.code}`} className="text-blue-600 hover:underline">{`${base}/${r.code}`}</a>
            </td>
            <td className="p-2 truncate max-w-[28rem]">
              <a href={r.url} className="text-blue-600 hover:underline">{r.url}</a>
            </td>
            <td className="p-2 text-center">{r.clicks ?? 0}</td>
            <td className="p-2 text-center">{r.lastClickedAt ?? ''}</td>
            <td className="p-2 text-center">{r.createdAt ?? ''}</td>
            <td className="p-2">
              <div className="flex justify-end gap-2">
                <a href={`${base}/code/${r.code}`} className="px-2 py-1 rounded-lg border bg-white hover:bg-gray-50">Stats</a>
                <DeleteButton code={r.code} />
              </div>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td className="p-2 text-gray-500 text-center" colSpan={6}>No links yet</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
