import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#eaf2ff',
          200: '#cfe1ff',
          300: '#a7c7ff',
          400: '#7aa7ff',
          500: '#4e86ff',
          600: '#2d66e6',
          700: '#224fb3',
          800: '#1c408f',
          900: '#163270'
        }
      }
    }
  },
  plugins: []
}

export default config
