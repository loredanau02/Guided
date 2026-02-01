import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, PenTool } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'

export default function CallToAction() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-24 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative overflow-hidden rounded-[2rem] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-sage-800 via-sage-800 to-sage-900" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sage-600/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-sage-500/20 blur-3xl" />

          <div className="relative px-8 py-16 lg:px-16 lg:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
                Start your English journey<br className="hidden sm:block" /> today — completely free
              </h2>
              <p className="text-sage-200 text-lg max-w-2xl mx-auto leading-relaxed">
                Whether you want to teach or learn, Guided has everything you need in one place.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                to="/register"
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I want to learn</h3>
                <p className="text-sm text-sage-200 mb-4 leading-relaxed">
                  Access lessons, stories, vocabulary, pronunciation practice, and quizzes.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:gap-2.5 transition-all">
                  Sign up as Student <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                to="/register"
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I want to teach</h3>
                <p className="text-sm text-sage-200 mb-4 leading-relaxed">
                  Create content, build quizzes, and track your students' progress.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:gap-2.5 transition-all">
                  Sign up as Teacher <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
            <div className="text-center mt-10">
              <Link to="/register">
                <Button size="lg" className="bg-white text-sage-800 hover:bg-cream-100 shadow-lg shadow-sage-900/30">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}