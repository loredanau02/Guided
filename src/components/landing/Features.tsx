import { useState } from 'react'
import { FileText, BookOpenCheck, Languages, Mic, ClipboardList, BarChart3 } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const features = [
  {
    icon: FileText,
    title: 'Grammar Lessons',
    description: 'Rich, teacher-authored grammar content with formatting  and difficulty levels.',
    color: 'sage' as const,
    preview: {
      heading: 'Present Perfect Tense',
      body: 'Used when the time of the action is not important or not specified.',
      example: 'I have visited Paris three times.',
      tag: 'Intermediate',
    },
  },
  {
    icon: BookOpenCheck,
    title: 'Interactive Stories',
    description: 'Engaging narratives with highlighted vocabulary. Learn words in context.',
    color: 'earth' as const,
    preview: {
      heading: 'The Lost Letter',
      body: 'Sarah found an old envelope tucked inside a library book.',
      example: '12 vocabulary words · 3 grammar links',
      tag: 'Beginner',
    },
  },
  {
    icon: Languages,
    title: 'Vocabulary Builder',
    description: 'Definitions, pronunciation, usage examples, and a flashcard study mode to lock in new words.',
    color: 'sage' as const,
    preview: {
      heading: 'Ephemeral',
      body: '/ɪˈfem.ər.əl/ — Lasting for a very short time.',
      example: '"The ephemeral beauty of cherry blossoms."',
      tag: 'Advanced',
    },
  },
  {
    icon: Mic,
    title: 'Pronunciation Practice',
    description: 'Speak into your mic. Get instant word-by-word feedback.',
    color: 'earth' as const,
    preview: {
      heading: '"Comfortable"',
      body: '/ˈkʌmf.tə.bəl/',
      example: 'Your score: 92% match',
      tag: 'Speech',
    },
  },
  {
    icon: ClipboardList,
    title: 'Quizzes & Assessments',
    description: 'Multiple choice, true/false, and fill-in-the-blank — timed or untimed, teacher-created.',
    color: 'sage' as const,
    preview: {
      heading: 'Grammar Check #5',
      body: '10 questions · 15 min',
      example: 'Passing score: 70%',
      tag: 'Quiz',
    },
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visual dashboards for students and teachers — charts, streaks, and completion badges.',
    color: 'earth' as const,
    preview: {
      heading: 'Your Progress',
      body: '24 lessons completed · 380 words learned',
      example: 'Quiz avg: 87%',
      tag: 'Stats',
    },
  },
]

const colorMap = {
  sage: {
    iconBg: 'bg-sage-100',
    iconText: 'text-sage-700',
    activeBorder: 'border-sage-500',
    activeBg: 'bg-sage-50',
    tagBg: 'bg-sage-100',
    tagText: 'text-sage-700',
    barBg: 'bg-sage-500',
  },
  earth: {
    iconBg: 'bg-earth-100',
    iconText: 'text-earth-600',
    activeBorder: 'border-earth-400',
    activeBg: 'bg-earth-50',
    tagBg: 'bg-earth-100',
    tagText: 'text-earth-600',
    barBg: 'bg-earth-400',
  },
}

export default function Features() {
  const [active, setActive] = useState(0)
  const { ref, isVisible } = useScrollReveal()

  const feat = features[active]
  const cm = colorMap[feat.color]

  return (
    <section id="features" className="py-24 bg-white scroll-mt-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-sage-600 mb-3">Platform Features</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Everything you need to{' '}
            <span className="text-gradient">master English</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A connected learning ecosystem — from grammar fundamentals to fluent pronunciation.
          </p>
        </div>

        <div className={`grid lg:grid-cols-5 gap-8 lg:gap-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="lg:col-span-2 space-y-2">
            {features.map(({ icon: Icon, title, description, color }, i) => {
              const c = colorMap[color]
              const isActive = i === active
              return (
                <button
                  key={title}
                  onClick={() => setActive(i)}
                  className={`w-full text-left rounded-xl p-4 transition-all duration-300 group ${
                    isActive
                      ? `${c.activeBg} border-l-4 ${c.activeBorder} shadow-sm`
                      : 'hover:bg-cream-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 shrink-0 rounded-lg ${c.iconBg} flex items-center justify-center transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Icon className={`w-5 h-5 ${c.iconText}`} />
                    </div>
                    <div>
                      <div className={`font-semibold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{title}</div>
                      <p className={`text-sm leading-relaxed mt-0.5 transition-all duration-300 overflow-hidden ${isActive ? 'max-h-20 opacity-100 text-gray-500' : 'max-h-0 opacity-0'}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-3 flex items-center justify-center">
            <div
              key={active}
              className="w-full max-w-md animate-fade-in-up"
            >
              <div className={`rounded-2xl border-2 ${cm.activeBorder} bg-white shadow-xl shadow-gray-900/5 overflow-hidden`}>
                <div className="bg-cream-50 px-6 py-4 border-b border-cream-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${cm.iconBg} flex items-center justify-center`}>
                      <feat.icon className={`w-5 h-5 ${cm.iconText}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{feat.preview.heading}</div>
                      <div className="text-xs text-gray-400">{feat.title}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${cm.tagBg} ${cm.tagText}`}>
                    {feat.preview.tag}
                  </span>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <p className="text-gray-600 leading-relaxed">{feat.preview.body}</p>

                  <div className="bg-cream-50 rounded-lg px-4 py-3 border border-cream-200">
                    <p className="text-sm text-gray-500 italic">{feat.preview.example}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cm.barBg} transition-all duration-1000`}
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-cream-50/50 border-t border-cream-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-400">Interactive preview</span>
                  </div>
                  <span className="text-xs font-medium text-sage-600">
                    {active + 1}/{features.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}