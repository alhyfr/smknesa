'use client'

export default function Button({
    label,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = ''
}) {
    // Variant styles
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
        success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
        danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600',
        outline: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent'
    }

    // Size styles
    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    }

    // Icon-only padding (square-ish)
    const iconOnlySizes = {
        xs: 'p-1.5',
        sm: 'p-2',
        md: 'p-2.5',
        lg: 'p-3',
        xl: 'p-4'
    }

    // Icon size based on button size
    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-7 h-7'
    }

    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'

    const widthClass = fullWidth ? 'w-full' : ''
    // If no label, use iconOnly sizes
    const sizeClass = !label && icon ? iconOnlySizes[size] : sizes[size]

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizeClass} ${widthClass} ${className}`}
        >
            {loading && (
                <svg className={`animate-spin ${iconSizes[size]}`} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            {!loading && icon && iconPosition === 'left' && (
                <span className={iconSizes[size]}>{icon}</span>
            )}

            {label}

            {!loading && icon && iconPosition === 'right' && (
                <span className={iconSizes[size]}>{icon}</span>
            )}
        </button>
    )
}
