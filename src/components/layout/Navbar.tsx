import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Logo from '../common/Logo'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-cream-200/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-sage-700 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-sage-700 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-sage-700 transition-colors">Testimonials</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to={user.role === 'teacher' ? '/teacher' : '/student'}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-cream-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up border-t border-cream-200 mt-1 pt-4 bg-white/95 backdrop-blur-lg rounded-b-2xl">
            <div className="flex flex-col gap-3 mb-4">
              <a href="#features" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-sage-700">Features</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-sage-700">How It Works</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-sage-700">Testimonials</a>
            </div>
            <div className="flex flex-col gap-2 px-3">
              {user ? (
                <Link to={user.role === 'teacher' ? '/teacher' : '/student'}>
                  <Button size="sm" className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login"><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link>
                  <Link to="/register"><Button size="sm" className="w-full">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
