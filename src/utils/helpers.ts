import { format, formatDistanceToNow } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

export function formatDate(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return ''
  try {
    return format(timestamp.toDate(), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

export function formatDateRelative(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return ''
  try {
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
  } catch {
    return ''
  }
}

export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  if (s1 === s2) return 100

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const maxLen = Math.max(words1.length, words2.length)
  if (maxLen === 0) return 0

  let matches = 0
  for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
    if (words1[i] === words2[i]) matches++
  }

  return Math.round((matches / maxLen) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}