import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Wallet, Plus, Share2, Download, Settings, ChevronRight, Sparkles, Camera } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import DayTimeline from '../components/trip/DayTimeline'
import BudgetOverview from '../components/common/BudgetOverview'
import { useTripStore, useUIStore } from '../store'

const TripDetail = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { getTripById, getAllPOIs, addDay, removeDay } = useTripStore()
  const { showToast } = useUIStore()
  
  const trip = getTripById(tripId)
  const allPOIs = getAllPOIs()
  const [activeDay, setActiveDay] = useState(0)
  const [showBudget, setShowBudget] = useState(false)

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">行程不存在</p>
          <button onClick={() => navigate('/app/home')} className="mt-4 text-indigo-500">
            返回首页
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: '总天数', value: `${trip.days}天${trip.days - 1}夜`, icon: Calendar },
    { label: '景点数', value: allPOIs.length, icon: MapPin },
    { label: '总预算', value: `¥${trip.budget || 0}`, icon: Wallet },
  ]

  const handleAddDay = () => {
    if (trip.days >= 30) {
      showToast('最多30天', 'warning')
      return
    }
    addDay()
    showToast('已添加一天', 'success')
  }

  const handleRemoveDay = () => {
    if (trip.days <= 1) {
      showToast('至少保留1天', 'warning')
      return
    }
    if (confirm('确定要删除最后一天吗？')) {
      removeDay()
      showToast('已删除', 'success')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={20} className="text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Settings size={20} className="text-white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold mb-1">{trip.name}</h1>
          <p className="text-sm text-white/80">{trip.city} · {trip.days}天{trip.days - 1}夜</p>
        </div>
      </div>
      <div className="px-4 -mt-8">
        <GlassCard className="p-4">
          <div className="flex justify-around">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon size={20} className="text-indigo-500" />
                  </div>
                  <p className="font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">行程安排</h2>
          <div className="flex gap-2">
            <button onClick={handleRemoveDay} className="px-3 py-1.5 text-sm text-gray-500 bg-white rounded-full border border-gray-200">
              - 减少
            </button>
            <button onClick={handleAddDay} className="px-3 py-1.5 text-sm text-indigo-500 bg-indigo-50 rounded-full">
              + 添加
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {trip.daysPlan?.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeDay === i
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              第{i + 1}天
            </button>
          ))}
        </div>
        <DayTimeline dayIndex={activeDay} pois={trip.daysPlan?.[activeDay]?.pois || []} />
        <button
          onClick={() => navigate('/app/search')}
          className="w-full mt-4 py-3 border-2 border-dashed border-indigo-300 rounded-2xl text-indigo-500 font-medium flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
        >
          <Plus size={20} />
          添加景点
        </button>
      </div>
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowBudget(!showBudget)}
          className="w-full flex items-center justify-between"
        >
          <h2 className="font-bold text-gray-800">预算概览</h2>
          <ChevronRight size={20} className={`text-gray-400 transition-transform ${showBudget ? 'rotate-90' : ''}`} />
        </button>
        {showBudget && (
          <div className="mt-3">
            <BudgetOverview tripId={tripId} />
          </div>
        )}
      </div>
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/app/ai')}
            className="flex-1 py-3 bg-white rounded-2xl text-indigo-500 font-semibold shadow-lg border border-indigo-100 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            AI优化
          </button>
          <button
            onClick={() => navigate(`/app/budget`)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Wallet size={20} />
            预算管理
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripDetail
