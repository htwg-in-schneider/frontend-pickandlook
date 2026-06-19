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
            <span class="text-secondary">/ 10 (Community)</span>
          </div>
        </div>

        <hr style="border-color: rgba(255,255,255,0.1)">

        <!-- Beschreibung -->
        <div class="mb-4">
          <h5 class="text-secondary mb-2">Beschreibung</h5>
          <p v-if="movie.description" style="font-size:1.05rem; line-height:1.7;">
            {{ movie.description }}
          </p>
          <p v-else class="text-secondary fst-italic">Keine Beschreibung vorhanden.</p>
        </div>

        <!-- Pick/Look Buttons -->
        <div v-if="isAuthenticated" class="mb-3">
          <hr style="border-color: rgba(255,255,255,0.1)">

          <div v-if="!watchlistStatus" class="d-flex gap-2 flex-wrap">
            <button @click="addPick" class="btn btn-pick">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" class="me-2">
                <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
              </svg>
              Als Pick merken
            </button>
            <button @click="markAsLook" class="btn btn-look-add">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" class="me-2">
                <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
              </svg>
              Als Look markieren
            </button>
          </div>

          <div v-else-if="watchlistStatus === 'pick'" class="d-flex align-items-center gap-3 flex-wrap">
            <RouterLink to="/watchlist" class="d-flex align-items-center gap-2 text-decoration-none">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M20 1 L39 20 L20 39 L1 20 Z" fill="#7C3AED"/>
              </svg>
              <span style="color:#A855F7;" class="fw-semibold">In deinen Picks</span>
            </RouterLink>
            <button @click="markAsLook" class="btn btn-look-add btn-sm">
              <svg width="14" height="14" viewBox="0 0 40 40" fill="none" class="me-1">
                <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
              </svg>
              Gesehen? → Look
            </button>
            <button @click="removeFromList" class="btn btn-outline-danger btn-sm">Entfernen</button>
          </div>

          <div v-else-if="watchlistStatus === 'look'" class="d-flex align-items-center gap-2 flex-wrap">
            <RouterLink to="/watchlist" class="d-flex align-items-center gap-2 text-decoration-none">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M20 7 L33 20 L20 33 L7 20 Z" fill="#22D3EE"/>
                <path d="M20 15 L25 20 L20 25 L15 20 Z" fill="white"/>
              </svg>
              <span style="color:#22D3EE;" class="fw-semibold">In deinen Looks</span>
            </RouterLink>
            <button @click="showRatingModal = true" class="btn btn-sm btn-warning ms-2">
              <i class="bi bi-star me-1"></i>
              {{ myRating ? `Deine Bewertung: ${myRating}/10` : 'Jetzt bewerten' }}
            </button>
            <button @click="removeFromList" class="btn btn-outline-danger btn-sm">Entfernen</button>
          </div>
        </div>

        <!-- Zur Liste hinzufügen -->
        <div v-if="isAuthenticated" class="mb-3">
          <button @click="openListModal" class="btn btn-outline-light btn-sm">
            <i class="bi bi-collection-play me-1"></i>Zur Liste hinzufügen
          </button>
        </div>

        <!-- Kommentare -->
        <div class="mt-4">
          <hr style="border-color: rgba(255,255,255,0.1)">
          <h5 class="mb-3">Kommentare <span class="text-muted small">({{ comments.length }})</span></h5>

          <div v-if="isAuthenticated" class="mb-4">
            <textarea v-model="newComment" class="form-control mb-2"
              rows="2" placeholder="Schreib einen Kommentar…" maxlength="1000"
              style="resize:none;"></textarea>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted small">{{ newComment.length }}/1000</span>
              <button @click="submitComment" :disabled="!newComment.trim()" class="btn btn-primary btn-sm px-4">
                <i class="bi bi-send me-1"></i>Senden
              </button>
            </div>
            <div v-if="commentError" class="alert alert-danger py-2 small mt-2">
              {{ commentError }}
            </div>
          </div>
          <div v-else class="text-muted small fst-italic mb-3">
            Logge dich ein um zu kommentieren.
          </div>

          <div v-if="comments.length === 0" class="text-muted small fst-italic">
            Noch keine Kommentare. Sei der Erste!
          </div>
          <div v-for="c in comments" :key="c.id"
               class="comment-item mb-3 p-3"
               :class="{ 'comment-reported': c.reported && isAdmin }">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div class="d-flex align-items-center gap-2">
                <span class="fw-semibold" style="color:#A855F7;">
                  <i class="bi bi-person-circle me-1"></i>{{ c.username }}
                </span>
                <span v-if="c.reported && isAdmin" class="badge bg-danger" style="font-size:0.65rem;">
                  <i class="bi bi-flag-fill me-1"></i>Gemeldet
                </span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted small">{{ formatDate(c.createdAt) }}</span>
                <!-- Admin: kann jeden Kommentar löschen -->
                <button v-if="isAdmin"
                  @click="adminRemoveComment(c.id)"
                  class="btn btn-sm btn-outline-danger py-0 px-1" style="font-size:0.7rem;" title="Als Admin löschen">
                  <i class="bi bi-trash"></i>
                </button>
                <!-- Eigener Kommentar: löschen -->
                <button v-else-if="user && c.auth0Sub === user.sub"
                  @click="removeComment(c.id)"
                  class="btn btn-sm btn-outline-danger py-0 px-1" style="font-size:0.7rem;">
                  <i class="bi bi-trash"></i>
                </button>
                <!-- Fremder Kommentar: melden -->
                <button v-else-if="isAuthenticated && user && c.auth0Sub !== user.sub && !c.reported"
                  @click="flagComment(c)"
                  class="btn btn-sm btn-outline-warning py-0 px-1" style="font-size:0.7rem;" title="Kommentar melden">
                  <i class="bi bi-flag"></i>
                </button>
                <span v-else-if="isAuthenticated && c.reported && !isAdmin" class="text-muted small">
                  <i class="bi bi-flag-fill"></i> Gemeldet
                </span>
              </div>
            </div>
            <p class="mb-0" style="white-space: pre-wrap;">{{ c.text }}</p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-3 mt-3">
          <RouterLink v-if="isAdmin" :to="`/movies/${movie.id}/edit`" class="btn btn-primary px-4">
            <i class="bi bi-pencil me-1"></i>Bearbeiten
          </RouterLink>
          <RouterLink to="/movies" class="btn btn-outline-light">Zurück</RouterLink>
        </div>
      </div>
    </div>

    <!-- Listen-Modal -->
    <div v-if="showListModal" class="modal-backdrop-custom" @click.self="showListModal = false">
      <div class="modal-box">
        <h5 class="mb-3"><i class="bi bi-collection-play me-2" style="color:#A855F7;"></i>Zur Liste hinzufügen</h5>

        <div v-if="listsLoading" class="text-center py-3">
          <div class="spinner-border spinner-border-sm" style="color:#7C3AED;"></div>
        </div>

        <div v-else>
          <div v-if="userLists.length === 0" class="text-muted small mb-3">
            Du hast noch keine Listen. Erstelle eine neue!
          </div>

          <div v-else class="mb-3">
            <div v-for="list in userLists" :key="list.id"
                 class="list-item-row d-flex align-items-center justify-content-between p-2 mb-2 rounded"
                 :class="{ 'list-item-active': isInList(list) }"
                 @click="toggleList(list)" style="cursor:pointer;">
              <div class="d-flex align-items-center gap-2">
                <i class="bi" :class="isInList(list) ? 'bi-check-circle-fill text-success' : 'bi-circle'" style="font-size:1.1rem;"></i>
                <span>{{ list.name }}</span>
                <span class="text-muted small">({{ list.movies.length }})</span>
              </div>
            </div>
          </div>

          <!-- Neue Liste erstellen -->
          <div class="border-top pt-3 mt-1" style="border-color:rgba(255,255,255,0.1)!important;">
            <div class="d-flex gap-2">
              <input v-model="newListNameModal" type="text" class="form-control form-control-sm"
                     placeholder="Neue Liste erstellen…" maxlength="60"
                     @keyup.enter="createAndAdd" />
              <button @click="createAndAdd" :disabled="!newListNameModal.trim()" class="btn btn-sm btn-primary px-3">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button @click="showListModal = false" class="btn btn-outline-light btn-sm">Schließen</button>
        </div>
      </div>
    </div>

    <!-- Bewertungs-Modal -->
    <div v-if="showRatingModal" class="modal-backdrop-custom" @click.self="showRatingModal = false">
      <div class="modal-box text-center">
        <h5 class="mb-1">Wie bewertest du</h5>
        <p class="text-cyan fw-bold fs-5 mb-3">{{ movie?.titel }}?</p>

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

        <div class="d-flex gap-2 justify-content-center">
          <button @click="showRatingModal = false" class="btn btn-outline-light">Überspringen</button>
          <button @click="submitModalRating" :disabled="!modalRating" class="btn btn-warning px-4">
            <i class="bi bi-check-lg me-1"></i>Bewertung speichern
          </button>
        </div>

        <div v-if="ratingSuccess" class="alert alert-success mt-3 py-2 small">
          <i class="bi bi-check-circle me-1"></i>Bewertung gespeichert!
        </div>
        <div v-if="ratingError" class="alert alert-danger mt-3 py-2 small">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ ratingError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { getMovie, getMyRating, submitRating, getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStatus, getComments, addComment, deleteComment, reportComment, adminDeleteComment, getLists, createList, addMovieToList, removeMovieFromList } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()
const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})

const route           = useRoute()
const movie           = ref(null)
const loading         = ref(true)
const error           = ref(null)
const watchlistStatus = ref(null)

const myRating        = ref(0)
const hoverRating     = ref(0)
const ratingSuccess   = ref(false)

const showRatingModal = ref(false)
const modalRating     = ref(0)

const comments      = ref([])
const newComment    = ref('')
const commentError  = ref(null)

// Listen-Modal
const showListModal    = ref(false)
const userLists        = ref([])
const listsLoading     = ref(false)
const newListNameModal = ref('')

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
      const res = await getWatchlist(user.value.sub)
      const found = res.data.find(i => i.movie.id === movie.value?.id)
      watchlistStatus.value = found ? found.status : null
    } catch { /* ignorieren */ }

    try {
      const res = await getMyRating(route.params.id, user.value.sub)
      if (res.status === 200) myRating.value = res.data.stars
    } catch { /* keine Bewertung */ }
  }

  // Kommentare laden
  try {
    const res = await getComments(route.params.id)
    comments.value = res.data
  } catch { /* ignorieren */ }
})

async function addPick() {
  try { await addToWatchlist(user.value.sub, movie.value.id) } catch { /* ignorieren */ }
  watchlistStatus.value = 'pick'
}

async function markAsLook() {
  try {
    if (watchlistStatus.value === null) {
      await addToWatchlist(user.value.sub, movie.value.id)
    }
    await updateWatchlistStatus(user.value.sub, movie.value.id, 'look')
  } catch { /* ignorieren */ }
  watchlistStatus.value = 'look'
  modalRating.value = myRating.value || 0
  showRatingModal.value = true
}

async function removeFromList() {
  try { await removeFromWatchlist(user.value.sub, movie.value.id) } catch { /* ignorieren */ }
  watchlistStatus.value = null
}

const ratingError = ref(null)

async function openListModal() {
  showListModal.value = true
  listsLoading.value = true
  newListNameModal.value = ''
  try {
    const res = await getLists(user.value.sub)
    userLists.value = res.data
  } catch { /* ignorieren */ } finally {
    listsLoading.value = false
  }
}

function isInList(list) {
  return list.movies.some(m => m.id === movie.value?.id)
}

async function toggleList(list) {
  if (isInList(list)) {
    try {
      await removeMovieFromList(user.value.sub, list.id, movie.value.id)
      list.movies = list.movies.filter(m => m.id !== movie.value.id)
    } catch { /* ignorieren */ }
  } else {
    try {
      const res = await addMovieToList(user.value.sub, list.id, movie.value.id)
      list.movies = res.data.movies
    } catch { /* ignorieren */ }
  }
}

async function createAndAdd() {
  if (!newListNameModal.value.trim()) return
  try {
    const res = await createList(user.value.sub, newListNameModal.value.trim())
    const newList = res.data
    await addMovieToList(user.value.sub, newList.id, movie.value.id)
    newList.movies = [movie.value]
    userLists.value.unshift(newList)
    newListNameModal.value = ''
  } catch { /* ignorieren */ }
}

async function submitComment() {
  if (!newComment.value.trim()) return
  commentError.value = null
  try {
    const username = user.value?.name || user.value?.email || 'Anonym'
    const res = await addComment(movie.value.id, user.value.sub, newComment.value.trim(), username)
    comments.value.unshift(res.data)
    newComment.value = ''
  } catch (e) {
    commentError.value = 'Fehler: ' + (e.response?.status + ' ' + (e.response?.data?.message || e.message))
  }
}

async function removeComment(commentId) {
  try {
    await deleteComment(movie.value.id, commentId, user.value.sub)
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch { /* ignorieren */ }
}

async function adminRemoveComment(commentId) {
  try {
    await adminDeleteComment(commentId, user.value.sub)
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch { /* ignorieren */ }
}

async function flagComment(comment) {
  try {
    await reportComment(movie.value.id, comment.id, user.value.sub)
    comment.reported = true
  } catch { /* ignorieren */ }
}

function formatDate(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

async function submitModalRating() {
  if (!modalRating.value) return
  ratingError.value = null
  try {
    await submitRating(user.value.sub, movie.value.id, modalRating.value)
    myRating.value = modalRating.value
    ratingSuccess.value = true
    setTimeout(() => {
      ratingSuccess.value = false
      showRatingModal.value = false
    }, 1500)
  } catch (e) {
    ratingError.value = 'Fehler beim Speichern: ' + (e.response?.data?.message || e.message || 'Unbekannter Fehler')
  }
}
</script>

<style scoped>
.btn-pick {
  background: rgba(124,58,237,0.15);
  border: 1px solid #7C3AED;
  color: #A855F7;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 6px 14px;
}
.btn-pick:hover { background: rgba(124,58,237,0.3); color: #A855F7; }

.btn-look-add {
  background: rgba(34,211,238,0.1);
  border: 1px solid #22D3EE;
  color: #22D3EE;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 6px 14px;
}
.btn-look-add:hover { background: rgba(34,211,238,0.2); color: #22D3EE; }

.star-btn {
  background: none;
  border: none;
  padding: 0 2px;
  cursor: pointer;
  transition: transform 0.1s;
}
.star-btn:hover { transform: scale(1.2); }

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
.text-cyan { color: #22D3EE; }

.comment-item {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
}
.comment-reported {
  border-color: rgba(239,68,68,0.4);
  background: rgba(239,68,68,0.05);
}

.list-item-row {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.15s, background 0.15s;
}
.list-item-row:hover {
  border-color: rgba(168,85,247,0.4);
  background: rgba(168,85,247,0.08);
}
.list-item-active {
  border-color: rgba(34,197,94,0.4) !important;
  background: rgba(34,197,94,0.06) !important;
}
</style>
