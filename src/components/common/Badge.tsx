import type { ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'sage' | 'earth' | 'cream' | 'red' | 'yellow' | 'green' | 'blue'
  className?: string
}

const variantClasses = {
  sage: 'bg-sage-100 text-sage-800',
  earth: 'bg-earth-100 text-earth-800',
  cream: 'bg-cream-200 text-cream-500',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
}

export default function Badge({ children, variant = 'sage', className = '' }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
