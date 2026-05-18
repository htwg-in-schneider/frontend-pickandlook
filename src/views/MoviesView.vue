<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <h2 class="mb-0">🎬 Filme &amp; Serien</h2>
      <RouterLink to="/movies/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>Neu
      </RouterLink>
    </div>

    <!-- Aufgabe b) + e): Suche und Filter -->
    <div class="card p-3 mb-4">
      <div class="row g-3">
        <!-- b) Suche nach Titel -->
        <div class="col-md-4">
          <label class="form-label">Titel suchen</label>
          <div class="input-group">
            <span class="input-group-text bg-dark border-secondary text-white">
              <i class="bi bi-search"></i>
            </span>
            <input v-model="filters.titel" @input="search" type="text"
                   class="form-control" placeholder="z.B. Inception…" />
          </div>
        </div>

        <!-- e) Filter: Typ -->
        <div class="col-md-2">
          <label class="form-label">Typ</label>
          <select v-model="filters.type" @change="search" class="form-select">
            <option value="">Alle</option>
            <option value="film">Film</option>
            <option value="serie">Serie</option>
          </select>
        </div>

        <!-- e) Filter: Genre (1:n) -->
        <div class="col-md-3">
          <label class="form-label">Genre</label>
          <select v-model="filters.genreId" @change="search" class="form-select">
            <option value="">Alle Genres</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>

        <!-- e) Filter: Mindest-Bewertung -->
        <div class="col-md-2">
          <label class="form-label">Min. Bewertung</label>
          <input v-model.number="filters.minRating" @input="search" type="number"
                 class="form-control" min="0" max="10" step="0.5" placeholder="0–10" />
        </div>

        <!-- Reset -->
        <div class="col-md-1 d-flex align-items-end">
          <button @click="resetFilters" class="btn btn-outline-light w-100" title="Filter zurücksetzen">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Ladezustand / Fehler -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-purple" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Ergebnis leer -->
    <div v-else-if="movies.length === 0" class="text-center py-5 text-secondary">
      <i class="bi bi-film fs-1 d-block mb-2"></i>
      Keine Filme gefunden.
    </div>

    <!-- Aufgabe a) – Film-Liste -->
    <div v-else class="row g-3">
      <div v-for="movie in movies" :key="movie.id" class="col-md-6 col-lg-4">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <RouterLink :to="`/movies/${movie.id}`" class="text-decoration-none text-white">
              <h5 class="mb-0" style="cursor:pointer;">{{ movie.titel }}</h5>
            </RouterLink>
            <span class="badge" :class="movie.type === 'film' ? 'badge-purple' : 'badge-cyan'">
              {{ movie.type }}
            </span>
          </div>

          <p class="text-secondary small mb-1">{{ movie.releaseYear }}</p>

          <p v-if="movie.description" class="text-secondary small mb-2" style="font-size:.85rem;">
            {{ movie.description }}
          </p>

          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-star-fill text-warning"></i>
            <span class="fw-bold">{{ movie.avgRating }}</span>
            <span v-if="movie.genre" class="badge badge-gray ms-auto">
              {{ movie.genre.name }}
            </span>
          </div>

          <!-- Aufgabe a) – Edit / Delete -->
          <div class="d-flex gap-2 mt-auto">
            <RouterLink :to="`/movies/${movie.id}/edit`" class="btn btn-sm btn-outline-light flex-fill">
              <i class="bi bi-pencil me-1"></i>Bearbeiten
            </RouterLink>
            <button @click="confirmDelete(movie)" class="btn btn-sm btn-outline-danger flex-fill">
              <i class="bi bi-trash me-1"></i>Löschen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Löschen-Bestätigung Modal -->
    <div v-if="toDelete" class="modal-backdrop-custom" @click.self="toDelete = null">
      <div class="modal-box">
        <h5>Film löschen?</h5>
        <p class="text-secondary">„{{ toDelete.titel }}" wird unwiderruflich gelöscht.</p>
        <div class="d-flex gap-2 justify-content-end mt-3">
          <button @click="toDelete = null" class="btn btn-outline-light">Abbrechen</button>
          <button @click="doDelete" class="btn btn-danger">Löschen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMovies, deleteMovie, getGenres } from '../services/api.js'

const movies  = ref([])
const genres  = ref([])
const loading = ref(false)
const error   = ref(null)
const toDelete = ref(null)

const filters = ref({ titel: '', type: '', genreId: '', minRating: '' })

async function search() {
  loading.value = true
  error.value   = null
  try {
    const params = {}
    if (filters.value.titel)     params.titel     = filters.value.titel
    if (filters.value.type)      params.type      = filters.value.type
    if (filters.value.genreId)   params.genreId   = filters.value.genreId
    if (filters.value.minRating !== '') params.minRating = filters.value.minRating
    const res = await getMovies(params)
    movies.value = res.data
  } catch (e) {
    error.value = 'Fehler beim Laden: ' + (e.response?.data?.message || e.message)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = { titel: '', type: '', genreId: '', minRating: '' }
  search()
}

function confirmDelete(movie) { toDelete.value = movie }

async function doDelete() {
  try {
    await deleteMovie(toDelete.value.id)
    toDelete.value = null
    search()
  } catch (e) {
    error.value = 'Fehler beim Löschen: ' + (e.response?.data?.message || e.message)
    toDelete.value = null
  }
}

onMounted(async () => {
  const [, genreRes] = await Promise.all([search(), getGenres()])
  genres.value = genreRes.data
})
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #1A1A2E;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
}
.spinner-border.text-purple { color: #7C3AED !important; }
</style>
