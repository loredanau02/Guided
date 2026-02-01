import { useScrollReveal } from '../../hooks/useScrollReveal'
import { UserPlus, BookOpen, Mic, Trophy } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up as a teacher to craft content, or as a student to start learning — completely free.',
    color: 'bg-sage-100 text-sage-700',
  },
  {
    icon: BookOpen,
    number: '02',
    title: 'Explore & Learn',
    description: 'Browse grammar lessons, read interactive stories, build vocabulary with flashcards.',
    color: 'bg-earth-100 text-earth-600',
  },
  {
    icon: Mic,
    number: '03',
    title: 'Practice & Speak',
    description: 'Use speech recognition to practice pronunciation and get instant, word-by-word feedback.',
    color: 'bg-sage-100 text-sage-700',
  },
  {
    icon: Trophy,
    number: '04',
    title: 'Test & Track',
    description: 'Take quizzes, earn scores, and watch your progress grow on your personal dashboard.',
    color: 'bg-earth-100 text-earth-600',
  },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="how-it-works" className="py-24 bg-cream-50 scroll-mt-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-earth-500 mb-3">Getting Started</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Up and running in{' '}
            <span className="text-gradient">four steps</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            No complicated setup. Sign up, explore content, and start improving your English today.
          </p>
        </div>

        <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-cream-300">
            <div
              className="h-full bg-sage-400 transition-all duration-[2000ms]"
              style={{ width: isVisible ? '100%' : '0%' }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map(({ icon: Icon, number, title, description, color }, i) => (
              <div
                key={number}
                className="relative text-center group"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-cream-300 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                    {number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
