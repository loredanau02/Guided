import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Testimonial {
  name: string
  role: string
  initials: string
  color: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Maria Gonzalez',
    role: 'ESL Student',
    initials: 'MG',
    color: 'bg-sage-400',
    text: "The pronunciation practice feature is incredible. I can hear myself improve week after week. The word-by-word feedback helped me fix mistakes I didn't even know I was making.",
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'English Teacher',
    initials: 'DK',
    color: 'bg-earth-400',
    text: "Creating lessons with the rich text editor is so intuitive. I love how I can link vocabulary to stories — my students understand context better and retain new words faster.",
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'University Student',
    initials: 'AP',
    color: 'bg-sage-600',
    text: "The flashcard study mode and quizzes make reviewing so efficient. I went from struggling with tenses to acing my grammar exams in just two months.",
    rating: 5,
  },
  {
    name: 'James Murphy',
    role: 'Language Instructor',
    initials: 'JM',
    color: 'bg-earth-500',
    text: "Having a dashboard that tracks each student's progress saves me hours every week. I can see exactly who needs help and with what topics.",
    rating: 5,
  },
  {
    name: 'Li Wei',
    role: 'Business Professional',
    initials: 'LW',
    color: 'bg-sage-500',
    text: 'The interactive stories are my favourite part. Learning vocabulary in context instead of random lists makes everything stick. My business English improved dramatically.',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    role: 'High School Teacher',
    initials: 'SL',
    color: 'bg-earth-300',
    text: "The quiz builder is flexible enough for any level. I create timed assessments for exams and untimed practice sets for homework — all in one place.",
    rating: 5,
  },
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - visibleCount)

  const next = useCallback(() => {
    setCurrentIndex(i => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  const prev = () => {
    setCurrentIndex(i => (i <= 0 ? maxIndex : i - 1))
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [isAutoPlaying, next])

  return (
    <section id="testimonials" className="py-24 bg-white scroll-mt-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-sage-600 mb-3">Testimonials</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Loved by learners{' '}
            <span className="text-gradient">& teachers</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            See what our community has to say about their learning experience.
          </p>
        </div>

        <div
          className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="px-3 shrink-0"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 h-full flex flex-col card-lift">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-cream-400 text-cream-400" />
                      ))}
                    </div>

                    <p className="text-gray-600 leading-relaxed flex-1 mb-6 text-sm">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
                      <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center hover:bg-cream-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-8 bg-sage-500'
                      : 'w-2 bg-cream-300 hover:bg-cream-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center hover:bg-cream-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
