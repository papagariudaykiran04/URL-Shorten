"use client"
import { useState, useTransition } from 'react'
import { isValidUrl, isValidCode } from '../lib/validation'
import CopyButton from './CopyButton'
import { useRouter } from 'next/navigation'

export default function LinkForm() {
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ code: string; url: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''

  function validate() {
    if (!isValidUrl(url.trim())) {
      setError('Enter a valid http(s) URL')
      return false
    }
    if (code && !isValidCode(code.trim())) {
      setError('Code must be 6-8 letters or digits')
      return false
    }
    setError('')
    return true
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(null)
    if (!validate()) return
    startTransition(async () => {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), code: code.trim() || undefined })
      })
      if (res.status === 201) {
        const data = await res.json()
        setError('')
        setSuccess(data)
        setUrl('')
        setCode('')
        router.refresh()
      } else if (res.status === 409) {
        setError('That code is already taken')
      } else if (res.status === 400) {
        setError('Invalid input')
      } else {
        setError('Unexpected error')
      }
    })
  }

  const short = success ? `${base}/${success.code}` : ''

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Long URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Custom code (optional)</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6-8 letters or digits"
          className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? 'Creating…' : 'Create short link'}
        </button>
        {success && short && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm px-2 py-1 rounded bg-gray-100 border">{short}</span>
            <CopyButton text={short} />
          </div>
        )}
      </div>
    </form>
  )
}