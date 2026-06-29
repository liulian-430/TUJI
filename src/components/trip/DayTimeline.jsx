import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, GripVertical, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import GlassCard from '../common/GlassCard'
import { useTripStore, useUIStore } from '../../store'

const typeColors = {
  attraction: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' },
  food: { bg: 'bg-pink-100', text: 'text-pink-600', dot: 'bg-pink-500' },
  shopping: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
}

const typeLabels = {
  attraction: '景点',
  food: '美食',
  shopping: '购物',
}

const DayTimeline = ({ dayIndex, pois }) => {
  const navigate = useNavigate()
  const { removePOI, reorderPOIs } = useTripStore()
  const { showToast } = useUIStore()
  
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      reorderPOIs(dayIndex, draggedIndex, dragOverIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleMoveUp = (index) => {
    if (index > 0) {
      reorderPOIs(dayIndex, index, index - 1)
    }
  }

  const handleMoveDown = (index) => {
    if (index < pois.length - 1) {
      reorderPOIs(dayIndex, index, index + 1)
    }
  }

  const handleDelete = (poiId, poiName) => {
    if (confirm(`确定要移除"${poiName}"吗？`)) {
      removePOI(poiId, dayIndex)
      showToast('已移除', 'success')
    }
  }

  if (pois.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">这一天还没有安排</p>
        <p className="text-sm text-gray-400 mt-1">去搜索景点添加吧</p>
      </GlassCard>
    )
  }

  let currentTime = 9 * 60

  return (
    <div className="relative">
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 rounded-full" />
      <div className="space-y-3">
        {pois.map((poi, index) => {
          const colors = typeColors[poi.type] || typeColors.attraction
          const startTime = currentTime
          currentTime += (poi.duration || 2) * 60 + 30
          const endTime = currentTime - 30
          const formatTime = (minutes) => {
            const h = Math.floor(minutes / 60)
            const m = minutes % 60
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          }
          return (
            <div
              key={poi.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative pl-14 transition-all ${draggedIndex === index ? 'opacity-50' : ''} ${dragOverIndex === index && draggedIndex !== index ? 'scale-[1.02]' : ''}`}
            >
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${colors.dot} border-4 border-white shadow-lg z-10`} />
              <GlassCard hover className="p-3 cursor-pointer" onClick={() => navigate(`/app/poi/${poi.id}`)}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation() }}
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={18} />
                  </button>
                  <img src={poi.image} alt={poi.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {typeLabels[poi.type] || poi.type}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(startTime)} - {formatTime(endTime)}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800 truncate">{poi.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <span>⏱ {poi.duration}小时</span>
                      {poi.price > 0 && <span>· ¥{poi.price}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveUp(index) }}
                      disabled={index === 0}
                      className="p-1 rounded text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveDown(index) }}
                      disabled={index === pois.length - 1}
                      className="p-1 rounded text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(poi.id, poi.name) }}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DayTimeline
