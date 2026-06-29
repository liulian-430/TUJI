import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">出了点小问题</h2>
            <p className="text-gray-500 mb-6">
              {this.state.error?.message || '页面加载出错了，请重试'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCcw size={20} />
              重新加载
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
