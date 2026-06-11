<template>
  <div class="row justify-content-center">
    <div class="col-lg-9">

      <!-- Header -->
      <div class="text-center mb-5">
        <h2 class="fw-bold">
          <span class="text-purple">Persönliche</span> Empfehlungen
        </h2>
        <p class="text-muted">In drei Schritten zu deinem nächsten Lieblingsfilm</p>
      </div>

      <!-- Schritt-Anzeige -->
      <div class="d-flex align-items-center justify-content-center mb-5 gap-2">
        <template v-for="(label, i) in stepLabels" :key="i">
          <div class="d-flex flex-column align-items-center">
            <div :class="['step-dot', step > i + 1 ? 'done' : step === i + 1 ? 'active' : '']">
              <i v-if="step > i + 1" class="bi bi-check-lg"></i>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="step-label small mt-1" :class="step === i + 1 ? 'text-white' : 'text-muted'">{{ label }}</div>
          </div>
          <div v-if="i < stepLabels.length - 1" :class="['step-line mb-3', step > i + 1 ? 'done' : '']"></div>
        </template>
      </div>

      <!-- ──────────────────────────────── -->
      <!-- Schritt 1: Stimmung wählen -->
      <!-- ──────────────────────────────── -->
      <div v-if="step === 1">
        <h4 class="fw-bold text-center mb-4">Welche Stimmung hast du heute?</h4>
        <div class="row g-3">
          <div v-for="mood in moods" :key="mood.value" class="col-6 col-md-3">
            <button @click="selectMood(mood)"
                    :class="['mood-card w-100 text-start p-3', selectedMood?.value === mood.value ? 'selected' : '']">
              <div class="mood-emoji mb-2">{{ mood.emoji }}</div>
              <div class="fw-semibold" style="font-size:0.9rem;">{{ mood.label }}</div>
              <div class="small mt-1" style="color:#888; font-size:0.8rem;">{{ mood.desc }}</div>
            </button>
          </div>
          <!-- Alles-Option -->
          <div class="col-6 col-md-3">
            <button @click="selectMood({ value: '__all__', label: 'Alles', emoji: '🎬', desc: 'Überrasch mich!' })"
                    :class="['mood-card w-100 text-start p-3', selectedMood?.value === '__all__' ? 'selected' : '']">
              <div class="mood-emoji mb-2">🎬</div>
              <div class="fw-semibold" style="font-size:0.9rem;">Alles</div>
              <div class="small mt-1" style="color:#888; font-size:0.8rem;">Überrasch mich!</div>
            </button>
          </div>
        </div>
      </div>

      <!-- ──────────────────────────────── -->
      <!-- Schritt 2: Verfeinern -->
      <!-- ──────────────────────────────── -->
      <div v-if="step === 2">
        <h4 class="fw-bold text-center mb-2">Verfeinere deine Suche</h4>
        <p class="text-center text-muted mb-4">
          Gewählte Stimmung:
          <span class="text-purple fw-semibold">{{ selectedMood.emoji }} {{ selectedMood.label }}</span>
        </p>

        <div class="card p-4">
          <!-- Film oder Serie? -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Was soll es sein?</label>
            <div class="d-flex gap-2 flex-wrap">
              <button v-for="t in typeOptions" :key="t.value"
                      @click="filters.type = t.value"
                      :class="['btn btn-sm', filters.type === t.value ? 'btn-primary' : 'btn-outline-light']">
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Mindestbewertung -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              Mindestbewertung:
              <span class="text-purple">{{ filters.minRating > 0 ? filters.minRating + '★' : 'Egal' }}</span>
            </label>
            <input type="range" class="form-range" v-model.number="filters.minRating"
                   min="0" max="9" step="0.5" />
            <div class="d-flex justify-content-between small text-muted">
              <span>Egal</span>
              <span>Nur Top-Filme (9+)</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-3 justify-content-center pt-2">
            <button @click="step = 1" class="btn btn-outline-light">
              <i class="bi bi-arrow-left me-1"></i>Zurück
            </button>
            <button @click="loadResults" class="btn btn-primary px-4" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-stars me-1"></i>
              Empfehlungen anzeigen
            </button>
          </div>

          <div v-if="loadError" class="alert alert-danger mt-3 mb-0">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ loadError }}
          </div>
        </div>
      </div>

      <!-- ──────────────────────────────── -->
      <!-- Schritt 3: Ergebnisse -->
      <!-- ──────────────────────────────── -->
      <div v-if="step === 3">
        <h4 class="fw-bold text-center mb-2">Deine Empfehlungen</h4>
        <p class="text-center text-muted mb-4">
          {{ selectedMood.emoji }} {{ selectedMood.label }}
          <span v-if="filters.type === 'film'"> · Nur Filme</span>
          <span v-else-if="filters.type === 'serie'"> · Nur Serien</span>
          <span v-if="filters.minRating > 0"> · ★ {{ filters.minRating }}+</span>
          <span class="ms-2 text-purple">({{ results.length }} Treffer)</span>
        </p>

        <!-- Keine Treffer -->
        <div v-if="results.length === 0" class="text-center py-5">
          <i class="bi bi-search" style="font-size:3rem; color:#555;"></i>
          <p class="text-muted mt-3 mb-3">Keine Treffer für diese Kombination.</p>
          <button @click="step = 2" class="btn btn-outline-light me-2">Filter anpassen</button>
          <button @click="restart" class="btn btn-primary">Neue Suche</button>
        </div>

        <!-- Ergebniskarten -->
        <div v-else class="row g-3 mb-4">
          <div v-for="movie in results" :key="movie.id" class="col-md-6">
            <div class="card p-3 h-100">
              <div class="d-flex gap-3">
                <!-- Thumb -->
                <div class="movie-thumb d-flex align-items-center justify-content-center flex-shrink-0">
                  <i class="bi bi-film" style="font-size:1.5rem; color:var(--purple-lt);"></i>
                </div>
                <!-- Info -->
                <div class="flex-grow-1 min-width-0">
                  <h6 class="fw-bold mb-1" style="font-size:0.95rem;">{{ movie.titel }}</h6>
                  <div class="mb-2">
                    <span class="badge me-1 small" :class="movie.type === 'film' ? 'badge-purple' : 'badge-cyan'">
                      {{ movie.type === 'film' ? 'Film' : 'Serie' }}
                    </span>
                    <span class="small text-muted">
                      {{ movie.genre?.name }}
                      <span v-if="movie.releaseYear"> · {{ movie.releaseYear }}</span>
                      <span v-if="movie.avgRating" class="ms-1">· ★ {{ movie.avgRating }}</span>
                    </span>
                  </div>
                  <p class="small text-muted mb-2" style="line-height:1.45; font-size:0.82rem;">
                    {{ movie.description }}
                  </p>
                  <div class="d-flex gap-2 flex-wrap">
                    <RouterLink :to="`/movies/${movie.id}`" class="btn btn-sm btn-outline-light">
                      Details
                    </RouterLink>
                    <button v-if="isAuthenticated"
                            @click="toggleWatchlist(movie)"
                            :class="['btn btn-sm', watchlistStore.isInWatchlist(movie.id) ? 'btn-outline-danger' : 'btn-outline-light']">
                      <i :class="['bi me-1', watchlistStore.isInWatchlist(movie.id) ? 'bi-bookmark-x' : 'bi-bookmark-plus']"></i>
                      {{ watchlistStore.isInWatchlist(movie.id) ? 'Entfernen' : 'Merken' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="results.length > 0" class="text-center">
          <button @click="restart" class="btn btn-primary px-4">
            <i class="bi bi-arrow-clockwise me-1"></i>Neue Suche
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useWatchlistStore } from '../stores/watchlist.js'
import { getMovies } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()
const watchlistStore = useWatchlistStore()

const step = ref(1)
const loading = ref(false)
const loadError = ref(null)
const selectedMood = ref(null)
const results = ref([])

const stepLabels = ['Stimmung', 'Verfeinern', 'Ergebnisse']

const moods = [
  { value: 'Spannung', label: 'Spannung',  emoji: '😰', desc: 'Thriller & Dramen' },
  { value: 'Action',   label: 'Action',    emoji: '💥', desc: 'Adrenalin pur' },
  { value: 'Romantik', label: 'Romantik',  emoji: '💕', desc: 'Liebesgeschichten' },
  { value: 'Komödie',  label: 'Komödie',   emoji: '😂', desc: 'Zum Lachen' },
  { value: 'Familie',  label: 'Familie',   emoji: '👨‍👩‍👧', desc: 'Für alle' },
  { value: 'Filmabend',label: 'Filmabend', emoji: '🍿', desc: 'Entspannt & gemütlich' },
  { value: 'Sci-Fi',   label: 'Sci-Fi',    emoji: '🚀', desc: 'Zukunft & Technologie' },
  { value: 'Mystery',  label: 'Mystery',   emoji: '🔍', desc: 'Rätsel & Übernatürliches' },
]

const typeOptions = [
  { value: '',      label: 'Alles' },
  { value: 'film',  label: 'Nur Filme' },
  { value: 'serie', label: 'Nur Serien' },
]

const filters = ref({ type: '', minRating: 0 })

onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    await watchlistStore.load(user.value.sub)
  }
})

function selectMood(mood) {
  selectedMood.value = mood
  filters.value = { type: '', minRating: 0 }
  step.value = 2
}

async function loadResults() {
  loading.value = true
  loadError.value = null
  try {
    // Alle Filme holen, dann client-seitig filtern
    const res = await getMovies()
    let movies = res.data

    // Thema filtern
    if (selectedMood.value?.value !== '__all__' && selectedMood.value?.value) {
      movies = movies.filter(m => m.theme === selectedMood.value.value)
    }
    // Typ filtern
    if (filters.value.type) {
      movies = movies.filter(m => m.type === filters.value.type)
    }
    // Mindestbewertung filtern
    if (filters.value.minRating > 0) {
      movies = movies.filter(m => m.avgRating >= filters.value.minRating)
    }

    results.value = movies
    step.value = 3
  } catch (e) {
    loadError.value = 'Das Backend ist gerade nicht erreichbar. Bitte warte kurz und versuche es erneut.'
  } finally {
    loading.value = false
  }
}

async function toggleWatchlist(movie) {
  if (!isAuthenticated.value) return
  const sub = user.value.sub
  if (watchlistStore.isInWatchlist(movie.id)) {
    await watchlistStore.remove(sub, movie.id)
  } else {
    await watchlistStore.add(sub, movie.id)
  }
}

function restart() {
  step.value = 1
  selectedMood.value = null
  results.value = []
  filters.value = { type: '', minRating: 0 }
}
</script>

<style scoped>
.mood-card {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  min-height: 110px;
}
.mood-card:hover {
  border-color: rgba(168,85,247,0.5);
  background: rgba(124,58,237,0.1);
}
.mood-card.selected {
  border-color: var(--purple);
  background: rgba(124,58,237,0.2);
}
.mood-emoji { font-size: 1.8rem; }

.step-dot {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  color: #aaa;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.step-dot.active {
  background: var(--purple);
  color: #fff;
}
.step-dot.done {
  background: #059669;
  color: #fff;
}

.step-label { font-size: 0.78rem; text-align: center; }

.step-line {
  flex: 1;
  max-width: 80px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  align-self: flex-start;
  margin-top: 19px;
}
.step-line.done { background: #059669; }

.movie-thumb {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  background: rgba(124,58,237,0.15);
  flex-shrink: 0;
}

.min-width-0 { min-width: 0; }
</style>
