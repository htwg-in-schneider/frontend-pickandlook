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

        <!-- UC7: Sternebewertung (1-5 Sterne, nur für eingeloggte User) -->
        <div v-if="isAuthenticated" class="mt-4">
          <hr style="border-color: rgba(255,255,255,0.1)">
          <h5 class="mb-3">Deine Bewertung</h5>

          <div class="d-flex align-items-center gap-2 mb-3">
            <button v-for="n in 5" :key="n"
                    @click="setRating(n)"
                    @mouseover="hoverRating = n"
                    @mouseleave="hoverRating = 0"
                    class="star-btn"
                    :title="`${n} Stern${n > 1 ? 'e' : ''}`">
              <i :class="['bi', (hoverRating || myRating) >= n ? 'bi-star-fill' : 'bi-star']"
                 :style="{ color: (hoverRating || myRating) >= n ? '#EAB308' : '#555' }"
                 style="font-size: 1.8rem;"></i>
            </button>
            <span v-if="myRating" class="ms-2 text-muted small">
              Du hast {{ myRating }} {{ myRating === 1 ? 'Stern' : 'Sterne' }} vergeben
            </span>
          </div>

          <div v-if="ratingSuccess" class="alert alert-success py-2 small">
            <i class="bi bi-check-circle me-1"></i>Bewertung gespeichert!
          </div>
          <div v-if="ratingError" class="alert alert-danger py-2 small">
            <i class="bi bi-exclamation-triangle me-1"></i>{{ ratingError }}
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-3 mt-3">
          <RouterLink v-if="isAdmin" :to="`/movies/${movie.id}/edit`" class="btn btn-primary px-4">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { getMovie, getMyRating, submitRating } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()
const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})

const route        = useRoute()
const movie        = ref(null)
const loading      = ref(true)
const error        = ref(null)

const myRating     = ref(0)
const hoverRating  = ref(0)
const ratingSuccess = ref(false)
const ratingError   = ref(null)

onMounted(async () => {
  try {
    const res = await getMovie(route.params.id)
    movie.value = res.data
  } catch (e) {
    error.value = 'Film nicht gefunden.'
  } finally {
    loading.value = false
  }

  if (isAuthenticated.value && user.value) {
    try {
      const res = await getMyRating(route.params.id, user.value.sub)
      if (res.status === 200) myRating.value = res.data.stars
    } catch { /* keine Bewertung vorhanden */ }
  }
})

async function setRating(stars) {
  ratingSuccess.value = false
  ratingError.value   = null
  try {
    await submitRating(user.value.sub, movie.value.id, stars)
    myRating.value      = stars
    ratingSuccess.value = true
    setTimeout(() => { ratingSuccess.value = false }, 3000)
  } catch (e) {
    ratingError.value = 'Fehler beim Speichern der Bewertung.'
  }
}
</script>

<style scoped>
.star-btn {
  background: none;
  border: none;
  padding: 0 2px;
  cursor: pointer;
  transition: transform 0.1s;
}
.star-btn:hover { transform: scale(1.2); }
</style>
