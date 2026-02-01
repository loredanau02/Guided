import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import Button from '../common/Button'

const rotatingWords = ['Grammar', 'Stories', 'Vocabulary', 'Pronunciation']

function TypingWord({ word }: { word: string }) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing')

  useEffect(() => {
    setDisplayed('')
    setPhase('typing')
  }, [word])

  useEffect(() => {
    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('hold'), 1800)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'hold') {
      const t = setTimeout(() => setPhase('deleting'), 200)
      return () => clearTimeout(t)
    }
    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
        return () => clearTimeout(t)
      }
    }
  }, [displayed, phase, word])

  return (
    <>
      {displayed}
      <span className="inline-block w-[3px] h-[1em] bg-sage-500 ml-0.5 align-middle" style={{ animation: 'typewriter-cursor 0.8s step-end infinite' }} />
    </>
  )
}

function FloatingCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`absolute glass rounded-2xl border border-white/40 shadow-lg px-4 py-3 animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)

  const cycleWord = useCallback(() => {
    setWordIdx(i => (i + 1) % rotatingWords.length)
  }, [])

  useEffect(() => {
    const id = setInterval(cycleWord, 3000)
    return () => clearInterval(id)
  }, [cycleWord])

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-sage-100/50 animate-pulse-soft" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-earth-100/40 animate-pulse-soft" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-cream-200/30 animate-pulse-soft" style={{ animationDelay: '4s' }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #455A33 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100/80 border border-sage-200/60 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span className="text-xs font-semibold text-sage-700 tracking-wide uppercase">
                Free for educators & learners
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Learn English{' '}
              <br className="hidden sm:block" />
              through{' '}
              <span className="text-gradient inline-block min-w-[200px] sm:min-w-[270px]">
                <TypingWord word={rotatingWords[wordIdx]} />
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed">
              Teachers craft interactive lessons. Students learn with stories,
              real-time pronunciation feedback, and adaptive quizzes — all in one beautiful platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link to="/register">
                <Button size="lg" className="shadow-lg shadow-sage-700/20 hover:shadow-sage-700/30 transition-shadow">
                  Start Learning — Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-sage-700 transition-colors group"
              >
                <span className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center shadow-sm group-hover:border-sage-300 transition-colors">
                  <Play className="w-4 h-4 text-sage-700 ml-0.5" />
                </span>
                See how it works
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['bg-sage-400', 'bg-earth-400', 'bg-sage-600', 'bg-earth-300'].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-cream-50 flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">2,400+</span> learners already onboard
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in-right hidden lg:block">
            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="relative rounded-[2.5rem] bg-gray-900 p-3 shadow-2xl shadow-gray-900/20">
                <div className="phone-notch" />
                <div className="rounded-[2rem] overflow-hidden bg-cream-50">
                  <div className="h-12 bg-sage-800 flex items-end px-5 pb-2">
                    <span className="text-white/80 text-[11px] font-medium">Guided</span>
                    <span className="ml-auto text-white/50 text-[10px]">9:41</span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-cream-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-sage-100 flex items-center justify-center text-sage-700 text-sm font-bold">A</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Present Perfect Tense</div>
                          <div className="text-[11px] text-gray-400">Grammar &middot; Intermediate</div>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                        <div className="h-full w-3/5 rounded-full bg-sage-500 transition-all" />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1.5 text-right">60% complete</div>
                    </div>

                    <div className="bg-sage-700 rounded-xl p-4 text-white">
                      <div className="text-[10px] uppercase tracking-widest text-sage-200 mb-2">Pronunciation</div>
                      <div className="text-lg font-semibold mb-1">&ldquo;Thoroughly&rdquo;</div>
                      <div className="text-[11px] text-sage-200 mb-3">/ˈθʌr.ə.li/</div>
                      <div className="flex items-end gap-[3px] h-8">
                        {[40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 50, 75, 60, 40, 55, 80, 45, 65].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full bg-sage-400/60"
                            style={{
                              height: `${h}%`,
                              animation: 'pulse-soft 2s ease-in-out infinite',
                              animationDelay: `${i * 100}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-cream-200 shadow-sm">
                      <div className="text-[10px] uppercase tracking-widest text-earth-400 mb-2">Quiz</div>
                      <div className="text-sm font-medium text-gray-900 mb-3">
                        She ___ to London twice.
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['has been', 'have been', 'was been', 'had been'].map((opt, i) => (
                          <div
                            key={opt}
                            className={`text-xs py-2 px-3 rounded-lg text-center font-medium transition-colors ${
                              i === 0
                                ? 'bg-sage-100 border-2 border-sage-500 text-sage-700'
                                : 'bg-cream-50 border border-cream-300 text-gray-600'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <FloatingCard className="-left-16 top-20" delay={600}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Score: 95%</span>
                </div>
              </FloatingCard>

              <FloatingCard className="-right-12 top-40" delay={900}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-earth-100 flex items-center justify-center text-earth-600 text-xs font-bold">🔥</div>
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">7-day streak!</span>
                </div>
              </FloatingCard>

              <FloatingCard className="-left-10 bottom-28 animate-float" delay={1200}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Great pronunciation!</span>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
