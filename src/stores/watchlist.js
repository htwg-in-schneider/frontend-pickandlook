import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref([])       // Liste der Filme
  const ids   = ref(new Set()) // Set mit Movie-IDs für schnellen Check

  async function load(sub) {
    if (!sub) return
    const res = await axios.get(`${API}/api/watchlist`, { params: { sub } })
    items.value = res.data
    ids.value = new Set(res.data.map(m => m.id))
  }

  async function add(sub, movieId) {
    await axios.post(`${API}/api/watchlist`, { movieId }, { params: { sub } })
    await load(sub)
  }

  async function remove(sub, movieId) {
    await axios.delete(`${API}/api/watchlist/${movieId}`, { params: { sub } })
    ids.value.delete(movieId)
    items.value = items.value.filter(m => m.id !== movieId)
  }

  function isInWatchlist(movieId) {
    return ids.value.has(movieId)
  }

  return { items, ids, load, add, remove, isInWatchlist }
})
