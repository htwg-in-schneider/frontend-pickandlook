<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🎭 Genres</h2>
      <RouterLink to="/genres/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>Neu
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color:#7C3AED"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="genres.length === 0" class="text-center py-5 text-secondary">
      Noch keine Genres vorhanden.
    </div>

    <!-- Aufgabe a) – Genre-Liste -->
    <div v-else class="row g-3">
      <div v-for="genre in genres" :key="genre.id" class="col-md-6 col-lg-4">
        <div class="card p-3">
          <h5 class="mb-1">{{ genre.name }}</h5>
          <p v-if="genre.description" class="text-secondary small mb-3">{{ genre.description }}</p>
          <div class="d-flex gap-2 mt-auto">
            <RouterLink :to="`/genres/${genre.id}/edit`" class="btn btn-sm btn-outline-light flex-fill">
              <i class="bi bi-pencil me-1"></i>Bearbeiten
            </RouterLink>
            <button @click="confirmDelete(genre)" class="btn btn-sm btn-outline-danger flex-fill">
              <i class="bi bi-trash me-1"></i>Löschen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Löschen Modal -->
    <div v-if="toDelete" class="modal-backdrop-custom" @click.self="toDelete = null">
      <div class="modal-box">
        <h5>Genre löschen?</h5>
        <p class="text-secondary">„{{ toDelete.name }}" wird gelöscht. Zugeordnete Filme behalten ihr Genre.</p>
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
import { getGenres, deleteGenre } from '../services/api.js'

const genres   = ref([])
const loading  = ref(true)
const error    = ref(null)
const toDelete = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await getGenres()
    genres.value = res.data
  } catch (e) {
    error.value = 'Fehler beim Laden: ' + (e.response?.data?.message || e.message)
  } finally {
    loading.value = false
  }
}

function confirmDelete(genre) { toDelete.value = genre }

async function doDelete() {
  try {
    await deleteGenre(toDelete.value.id)
    toDelete.value = null
    load()
  } catch (e) {
    error.value = 'Fehler beim Löschen: ' + (e.response?.data?.message || e.message)
    toDelete.value = null
  }
}

onMounted(load)
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
</style>
