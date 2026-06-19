import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api.js'

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref([])        // [{movie, status}, ...]
  const ids   = ref(new Set()) // Set mit Movie-IDs für schnellen Check

  async function load(sub) {
    if (!sub) return
    const res = await getWatchlist(sub)
    items.value = res.data
    ids.value = new Set(res.data.map(item => item.movie.id))
  }

  async function add(sub, movieId) {
    await addToWatchlist(sub, movieId)
    await load(sub)
  }

  async function remove(sub, movieId) {
    await removeFromWatchlist(sub, movieId)
    ids.value.delete(movieId)
    items.value = items.value.filter(item => item.movie.id !== movieId)
  }

  function isInWatchlist(movieId) {
    return ids.value.has(movieId)
  }

  return { items, ids, load, add, remove, isInWatchlist }
})
