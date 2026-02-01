const phrases = [
  'Grammar Lessons',
  'Interactive Stories',
  'Vocabulary Builder',
  'Pronunciation Practice',
  'Quizzes & Assessments',
  'Progress Tracking',
  'Speech Recognition',
  'Teacher Dashboard',
]

export default function TrustBanner() {
  const items = [...phrases, ...phrases]

  return (
    <section className="py-6 bg-sage-800 overflow-hidden select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((phrase, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
            <span className="text-sm font-medium text-sage-200 tracking-wide uppercase">{phrase}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
