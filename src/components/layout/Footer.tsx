import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import { BookOpen, Mic, ClipboardList, BarChart3, Languages, FileText } from 'lucide-react'

const featureLinks = [
  { icon: FileText, label: 'Grammar Lessons' },
  { icon: BookOpen, label: 'Interactive Stories' },
  { icon: Languages, label: 'Vocabulary Builder' },
  { icon: Mic, label: 'Pronunciation' },
  { icon: ClipboardList, label: 'Quizzes' },
  { icon: BarChart3, label: 'Progress Tracking' },
]

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Logo size="md" variant="light" />
            <p className="text-sage-300 text-sm leading-relaxed mt-4 max-w-xs">
              A comprehensive English learning platform connecting teachers and students through interactive content.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-sage-200 mb-4">Features</h4>
            <ul className="space-y-3">
              {featureLinks.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <a href="#features" className="flex items-center gap-2 text-sm text-sage-300 hover:text-white transition-colors group">
                    <Icon className="w-3.5 h-3.5 text-sage-500 group-hover:text-sage-300 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-sage-200 mb-4">Get Started</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-sage-300 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="text-sm text-sage-300 hover:text-white transition-colors">Sign In</Link></li>
              <li><a href="#how-it-works" className="text-sm text-sage-300 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="text-sm text-sage-300 hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-sage-200 mb-4">For Teachers</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-sage-300">Create lessons</span></li>
              <li><span className="text-sm text-sage-300">Build custom quizzes</span></li>
              <li><span className="text-sm text-sage-300">Track progress of your students</span></li>
              <li><span className="text-sm text-sage-300">Manage content</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-sage-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sage-400 text-xs">
            &copy; {new Date().getFullYear()} Guided. Made by Loredana Usurelu. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sage-400 hover:text-sage-200 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-sage-400 hover:text-sage-200 text-xs transition-colors">Terms</a>
            <a href="#" className="text-sage-400 hover:text-sage-200 text-xs transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}