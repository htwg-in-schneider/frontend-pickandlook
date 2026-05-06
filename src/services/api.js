import axios from 'axios'

// Backend URL – für Produktion auf render.com-URL ändern
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
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
