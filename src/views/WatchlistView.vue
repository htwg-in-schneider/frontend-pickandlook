<template>
  <div>
    <h2 class="mb-4">Meine Picks &amp; Looks</h2>

    <div v-if="!isAuthenticated" class="alert alert-danger">
      <i class="bi bi-lock me-2"></i>Bitte logge dich ein.
    </div>

    <div v-else>
      <!-- Tabs -->
      <div class="d-flex gap-2 mb-4">
        <button @click="activeTab = 'pick'"
          class="tab-btn d-flex align-items-center gap-2"
          :class="activeTab === 'pick' ? 'tab-active-pick' : 'tab-inactive'">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
          </svg>
          <span>Meine Picks <span class="badge-count">{{ picks.length }}</span></span>
        </button>
        <button @click="activeTab = 'look'"
          class="tab-btn d-flex align-items-center gap-2"
          :class="activeTab === 'look' ? 'tab-active-look' : 'tab-inactive'">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
            <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
          </svg>
          <span>Meine Looks <span class="badge-count">{{ looks.length }}</span></span>
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-purple"></div>
      </div>

      <!-- Picks -->
      <div v-else-if="activeTab === 'pick'">
        <div v-if="picks.length === 0" class="text-center py-5">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
          </svg>
          <p class="text-muted mt-3">Noch keine Picks. Füge Filme hinzu die du schauen möchtest!</p>
          <RouterLink to="/movies" class="btn btn-primary mt-2">Filme entdecken</RouterLink>
        </div>
        <div v-else class="row g-3">
          <div v-for="item in picks" :key="item.movie.id" class="col-md-4 col-lg-3">
            <div class="card h-100 p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge" :class="item.movie.type === 'serie' ? 'badge-cyan' : 'badge-purple'">
                  {{ item.movie.type === 'serie' ? 'Serie' : 'Film' }}
                </span>
                <div class="d-flex gap-1">
                  <button @click="openRatingModal(item.movie)" class="btn btn-sm btn-look" title="Als Look markieren">
                    <svg width="14" height="14" viewBox="0 0 40 40" fill="none" style="margin-right:4px">
                      <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                      <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
                    </svg>Gesehen
                  </button>
                  <button @click="remove(item.movie.id)" class="btn btn-sm btn-outline-danger p-1">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <h6 class="fw-bold mb-1">{{ item.movie.titel }}</h6>
              <div class="text-muted small mb-2">{{ item.movie.releaseYear }}</div>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <span class="text-cyan fw-semibold">⭐ {{ item.movie.avgRating }}</span>
                <RouterLink :to="`/movies/${item.movie.id}`" class="btn btn-sm btn-outline-light">Details</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Looks -->
      <div v-else-if="activeTab === 'look'">
        <div v-if="looks.length === 0" class="text-center py-5">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
            <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
          </svg>
          <p class="text-muted mt-3">Noch keine Looks. Markiere Filme die du bereits geschaut hast!</p>
        </div>
        <div v-else class="row g-3">
          <div v-for="item in looks" :key="item.movie.id" class="col-md-4 col-lg-3">
            <div class="card h-100 p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge" :class="item.movie.type === 'serie' ? 'badge-cyan' : 'badge-purple'">
                  {{ item.movie.type === 'serie' ? 'Serie' : 'Film' }}
                </span>
                <button @click="remove(item.movie.id)" class="btn btn-sm btn-outline-danger p-1">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <h6 class="fw-bold mb-1">{{ item.movie.titel }}</h6>
              <div class="text-muted small mb-2">{{ item.movie.releaseYear }}</div>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted small">Community</span>
                  <span class="text-cyan fw-semibold">⭐ {{ item.movie.avgRating }}/10</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small">Deine Bewertung</span>
                  <span v-if="myRatings[item.movie.id]" class="text-warning fw-semibold">
                    ⭐ {{ myRatings[item.movie.id] }}/10
                  </span>
                  <button v-else @click="openRatingModal(item.movie)" class="btn btn-sm btn-outline-warning py-0 px-2" style="font-size:0.75rem;">
                    Jetzt bewerten
                  </button>
                </div>
                <RouterLink :to="`/movies/${item.movie.id}`" class="btn btn-sm btn-outline-light w-100">Details</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bewertungs-Modal -->
    <div v-if="showRatingModal" class="modal-backdrop-custom" @click.self="closeModal">
      <div class="modal-box text-center">
        <h5 class="mb-1">Wie bewertest du</h5>
        <p class="fw-bold fs-5 mb-3" style="color:#22D3EE;">{{ ratingMovie?.titel }}?</p>

        <div class="d-flex justify-content-center gap-1 mb-3 flex-wrap">
          <button v-for="n in 10" :key="n"
                  @click="modalRating = n"
                  @mouseover="hoverRating = n"
                  @mouseleave="hoverRating = 0"
                  class="star-btn">
            <i :class="['bi', (hoverRating || modalRating) >= n ? 'bi-star-fill' : 'bi-star']"
               :style="{ color: (hoverRating || modalRating) >= n ? '#EAB308' : '#555' }"
               style="font-size: 1.8rem;"></i>
          </button>
        </div>

        <p v-if="modalRating" class="text-muted mb-3">{{ modalRating }}/10</p>
        <p v-else class="text-muted mb-3">Wähle eine Bewertung</p>

        <div v-if="ratingError" class="alert alert-danger py-2 small mb-3">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ ratingError }}
        </div>
        <div v-if="ratingSuccess" class="alert alert-success py-2 small mb-3">
          <i class="bi bi-check-circle me-1"></i>Bewertung gespeichert!
        </div>

        <div class="d-flex gap-2 justify-content-center">
          <button @click="closeModal" class="btn btn-outline-light">Überspringen</button>
          <button @click="submitModalRating" :disabled="!modalRating" class="btn btn-warning px-4">
            <i class="bi bi-check-lg me-1"></i>Bewertung speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getWatchlist, removeFromWatchlist, updateWatchlistStatus, submitRating, getMyRating } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()
const activeTab = ref('pick')
const loading = ref(true)
const items = ref([])
const myRatings = ref({}) // movieId -> stars

const picks = computed(() => items.value.filter(i => i.status === 'pick'))
const looks = computed(() => items.value.filter(i => i.status === 'look'))

// Rating Modal
const showRatingModal = ref(false)
const ratingMovie     = ref(null)
const modalRating     = ref(0)
const hoverRating     = ref(0)
const ratingSuccess   = ref(false)
const ratingError     = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await getWatchlist(user.value.sub)
    items.value = res.data
    // Eigene Bewertungen für alle Looks laden
    const lookItems = res.data.filter(i => i.status === 'look')
    await Promise.all(lookItems.map(async i => {
      try {
        const r = await getMyRating(i.movie.id, user.value.sub)
        if (r.status === 200) myRatings.value[i.movie.id] = r.data.stars
      } catch { /* keine Bewertung */ }
    }))
  } finally {
    loading.value = false
  }
}

async function remove(movieId) {
  try { await removeFromWatchlist(user.value.sub, movieId) } catch { /* ignorieren */ }
  items.value = items.value.filter(i => i.movie.id !== movieId)
}

async function openRatingModal(movie) {
  // Status sofort auf look setzen
  try { await updateWatchlistStatus(user.value.sub, movie.id, 'look') } catch { /* ignorieren */ }
  const item = items.value.find(i => i.movie.id === movie.id)
  if (item) item.status = 'look'
  activeTab.value = 'look'

  // Modal öffnen
  ratingMovie.value  = movie
  modalRating.value  = 0
  hoverRating.value  = 0
  ratingSuccess.value = false
  ratingError.value  = null
  showRatingModal.value = true
}

function closeModal() {
  showRatingModal.value = false
  ratingMovie.value = null
}

async function submitModalRating() {
  if (!modalRating.value) return
  ratingError.value = null
  try {
    await submitRating(user.value.sub, ratingMovie.value.id, modalRating.value)
    myRatings.value[ratingMovie.value.id] = modalRating.value
    ratingSuccess.value = true
    setTimeout(() => {
      ratingSuccess.value = false
      closeModal()
    }, 1500)
  } catch (e) {
    ratingError.value = 'Fehler: ' + (e.response?.data?.message || e.message || 'Unbekannter Fehler')
  }
}

onMounted(() => {
  if (isAuthenticated.value) load()
})
</script>

<style scoped>
.tab-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: 2px solid transparent;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-active-pick  { background: rgba(124,58,237,0.15); border-color: #7C3AED; color: #A855F7; }
.tab-active-look  { background: rgba(34,211,238,0.1);  border-color: #22D3EE; color: #22D3EE; }
.tab-inactive     { background: transparent; border-color: rgba(255,255,255,0.1); color: #888; }
.tab-inactive:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

.badge-count {
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  padding: 0 6px;
  font-size: 0.75rem;
}
.btn-look {
  background: rgba(34,211,238,0.1);
  border: 1px solid #22D3EE;
  color: #22D3EE;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
}
.btn-look:hover { background: rgba(34,211,238,0.2); color: #22D3EE; }

.modal-backdrop-custom {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.modal-box {
  background: #1A1A2E;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 2rem;
  max-width: 480px;
  width: 90%;
}
.star-btn {
  background: none;
  border: none;
  padding: 0 2px;
  cursor: pointer;
  transition: transform 0.1s;
}
.star-btn:hover { transform: scale(1.2); }
</style>
