<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">

      <!-- Zurück Button -->
      <div class="mb-4">
        <RouterLink to="/movies" class="btn btn-outline-light btn-sm">
          <i class="bi bi-arrow-left me-1"></i>Zurück zur Liste
        </RouterLink>
      </div>

      <!-- Ladezustand -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" style="color:#7C3AED"></div>
      </div>

      <!-- Fehler -->
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <!-- Film Detail -->
      <div v-else-if="movie" class="card p-4">

        <!-- Header: Titel + Badge -->
        <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
          <h2 class="mb-0">{{ movie.titel }}</h2>
          <span class="badge fs-6" :class="movie.type === 'film' ? 'badge-purple' : 'badge-cyan'">
            {{ movie.type === 'film' ? '🎬 Film' : '📺 Serie' }}
          </span>
        </div>

        <!-- Genre + Jahr + Bewertung -->
        <div class="d-flex flex-wrap gap-3 mb-4">
          <div v-if="movie.genre" class="d-flex align-items-center gap-2">
            <i class="bi bi-tag text-purple-lt"></i>
            <span class="badge badge-gray fs-6">{{ movie.genre.name }}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-calendar3" style="color:#A855F7"></i>
            <span>{{ movie.releaseYear }}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-star-fill text-warning"></i>
            <span class="fw-bold fs-5">{{ movie.avgRating }}</span>
            <span class="text-secondary">/ 10</span>
          </div>
        </div>

        <!-- Trennlinie -->
        <hr style="border-color: rgba(255,255,255,0.1)">

        <!-- Beschreibung -->
        <div class="mb-4">
          <h5 class="text-secondary mb-2">Beschreibung</h5>
          <p v-if="movie.description" style="font-size:1.05rem; line-height:1.7;">
            {{ movie.description }}
          </p>
          <p v-else class="text-secondary fst-italic">Keine Beschreibung vorhanden.</p>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-3 mt-2">
          <RouterLink :to="`/movies/${movie.id}/edit`" class="btn btn-primary px-4">
            <i class="bi bi-pencil me-1"></i>Bearbeiten
          </RouterLink>
          <RouterLink to="/movies" class="btn btn-outline-light">
            Zurück
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovie } from '../services/api.js'

const route   = useRoute()
const movie   = ref(null)
const loading = ref(true)
const error   = ref(null)

onMounted(async () => {
  try {
    const res = await getMovie(route.params.id)
    movie.value = res.data
  } catch (e) {
    error.value = 'Film nicht gefunden.'
  } finally {
    loading.value = false
  }
})
</script>
