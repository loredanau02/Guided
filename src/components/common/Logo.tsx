import { Link } from 'react-router-dom'
import clsx from 'clsx'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  className?: string
}

export default function Logo({ size = 'md', variant = 'dark', className }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', dot: 'w-2 h-2' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', dot: 'w-2.5 h-2.5' },
  }

  const s = sizes[size]

  return (
    <Link to="/" className={clsx('flex items-center gap-2.5 group', className)}>
      <div
        className={clsx(
          s.icon,
          'relative rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
          variant === 'dark'
            ? 'bg-sage-800'
            : 'bg-white/15'
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-[62%] h-[62%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8C4 8 7 6 16 6C25 6 28 8 28 8V25C28 25 25 23 16 23C7 23 4 25 4 25V8Z"
            fill={variant === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'}
          />
          <path
            d="M4 8C4 8 7 6 16 6V23C7 23 4 25 4 25V8Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 8C28 8 25 6 16 6V23C25 23 28 25 28 25V8Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 11L17.5 14.5L16 18L14.5 14.5L16 11Z"
            fill="white"
            opacity="0.9"
          />
          <circle cx="16" cy="14.5" r="1.2" fill={variant === 'dark' ? '#8AA56A' : '#C8D6B8'} />
        </svg>
      </div>

      <div className="flex items-baseline gap-0">
        <span
          className={clsx(
            s.text,
            'font-bold tracking-tight transition-colors duration-200',
            variant === 'dark' ? 'text-gray-900' : 'text-white'
          )}
        >
          Guided
        </span>
        <span
          className={clsx(
            s.dot,
            'rounded-full ml-0.5 mb-0.5',
            variant === 'dark' ? 'bg-sage-500' : 'bg-sage-300'
          )}
        />
      </div>
    </Link>
  )
}