import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types'
import Button from '../common/Button'
import { BookOpen, Eye, EyeOff, GraduationCap, Users } from 'lucide-react'
import clsx from 'clsx'

interface RegisterFormData {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const { signUp, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true)
      clearError()
      await signUp(data.email, data.password, data.displayName, role)
      navigate(role === 'teacher' ? '/teacher' : '/student')
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sage-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start your English learning journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                  role === 'student'
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-cream-200 hover:border-sage-200'
                )}
              >
                <GraduationCap className={clsx('w-6 h-6', role === 'student' ? 'text-sage-700' : 'text-gray-400')} />
                <span className={clsx('text-sm font-medium', role === 'student' ? 'text-sage-700' : 'text-gray-600')}>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                  role === 'teacher'
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-cream-200 hover:border-sage-200'
                )}
              >
                <Users className={clsx('w-6 h-6', role === 'teacher' ? 'text-sage-700' : 'text-gray-400')} />
                <span className={clsx('text-sm font-medium', role === 'teacher' ? 'text-sage-700' : 'text-gray-600')}>Teacher</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                {...register('displayName', { required: 'Name is required' })}
                className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="Your full name"
              />
              {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent pr-10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
