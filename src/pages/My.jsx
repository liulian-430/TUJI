import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, Heart, MapPin, Calendar, Wallet, HelpCircle, ChevronRight, Star, Share2, Bell, Moon, Globe, Shield } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import { useUserStore, useTripStore } from '../store'

const MyPage = () => {
  const navigate = useNavigate()
  const { user, settings, updateSettings } = useUserStore()
  const { trips, historyTrips, favoritePOIs } = useTripStore()

  const menuGroups = [
    {
      title: '我的行程',
      items: [
        { icon: MapPin, label: '进行中', value: trips.length, action: () => {} },
        { icon: Calendar, label: '历史行程', value: historyTrips.length, action: () => {} },
        { icon: Heart, label: '我的收藏', value: favoritePOIs.length, action: () => {} },
        { icon: Wallet, label: '预算管理', value: '', action: () => navigate('/app/budget') },
      ],
    },
    {
      title: '设置',
      items: [
        { icon: Bell, label: '消息通知', value: '', action: () => {}, toggle: true, toggleKey: 'pushNotifications' },
        { icon: Moon, label: '深色模式', value: '', action: () => {}, toggle: true, toggleKey: 'darkMode' },
        { icon: Globe, label: '语言设置', value: '简体中文', action: () => {} },
      ],
    },
    {
      title: '其他',
      items: [
        { icon: Shield, label: '隐私与安全', value: '', action: () => {} },
        { icon: HelpCircle, label: '帮助与反馈', value: '', action: () => {} },
        { icon: Share2, label: '分享给好友', value: '', action: () => {} },
        { icon: Star, label: '给我们评分', value: '', action: () => {} },
      ],
    },
  ]

  const stats = [
    { label: '行程', value: trips.length + historyTrips.length },
    { label: '收藏', value: favoritePOIs.length },
    { label: '足迹', value: trips.length * 3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-white">
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-b-[2rem]">
        <div className="absolute top-12 right-4">
          <button onClick={() => {}} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </button>
        </div>
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
              <User size={32} className="text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              <p className="text-sm text-white/80">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-6">
        <GlassCard className="p-4">
          <div className="flex justify-around">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <div className="px-4 py-6 space-y-6 pb-24">
        {menuGroups.map((group, gi) => (
          <div key={gi}>
            <h3 className="text-sm font-medium text-gray-500 mb-2 ml-1">{group.title}</h3>
            <GlassCard className="overflow-hidden">
              {group.items.map((item, ii) => {
                const Icon = item.icon
                const isLast = ii === group.items.length - 1
                if (item.toggle) {
                  return (
                    <div
                      key={ii}
                      className={`flex items-center px-4 py-3.5 ${!isLast ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mr-3">
                        <Icon size={20} className="text-indigo-500" />
                      </div>
                      <span className="flex-1 text-gray-700">{item.label}</span>
                      <button
                        onClick={() => updateSettings({ [item.toggleKey]: !settings[item.toggleKey] })}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          settings[item.toggleKey] ? 'bg-indigo-500' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            settings[item.toggleKey] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                }
                return (
                  <button
                    key={ii}
                    onClick={item.action}
                    className={`w-full flex items-center px-4 py-3.5 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mr-3">
                      <Icon size={20} className="text-indigo-500" />
                    </div>
                    <span className="flex-1 text-left text-gray-700">{item.label}</span>
                    {item.value !== undefined && item.value !== '' && (
                      <span className="text-gray-400 mr-2">{item.value}</span>
                    )}
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                )
              })}
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyPage
