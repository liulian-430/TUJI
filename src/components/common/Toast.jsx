import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { useUIStore } from '../../store'

const Toast = () => {
  const toast = useUIStore(state => state.toast)

  if (!toast) return null

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-indigo-500',
  }

  const Icon = icons[toast.type] || Info

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className={`${colors[toast.type]} text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2`}>
        <Icon size={20} />
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  )
}

export default Toast
