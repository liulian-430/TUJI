import { useState } from 'react'
import { X } from 'lucide-react'
import Button from './common/Button.jsx'

const CreateTripModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    city: '',
    days: 3,
    nights: 2,
    people: 2,
  })

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value) || 0
    const nights = Math.min(form.nights, Math.max(0, days - 1))
    setForm({ ...form, days, nights })
  }

  const handleNightsChange = (e) => {
    const nights = parseInt(e.target.value) || 0
    if (nights <= form.days) {
      setForm({ ...form, nights })
    }
  }

  const handleSubmit = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">新建行程</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">行程名称</label>
            <input 
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="给你的行程起个名字"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">目的地城市</label>
            <input 
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="你想去哪里？"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">天数</label>
              <div className="flex items-center">
                <input 
                  type="number"
                  min="1"
                  max="30"
                  value={form.days}
                  onChange={handleDaysChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <span className="ml-2 text-gray-500">天</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">夜数</label>
              <div className="flex items-center">
                <input 
                  type="number"
                  min="0"
                  max={form.days}
                  value={form.nights}
                  onChange={handleNightsChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <span className="ml-2 text-gray-500">夜</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">出行人数</label>
            <input 
              type="number"
              min="1"
              max="20"
              value={form.people}
              onChange={(e) => setForm({ ...form, people: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <Button fullWidth onClick={handleSubmit}>
            创建行程
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateTripModal
