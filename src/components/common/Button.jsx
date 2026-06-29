const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    secondary: 'bg-white/80 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-md',
    outline: 'bg-transparent text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-full
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </button>
  )
}

export default Button
