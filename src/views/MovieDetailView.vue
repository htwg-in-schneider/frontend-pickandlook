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
            <span class="text-secondary small">(Community)</span>
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

        <!-- Pick/Look Buttons (nur für eingeloggte User) -->
        <div v-if="isAuthenticated" class="mb-3">
          <hr style="border-color: rgba(255,255,255,0.1)">

          <!-- Noch nicht in der Liste -->
          <div v-if="!watchlistStatus" class="d-flex gap-2">
            <button @click="addPick" class="btn btn-pick">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" class="me-2">
                <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
              </svg>
              Als Pick merken
            </button>
            <button @click="addLook" class="btn btn-look-add">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" class="me-2">
                <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
              </svg>
              Als Look markieren
            </button>
          </div>

          <!-- Ist ein Pick -->
          <div v-else-if="watchlistStatus === 'pick'" class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
              </svg>
              <span style="color:#A855F7;" class="fw-semibold">In deinen Picks</span>
            </div>
            <button @click="markAsLook" class="btn btn-look-add btn-sm">
              <svg width="14" height="14" viewBox="0 0 40 40" fill="none" class="me-1">
                <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
              </svg>
              Gesehen? → Look
            </button>
            <button @click="removeFromList" class="btn btn-outline-danger btn-sm">Entfernen</button>
          </div>

          <!-- Ist ein Look -->
          <div v-else-if="watchlistStatus === 'look'" class="d-flex align-items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
              <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
            </svg>
            <span style="color:#22D3EE;" class="fw-semibold">In deinen Looks</span>
            <button @click="removeFromList" class="btn btn-outline-danger btn-sm ms-2">Entfernen</button>
          </div>
        </div>

        <!-- Bewertung: NUR wenn der Film ein Look ist -->
        <div v-if="isAuthenticated && watchlistStatus === 'look'" class="mt-2">
          <hr style="border-color: rgba(255,255,255,0.1)">
          <h5 class="mb-3">Deine Bewertung</h5>

          <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <button v-for="n in 10" :key="n"
                    @click="setRating(n)"
                    @mouseover="hoverRating = n"
                    @mouseleave="hoverRating = 0"
                    class="star-btn"
                    :title="`${n}/10`">
              <i :class="['bi', (hoverRating || myRating) >= n ? 'bi-star-fill' : 'bi-star']"
                 :style="{ color: (hoverRating || myRating) >= n ? '#EAB308' : '#555' }"
                 style="font-size: 1.5rem;"></i>
            </button>
            <span v-if="myRating" class="ms-2 text-muted small">
              Du hast {{ myRating }}/10 vergeben
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
        <div class="d-flex gap-3 mt-4">
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
import { getMovie, getMyRating, submitRating, getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStatus } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()
const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})

const route         = useRoute()
const movie         = ref(null)
const loading       = ref(true)
const error         = ref(null)
const watchlistStatus = ref(null) // null | 'pick' | 'look'

const myRating      = ref(0)
const hoverRating   = ref(0)
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
    // Watchlist-Status laden
    try {
      const res = await getWatchlist(user.value.sub)
      const found = res.data.find(i => i.movie.id === movie.value?.id)
      watchlistStatus.value = found ? found.status : null
    } catch { /* ignorieren */ }

    // Eigene Bewertung laden
    try {
      const res = await getMyRating(route.params.id, user.value.sub)
      if (res.status === 200) myRating.value = res.data.stars
    } catch { /* keine Bewertung vorhanden */ }
  }
})

async function addPick() {
  await addToWatchlist(user.value.sub, movie.value.id)
  watchlistStatus.value = 'pick'
}

async function addLook() {
  await addToWatchlist(user.value.sub, movie.value.id)
  await updateWatchlistStatus(user.value.sub, movie.value.id, 'look')
  watchlistStatus.value = 'look'
}

async function markAsLook() {
  await updateWatchlistStatus(user.value.sub, movie.value.id, 'look')
  watchlistStatus.value = 'look'
}

async function removeFromList() {
  await removeFromWatchlist(user.value.sub, movie.value.id)
  watchlistStatus.value = null
}

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

.btn-pick {
  background: rgba(124,58,237,0.15);
  border: 1px solid #7C3AED;
  color: #A855F7;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 6px 14px;
}
.btn-pick:hover {
  background: rgba(124,58,237,0.3);
  color: #A855F7;
}
.btn-look-add {
  background: rgba(34,211,238,0.1);
  border: 1px solid #22D3EE;
  color: #22D3EE;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 6px 14px;
}
.btn-look-add:hover {
  background: rgba(34,211,238,0.2);
  color: #22D3EE;
}
</style>
