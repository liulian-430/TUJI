import { Trash2, Edit2, Car, Hotel, UtensilsCrossed, Landmark, ShoppingBag, MoreHorizontal } from 'lucide-react'

const categoryConfig = {
  transportation: { name: '交通', icon: Car, color: 'bg-indigo-100 text-indigo-600' },
  accommodation: { name: '住宿', icon: Hotel, color: 'bg-purple-100 text-purple-600' },
  food: { name: '餐饮', icon: UtensilsCrossed, color: 'bg-pink-100 text-pink-600' },
  attraction: { name: '景点', icon: Landmark, color: 'bg-green-100 text-green-600' },
  shopping: { name: '购物', icon: ShoppingBag, color: 'bg-amber-100 text-amber-600' },
  other: { name: '其他', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600' },
}

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <MoreHorizontal className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500">还没有花费记录</p>
        <p className="text-sm text-gray-400 mt-1">点击下方按钮添加第一笔花费</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const config = categoryConfig[expense.category] || categoryConfig.other
        const Icon = config.icon
        return (
          <div
            key={expense.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-white/20 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 truncate">{expense.name}</h4>
                <span className="font-bold text-gray-800 ml-2">-¥{expense.amount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{config.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit?.(expense)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(expense.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ExpenseList
