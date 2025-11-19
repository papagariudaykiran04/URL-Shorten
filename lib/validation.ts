// c:\Users\papag\OneDrive\Desktop\Trae\lib\validation.ts
export function isValidUrl(input: string) {
  try {
    const u = new URL(input)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidCode(input: string) {
  return /^[a-zA-Z0-9]{6,8}$/.test(input)
}