"use client"
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ code }: { code: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  async function onDelete() {
    startTransition(async () => {
      await fetch(`/api/links/${code}`, { method: 'DELETE' })
      router.refresh()
    })
  }
  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="px-2 py-1 rounded border text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      Delete
    </button>
  )
}