import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const createEmptyDay = () => ({
  pois: [],
})

export const useTripStore = create(
  persist(
    (set, get) => ({
      trips: [],
      currentTripId: null,
      currentTrip: null,
      historyTrips: [],
      favoritePOIs: [],
      budget: {
        total: 0,
        categories: {
          transportation: 0,
          accommodation: 0,
          food: 0,
          attraction: 0,
          shopping: 0,
          other: 0,
        },
        expenses: [],
      },

      initTrip: () => {
        const { trips, currentTripId } = get()
        if (trips.length > 0 && currentTripId) {
          const current = trips.find(t => t.id === currentTripId)
          if (current) {
            set({ currentTrip: current })
            return
          }
        }
        const newTrip = get().createTrip({
          name: '我的行程',
          city: '成都',
          days: 3,
        })
        set({ currentTrip: newTrip })
      },

      createTrip: ({ name, city, days = 3, budget = 3000 }) => {
        const newTrip = {
          id: uuidv4(),
          name,
          city,
          days,
          budget,
          daysPlan: Array.from({ length: days }, () => createEmptyDay()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        }
        
        set((state) => ({
          trips: [...state.trips, newTrip],
          currentTripId: newTrip.id,
          currentTrip: newTrip,
        }))
        
        return newTrip
      },

      updateTrip: (tripId, updates) => {
        set((state) => {
          const trips = state.trips.map(t => 
            t.id === tripId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          )
          const currentTrip = state.currentTripId === tripId 
            ? trips.find(t => t.id === tripId) 
            : state.currentTrip
          return { trips, currentTrip }
        })
      },

      deleteTrip: (tripId) => {
        set((state) => {
          const trips = state.trips.filter(t => t.id !== tripId)
          const currentTripId = state.currentTripId === tripId 
            ? (trips.length > 0 ? trips[0].id : null)
            : state.currentTripId
          const currentTrip = currentTripId ? trips.find(t => t.id === currentTripId) : null
          return { trips, currentTripId, currentTrip }
        })
      },

      setCurrentTrip: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId)
        if (trip) {
          set({ currentTripId: tripId, currentTrip: trip })
        }
      },

      addPOI: (poi, dayIndex) => {
        const { currentTripId, trips } = get()
        if (!currentTripId) return false

        const trip = trips.find(t => t.id === currentTripId)
        if (!trip) return false

        const exists = trip.daysPlan.some(day => 
          day.pois.some(p => p.id === poi.id)
        )
        if (exists) return false

        const updatedTrips = trips.map(t => {
          if (t.id !== currentTripId) return t
          const newDaysPlan = [...t.daysPlan]
          if (newDaysPlan[dayIndex]) {
            newDaysPlan[dayIndex] = {
              ...newDaysPlan[dayIndex],
              pois: [...newDaysPlan[dayIndex].pois, { ...poi, addedAt: new Date().toISOString() }],
            }
          }
          return {
            ...t,
            daysPlan: newDaysPlan,
            updatedAt: new Date().toISOString(),
          }
        })

        const updatedTrip = updatedTrips.find(t => t.id === currentTripId)
        set({ trips: updatedTrips, currentTrip: updatedTrip })
        return true
      },

      removePOI: (poiId, dayIndex) => {
        const { currentTripId, trips } = get()
        if (!currentTripId) return

        const updatedTrips = trips.map(t => {
          if (t.id !== currentTripId) return t
          const newDaysPlan = [...t.daysPlan]
          if (newDaysPlan[dayIndex]) {
            newDaysPlan[dayIndex] = {
              ...newDaysPlan[dayIndex],
              pois: newDaysPlan[dayIndex].pois.filter(p => p.id !== poiId),
            }
          }
          return {
            ...t,
            daysPlan: newDaysPlan,
            updatedAt: new Date().toISOString(),
          }
        })

        const updatedTrip = updatedTrips.find(t => t.id === currentTripId)
        set({ trips: updatedTrips, currentTrip: updatedTrip })
      },

      reorderPOIs: (dayIndex, fromIndex, toIndex) => {
        const { currentTripId, trips } = get()
        if (!currentTripId) return

        const updatedTrips = trips.map(t => {
          if (t.id !== currentTripId) return t
          const newDaysPlan = [...t.daysPlan]
          const pois = [...newDaysPlan[dayIndex].pois]
          const [removed] = pois.splice(fromIndex, 1)
          pois.splice(toIndex, 0, removed)
          
          newDaysPlan[dayIndex] = {
            ...newDaysPlan[dayIndex],
            pois,
          }

          return {
            ...t,
            daysPlan: newDaysPlan,
            updatedAt: new Date().toISOString(),
          }
        })

        const updatedTrip = updatedTrips.find(t => t.id === currentTripId)
        set({ trips: updatedTrips, currentTrip: updatedTrip })
      },

      getAllPOIs: () => {
        const { currentTrip } = get()
        if (!currentTrip) return []
        return currentTrip.daysPlan.flatMap(day => day.pois)
      },

      toggleFavoritePOI: (poiId) => {
        set((state) => {
          const has = state.favoritePOIs.includes(poiId)
          return {
            favoritePOIs: has
              ? state.favoritePOIs.filter(id => id !== poiId)
              : [...state.favoritePOIs, poiId],
          }
        })
      },

      setBudget: (total) => {
        set((state) => ({
          budget: { ...state.budget, total },
        }))
      },

      addExpense: (expense) => {
        const newExpense = {
          id: uuidv4(),
          ...expense,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          budget: {
            ...state.budget,
            expenses: [newExpense, ...state.budget.expenses],
          },
        }))
      },

      updateExpense: (expenseId, updates) => {
        set((state) => ({
          budget: {
            ...state.budget,
            expenses: state.budget.expenses.map(e => 
              e.id === expenseId ? { ...e, ...updates } : e
            ),
          },
        }))
      },

      deleteExpense: (expenseId) => {
        set((state) => ({
          budget: {
            ...state.budget,
            expenses: state.budget.expenses.filter(e => e.id !== expenseId),
          },
        }))
      },

      getBudgetStats: () => {
        const { budget } = get()
        const expenses = budget.expenses
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
        const remaining = budget.total - totalSpent

        const categories = {
          transportation: 0,
          accommodation: 0,
          food: 0,
          attraction: 0,
          shopping: 0,
          other: 0,
        }

        expenses.forEach(e => {
          if (categories[e.category] !== undefined) {
            categories[e.category] += e.amount
          }
        })

        return {
          total: budget.total,
          totalSpent,
          remaining,
          percentage: budget.total > 0 ? Math.round((totalSpent / budget.total) * 100) : 0,
          categories,
          expenseCount: expenses.length,
        }
      },
    }),
    {
      name: 'tuji-trip-storage',
      version: 1,
    }
  )
)
