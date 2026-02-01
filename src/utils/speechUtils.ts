export function comparePronunciation(target: string, spoken: string): {
  score: number
  wordResults: Array<{ word: string; matched: boolean }>
} {
  const targetWords = target.toLowerCase().trim().split(/\s+/)
  const spokenWords = spoken.toLowerCase().trim().split(/\s+/)

  const wordResults = targetWords.map((word, index) => ({
    word,
    matched: index < spokenWords.length && spokenWords[index] === word,
  }))

  const matchedCount = wordResults.filter(w => w.matched).length
  const score = targetWords.length > 0 ? Math.round((matchedCount / targetWords.length) * 100) : 0

  return { score, wordResults }
}

export function isWebSpeechSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}