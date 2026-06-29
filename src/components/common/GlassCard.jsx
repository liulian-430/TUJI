const GlassCard = ({ 
  children, 
  variant = 'default', 
  hover = false, 
  onClick, 
  className = '' 
}) => {
  const variants = {
    default: 'bg-white/70 backdrop-blur-lg border border-white/20',
    strong: 'bg-white/85 backdrop-blur-xl border border-white/30',
    light: 'bg-white/50 backdrop-blur-md border border-white/10',
    tinted: 'bg-gradient-to-br from-indigo-50/70 to-purple-50/70 backdrop-blur-lg border border-indigo-100/30',
  }

  return (
    <div
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        rounded-2xl shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default GlassCard
