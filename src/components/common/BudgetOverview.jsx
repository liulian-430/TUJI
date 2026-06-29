import { Wallet, PieChart } from 'lucide-react'
import GlassCard from './GlassCard'

const categoryLabels = {
  transportation: { name: '交通', color: '#6366f1' },
  accommodation: { name: '住宿', color: '#8b5cf6' },
  food: { name: '餐饮', color: '#ec4899' },
  attraction: { name: '景点', color: '#10b981' },
  shopping: { name: '购物', color: '#f59e0b' },
  other: { name: '其他', color: '#94a3b8' },
}

const BudgetOverview = ({ stats, onViewDetail }) => {
  const categoryList = Object.entries(stats.categories)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总预算</p>
              <p className="text-2xl font-bold text-gray-800">¥{stats.total.toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onViewDetail} className="text-sm text-indigo-500 font-medium">
            查看详情
          </button>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">已花费</span>
            <span className="font-semibold text-gray-700">
              ¥{stats.totalSpent.toLocaleString()}
              <span className="text-gray-400 ml-1">({stats.percentage}%)</span>
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(stats.percentage, 100)}%`,
                background: stats.percentage > 90
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : stats.percentage > 70
                  ? 'linear-gradient(90deg, #f59e0b, #8b5cf6)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">剩余</span>
            <span className={`font-semibold ${stats.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ¥{stats.remaining.toLocaleString()}
            </span>
          </div>
        </div>
      </GlassCard>
      {categoryList.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">分类统计</h3>
          </div>
          <div className="space-y-3">
            {categoryList.map(([key, amount]) => {
              const info = categoryLabels[key]
              const percentage = stats.totalSpent > 0 
                ? Math.round((amount / stats.totalSpent) * 100) 
                : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{info.name}</span>
                    <span className="font-medium text-gray-700">¥{amount}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: info.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

export default BudgetOverview
