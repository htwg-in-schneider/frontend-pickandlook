<template>
  <div class="row justify-content-center">
    <div class="col-lg-7">
      <div class="d-flex align-items-center gap-3 mb-4">
        <RouterLink to="/movies" class="btn btn-outline-light btn-sm">
          <i class="bi bi-arrow-left"></i>
        </RouterLink>
        <h3 class="mb-0">{{ isEdit ? 'Film bearbeiten' : 'Neuen Film anlegen' }}</h3>
      </div>

      <div v-if="error"   class="alert alert-danger mb-3">{{ error }}</div>
      <div v-if="success" class="alert alert-success mb-3">{{ success }}</div>

      <div class="card p-4">
        <form @submit.prevent="submit">

          <!-- Titel -->
          <div class="mb-3">
            <label class="form-label">Titel *</label>
            <input v-model="form.titel" type="text" class="form-control"
                   placeholder="z.B. Inception" required />
          </div>

          <!-- Beschreibung -->
          <div class="mb-3">
            <label class="form-label">Beschreibung</label>
            <textarea v-model="form.description" class="form-control" rows="3"
                      placeholder="Kurze Zusammenfassung…"></textarea>
          </div>

          <div class="row g-3 mb-3">
            <!-- Erscheinungsjahr -->
            <div class="col-sm-4">
              <label class="form-label">Erscheinungsjahr *</label>
              <input v-model.number="form.releaseYear" type="number" class="form-control"
                     min="1888" max="2100" required />
            </div>

            <!-- Bewertung -->
            <div class="col-sm-4">
              <label class="form-label">Bewertung (0–10)</label>
              <input v-model.number="form.avgRating" type="number" class="form-control"
                     min="0" max="10" step="0.1" />
            </div>

            <!-- Typ -->
            <div class="col-sm-4">
              <label class="form-label">Typ *</label>
              <select v-model="form.type" class="form-select" required>
                <option value="">Bitte wählen</option>
                <option value="film">Film</option>
                <option value="serie">Serie</option>
              </select>
            </div>
          </div>

          <!-- Aufgabe d) 1:n – Genre-Dropdown -->
          <div class="mb-4">
            <label class="form-label">Genre</label>
            <select v-model="form.genreId" class="form-select">
              <option value="">Kein Genre</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
            <div class="form-text text-secondary">
              Genre noch nicht vorhanden?
              <RouterLink to="/genres/new" class="text-decoration-none" style="color:#A855F7;">
                Genre anlegen
              </RouterLink>
            </div>
          </div>

          <div class="d-flex gap-3">
            <button type="submit" class="btn btn-primary px-4" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Speichern' : 'Anlegen' }}
            </button>
            <RouterLink to="/movies" class="btn btn-outline-light">Abbrechen</RouterLink>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovie, createMovie, updateMovie, getGenres } from '../services/api.js'

const route  = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const error  = ref(null)
const success = ref(null)
const genres = ref([])

const form = ref({
  titel: '',
  description: '',
  releaseYear: new Date().getFullYear(),
  avgRating: 0,
  type: '',
  genreId: ''
})

onMounted(async () => {
  const genreRes = await getGenres()
  genres.value = genreRes.data

  if (isEdit.value) {
    const res = await getMovie(route.params.id)
    const m = res.data
    form.value = {
      titel:       m.titel,
      description: m.description || '',
      releaseYear: m.releaseYear,
      avgRating:   m.avgRating,
      type:        m.type,
      genreId:     m.genre?.id || ''
    }
  }
})

async function submit() {
  saving.value = true
  error.value  = null
  success.value = null
  try {
    const payload = { ...form.value }
    if (!payload.genreId) delete payload.genreId

    if (isEdit.value) {
      await updateMovie(route.params.id, payload)
      success.value = 'Film erfolgreich gespeichert!'
    } else {
      await createMovie(payload)
      success.value = 'Film erfolgreich angelegt!'
    }
    setTimeout(() => router.push('/movies'), 1000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Fehler beim Speichern.'
  } finally {
    saving.value = false
  }
}
</script>
