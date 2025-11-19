"use client"
import { useState } from "react"

export default function CopyButton({ text, type = "button" }: { text: string; type?: "button" | "submit" }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <button
      type={type}
      onClick={handleCopy}
      className={`px-3 py-1 rounded-lg border flex items-center gap-2 transition
      ${copied ? "bg-green-100 border-green-500 text-green-700" : "bg-gray-100 border-gray-300"}`}
    >
      {copied ? "Copied" : "Copy"}
      {copied && <span className="text-green-600 font-bold">✓</span>}
    </button>
  )
}
