import { NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen, FileText, BookOpenCheck, Languages, Mic, ClipboardList,
  Users, BarChart3, Home, LogOut, GraduationCap,
} from 'lucide-react'
import type { UserRole } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'

interface SidebarProps {
  role: UserRole
}

const teacherLinks = [
  { to: '/teacher', icon: Home, label: 'Dashboard', end: true },
  { to: '/teacher/lessons', icon: FileText, label: 'Lessons' },
  { to: '/teacher/stories', icon: BookOpenCheck, label: 'Stories' },
  { to: '/teacher/vocabulary', icon: Languages, label: 'Vocabulary' },
  { to: '/teacher/pronunciation', icon: Mic, label: 'Pronunciation' },
  { to: '/teacher/quizzes', icon: ClipboardList, label: 'Quizzes' },
  { to: '/teacher/students', icon: Users, label: 'Students' },
]

const studentLinks = [
  { to: '/student', icon: Home, label: 'Dashboard', end: true },
  { to: '/student/lessons', icon: FileText, label: 'Lessons' },
  { to: '/student/stories', icon: BookOpenCheck, label: 'Stories' },
  { to: '/student/vocabulary', icon: Languages, label: 'Vocabulary' },
  { to: '/student/pronunciation', icon: Mic, label: 'Pronunciation' },
  { to: '/student/quizzes', icon: ClipboardList, label: 'Quizzes' },
  { to: '/student/progress', icon: BarChart3, label: 'Progress' },
]

export default function Sidebar({ role }: SidebarProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const links = role === 'teacher' ? teacherLinks : studentLinks

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="w-64 bg-sage-900 text-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-sage-700">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-sage-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Guided</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sage-700 text-white'
                  : 'text-sage-300 hover:bg-sage-800 hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sage-700">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.displayName}</p>
            <p className="text-xs text-sage-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sage-300 hover:bg-sage-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
