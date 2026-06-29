import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Wallet, TrendingUp, TrendingDown, CircleDollarSign, Bus, Hotel, UtensilsCrossed, Ticket, ShoppingBag, Heart, Edit2, Trash2, X } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import BudgetOverview from '../components/common/BudgetOverview'
import ExpenseList from '../components/common/ExpenseList'
import Button from '../components/common/Button'
import { useTripStore, useUIStore } from '../store'

const Budget = () => {
  const navigate = useNavigate()
  const { currentTrip, setBudget, addExpense, updateExpense, deleteExpense } = useTripStore()
  const { showToast } = useUIStore()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [newBudget, setNewBudget] = useState(currentTrip?.budget || 0)
  
  const [form, setForm] = useState({
    category: 'food',
    amount: '',
    description: '',
    day: 0,
  })

  const categories = [
    { id: 'transportation', label: '交通', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'accommodation', label: '住宿', icon: Hotel, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'food', label: '餐饮', icon: UtensilsCrossed, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'attraction', label: '景点', icon: Ticket, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'shopping', label: '购物', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'other', label: '其他', icon: Heart, color: 'text-gray-500', bg: 'bg-gray-50' },
  ]

  const handleSubmit = () => {
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) {
      showToast('请输入有效金额', 'warning')
      return
    }
    if (!form.description.trim()) {
      showToast('请输入描述', 'warning')
      return
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        category: form.category,
        amount,
        description: form.description,
        day: form.day,
      })
      showToast('已更新', 'success')
    } else {
      addExpense({
        category: form.category,
        amount,
        description: form.description,
        day: form.day,
      })
      showToast('已添加', 'success')
    }

    setShowAddModal(false)
    setEditingExpense(null)
    setForm({ category: 'food', amount: '', description: '', day: 0 })
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setForm({
      category: expense.category,
      amount: String(expense.amount),
      description: expense.description,
      day: expense.day,
    })
    setShowAddModal(true)
  }

  const handleDelete = (expenseId) => {
    if (confirm('确定要删除这笔花费吗？')) {
      deleteExpense(expenseId)
      showToast('已删除', 'success')
    }
  }

  const handleBudgetSave = () => {
    const budget = parseFloat(newBudget)
    if (budget < 0) {
      showToast('预算不能为负数', 'warning')
      return
    }
    setBudget(budget)
    setShowBudgetEdit(false)
    showToast('预算已更新', 'success')
  }

  const openAddModal = () => {
    setEditingExpense(null)
    setForm({ category: 'food', amount: '', description: '', day: 0 })
    setShowAddModal(true)
  }

  const currentCategory = categories.find(c => c.id === form.category)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">预算管理</h1>
          <button onClick={() => setShowBudgetEdit(true)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Edit2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="px-4 py-6 pb-24">
        <BudgetOverview />
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">分类预算</h2>
          </div>
          <GlassCard className="p-4">
            <div className="space-y-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                const spent = currentTrip?.expenses?.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0) || 0
                const total = currentTrip?.budget || 0
                const percentage = total > 0 ? Math.min((spent / (total / 6)) * 100, 100) : 0
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                          <Icon size={18} className={cat.color} />
                        </div>
                        <span className="text-gray-700">{cat.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">¥{spent}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${cat.bg.replace('50', '500')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">花费明细</h2>
            <button
              onClick={openAddModal}
              className="text-sm text-indigo-500 flex items-center gap-1"
            >
              <Plus size={16} />添加
            </button>
          </div>
          <ExpenseList
            expenses={currentTrip?.expenses || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {editingExpense ? '编辑花费' : '添加花费'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setEditingExpense(null) }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">选择分类</label>
                <div className="grid grid-cols-6 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setForm({ ...form, category: cat.id })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                          form.category === cat.id
                            ? `${cat.bg} ring-2 ring-offset-1`
                            : 'bg-gray-50'
                        }`}
                        style={{
                          ringColor: form.category === cat.id ? cat.color : undefined
                        }}
                      >
                        <Icon size={20} className={cat.color} />
                        <span className="text-xs text-gray-600">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">金额</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">¥</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">描述</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="例如：午餐、门票等"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">日期</label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {[...Array(currentTrip?.days || 1)].map((_, i) => (
                    <option key={i} value={i}>第 {i + 1} 天</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setEditingExpense(null) }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl"
              >
                取消
              </button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="flex-1"
              >
                {editingExpense ? '保存' : '添加'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showBudgetEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">设置总预算</h3>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">¥</span>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetEdit(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl"
              >
                取消
              </button>
              <Button
                variant="primary"
                onClick={handleBudgetSave}
                className="flex-1"
              >
                确认
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={openAddModal}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          记一笔
        </button>
      </div>
    </div>
  )
}

export default Budget
