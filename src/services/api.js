import axios from 'axios'

// Backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Token-Funktion – wird von main.js gesetzt
let getToken = null
export function setTokenGetter(fn) {
  getToken = fn
}

// Interceptor – fügt JWT Token zu jeder Anfrage hinzu
api.interceptors.request.use(async (config) => {
  if (getToken) {
    try {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // Kein Token vorhanden (nicht eingeloggt) – weiter ohne Token
    }
  }
  return config
})

// ── Movies ──────────────────────────────────────────
export function getMovies(params = {}) {
  return api.get('/api/movies', { params })
}

export function getMovie(id) {
  return api.get(`/api/movies/${id}`)
}

export function createMovie(data) {
  return api.post('/api/movies', data)
}

export function updateMovie(id, data) {
  return api.put(`/api/movies/${id}`, data)
}

export function deleteMovie(id) {
  return api.delete(`/api/movies/${id}`)
}

// ── Genres ──────────────────────────────────────────
export function getGenres() {
  return api.get('/api/genres')
}

export function getGenre(id) {
  return api.get(`/api/genres/${id}`)
}

export function createGenre(data) {
  return api.post('/api/genres', data)
}

export function updateGenre(id, data) {
  return api.put(`/api/genres/${id}`, data)
}

export function deleteGenre(id) {
  return api.delete(`/api/genres/${id}`)
}

// ── Watchlist ────────────────────────────────────────
export function getWatchlist(sub) {
  return api.get('/api/watchlist', { params: { sub } })
}

export function addToWatchlist(sub, movieId) {
  return api.post('/api/watchlist', { movieId }, { params: { sub } })
}

export function removeFromWatchlist(sub, movieId) {
  return api.delete(`/api/watchlist/${movieId}`, { params: { sub } })
}

export function getWatchlistAdmin() {
  return api.get('/api/watchlist/admin/all')
}

// ── Ratings ──────────────────────────────────────────
export function getMyRating(movieId, sub) {
  return api.get(`/api/ratings/${movieId}`, { params: { sub } })
}

export function submitRating(sub, movieId, stars) {
  return api.post('/api/ratings', { movieId, stars }, { params: { sub } })
}

// ── User Profile ─────────────────────────────────────
export function getUserProfile(sub, email = '') {
  return api.get('/api/users/me', { params: { sub, email } })
}

export function updateUserProfile(sub, data) {
  return api.put('/api/users/me', data, { params: { sub } })
}

export function getAllUsers() {
  return api.get('/api/users/all')
}

export function updateUserByAdmin(sub, data) {
  return api.put(`/api/users/${sub}/edit`, data)
}
