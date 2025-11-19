import './globals.css'

export const metadata = {
  title: 'TinyLink',
  description: 'Simple link shortener',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          <header className="border-b bg-gradient-to-r from-brand-600 to-brand-500">
            <div className="container mx-auto max-w-4xl px-6 py-5 text-white">
              <h1 className="text-2xl font-semibold">TinyLink</h1>
              <p className="text-sm opacity-80">Simple, fast URL shortener</p>
            </div>
          </header>
          <main className="container mx-auto max-w-4xl p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
