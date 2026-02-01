import { useEffect } from 'react'
import { useScrollReveal, useCountUp } from '../../hooks/useScrollReveal'

const stats = [
  { end: 2400, label: 'Active Learners', suffix: '+' },
  { end: 150, label: 'Grammar Lessons', suffix: '+' },
  { end: 5000, label: 'Vocabulary Words', suffix: '+' },
  { end: 98, label: 'Satisfaction Rate', suffix: '%' },
]

function StatItem({ end, label, suffix, startCounting }: {
  end: number
  label: string
  suffix: string
  startCounting: boolean
}) {
  const { count, start } = useCountUp(end, 2200, true)

  useEffect(() => {
    if (startCounting) start()
  }, [startCounting, start])

  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-1">
        {count.toLocaleString()}
        <span className="text-sage-300">{suffix}</span>
      </div>
      <div className="text-sm text-sage-200 font-medium">{label}</div>
    </div>
  )
}

export default function Stats() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-sage-800" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-sage-600/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-sage-600/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map(s => (
            <StatItem key={s.label} {...s} startCounting={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
