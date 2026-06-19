<template>
  <div>
    <div v-if="!isAuthenticated" class="alert alert-danger">
      <i class="bi bi-lock me-2"></i>Bitte einloggen um deine Listen zu sehen.
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="mb-0">
            <i class="bi bi-collection-play me-2" style="color:#A855F7;"></i>Meine Listen
          </h2>
          <p class="text-muted small mt-1">Organisiere Filme nach deinen eigenen Themen</p>
        </div>
        <button @click="showCreate = true" class="btn btn-primary px-4">
          <i class="bi bi-plus-lg me-1"></i>Neue Liste
        </button>
      </div>

      <!-- Detailansicht einer Liste -->
      <div v-if="selectedList" class="mb-4">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div class="d-flex align-items-center gap-3">
              <button @click="selectedList = null" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left"></i>
              </button>
              <div v-if="!renamingList">
                <h4 class="mb-0" style="color:#A855F7;">{{ selectedList.name }}</h4>
                <span class="text-muted small">{{ selectedList.movies.length }} Film{{ selectedList.movies.length !== 1 ? 'e' : '' }}</span>
              </div>
              <div v-else class="d-flex align-items-center gap-2">
                <input v-model="renameValue" class="form-control form-control-sm" style="width:200px;"
                       @keyup.enter="saveRename" @keyup.escape="renamingList = false" />
                <button @click="saveRename" class="btn btn-sm btn-primary">OK</button>
                <button @click="renamingList = false" class="btn btn-sm btn-outline-light">Abbrechen</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button @click="startRename" class="btn btn-sm btn-outline-light" title="Umbenennen">
                <i class="bi bi-pencil me-1"></i>Umbenennen
              </button>
              <button @click="confirmDeleteList(selectedList)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash me-1"></i>Liste löschen
              </button>
            </div>
          </div>

          <div v-if="selectedList.movies.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-film fs-1 d-block mb-2 text-muted"></i>
            Noch keine Filme in dieser Liste.<br>
            <RouterLink to="/movies" class="btn btn-primary btn-sm mt-3">
              <i class="bi bi-plus me-1"></i>Filme entdecken
            </RouterLink>
          </div>

          <div v-else class="row g-3">
            <div v-for="movie in selectedList.movies" :key="movie.id" class="col-12 col-md-6">
              <div class="card p-3 d-flex flex-row align-items-center gap-3 h-100">
                <div class="flex-fill">
                  <RouterLink :to="`/movies/${movie.id}`" class="text-decoration-none">
                    <div class="fw-semibold" style="color:#A855F7;">{{ movie.titel }}</div>
                  </RouterLink>
                  <div class="d-flex gap-2 mt-1 flex-wrap">
                    <span class="badge" :class="movie.type === 'serie' ? 'badge-cyan' : 'badge-purple'" style="font-size:0.7rem;">
                      {{ movie.type === 'serie' ? 'Serie' : 'Film' }}
                    </span>
                    <span class="text-muted small">{{ movie.releaseYear }}</span>
                    <span class="text-muted small"><i class="bi bi-star-fill text-warning me-1"></i>{{ movie.avgRating }}/10</span>
                  </div>
                </div>
                <button @click="removeFromSelectedList(movie.id)" class="btn btn-sm btn-outline-danger flex-shrink-0" title="Aus Liste entfernen">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Listen-Übersicht -->
      <div v-else>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" style="color:#7C3AED;"></div>
        </div>

        <div v-else-if="lists.length === 0" class="text-center py-5">
          <i class="bi bi-collection fs-1 d-block mb-3 text-muted"></i>
          <p class="text-muted">Du hast noch keine Listen erstellt.</p>
          <button @click="showCreate = true" class="btn btn-primary px-4">
            <i class="bi bi-plus-lg me-1"></i>Erste Liste erstellen
          </button>
        </div>

        <div v-else class="row g-3">
          <div v-for="list in lists" :key="list.id" class="col-12 col-sm-6 col-md-4">
            <div class="card p-4 h-100 list-card" @click="openList(list)" style="cursor:pointer;">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="mb-1" style="color:#A855F7;">
                    <i class="bi bi-collection me-2"></i>{{ list.name }}
                  </h5>
                  <span class="text-muted small">{{ list.movies.length }} Film{{ list.movies.length !== 1 ? 'e' : '' }}</span>
                </div>
                <button @click.stop="confirmDeleteList(list)" class="btn btn-sm btn-outline-danger p-1" style="line-height:1;" title="Löschen">
                  <i class="bi bi-trash" style="font-size:0.75rem;"></i>
                </button>
              </div>

              <!-- Vorschau: bis zu 3 Filmtitel -->
              <div v-if="list.movies.length > 0">
                <div v-for="(m, i) in list.movies.slice(0, 3)" :key="m.id"
                     class="small text-muted mb-1 text-truncate">
                  <i class="bi bi-dot me-1"></i>{{ m.titel }}
                </div>
                <div v-if="list.movies.length > 3" class="small text-muted fst-italic">
                  + {{ list.movies.length - 3 }} weitere…
                </div>
              </div>
              <div v-else class="small text-muted fst-italic">Noch keine Filme</div>

              <div class="mt-auto pt-3">
                <span class="text-muted" style="font-size:0.75rem;">
                  <i class="bi bi-clock me-1"></i>{{ formatDate(list.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Neue Liste Modal -->
    <div v-if="showCreate" class="modal-backdrop-custom" @click.self="showCreate = false">
      <div class="modal-box">
        <h5 class="mb-3"><i class="bi bi-plus-circle me-2 text-purple"></i>Neue Liste erstellen</h5>
        <input v-model="newListName" type="text" class="form-control mb-3"
               placeholder='z.B. "Date Night", "Mit Papa schauen"…'
               maxlength="60" @keyup.enter="createNewList" autofocus />
        <div class="d-flex gap-2 justify-content-end">
          <button @click="showCreate = false" class="btn btn-outline-light">Abbrechen</button>
          <button @click="createNewList" :disabled="!newListName.trim()" class="btn btn-primary px-4">
            <i class="bi bi-check-lg me-1"></i>Erstellen
          </button>
        </div>
      </div>
    </div>

    <!-- Löschen Bestätigung Modal -->
    <div v-if="deleteTarget" class="modal-backdrop-custom" @click.self="deleteTarget = null">
      <div class="modal-box text-center">
        <i class="bi bi-exclamation-triangle fs-1 text-danger d-block mb-3"></i>
        <h5 class="mb-2">Liste löschen?</h5>
        <p class="text-muted mb-4">Die Liste <strong style="color:#A855F7;">{{ deleteTarget.name }}</strong> wird dauerhaft gelöscht.</p>
        <div class="d-flex gap-2 justify-content-center">
          <button @click="deleteTarget = null" class="btn btn-outline-light">Abbrechen</button>
          <button @click="doDeleteList" class="btn btn-danger px-4">
            <i class="bi bi-trash me-1"></i>Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getLists, createList, renameList, deleteList, removeMovieFromList } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()

const lists        = ref([])
const loading      = ref(true)
const selectedList = ref(null)
const showCreate   = ref(false)
const newListName  = ref('')
const deleteTarget = ref(null)
const renamingList = ref(false)
const renameValue  = ref('')

onMounted(async () => {
  if (isAuthenticated.value && user.value) await loadLists()
})

async function loadLists() {
  loading.value = true
  try {
    const res = await getLists(user.value.sub)
    lists.value = res.data
  } catch { /* ignorieren */ } finally {
    loading.value = false
  }
}

async function createNewList() {
  if (!newListName.value.trim()) return
  try {
    const res = await createList(user.value.sub, newListName.value.trim())
    lists.value.unshift(res.data)
    newListName.value = ''
    showCreate.value = false
  } catch { /* ignorieren */ }
}

function openList(list) {
  selectedList.value = { ...list, movies: [...list.movies] }
  renamingList.value = false
}

function startRename() {
  renameValue.value = selectedList.value.name
  renamingList.value = true
}

async function saveRename() {
  if (!renameValue.value.trim()) return
  try {
    const res = await renameList(user.value.sub, selectedList.value.id, renameValue.value.trim())
    selectedList.value.name = res.data.name
    const idx = lists.value.findIndex(l => l.id === selectedList.value.id)
    if (idx !== -1) lists.value[idx].name = res.data.name
  } catch { /* ignorieren */ } finally {
    renamingList.value = false
  }
}

function confirmDeleteList(list) {
  deleteTarget.value = list
}

async function doDeleteList() {
  try {
    await deleteList(user.value.sub, deleteTarget.value.id)
    lists.value = lists.value.filter(l => l.id !== deleteTarget.value.id)
    if (selectedList.value?.id === deleteTarget.value.id) selectedList.value = null
  } catch { /* ignorieren */ } finally {
    deleteTarget.value = null
  }
}

async function removeFromSelectedList(movieId) {
  try {
    await removeMovieFromList(user.value.sub, selectedList.value.id, movieId)
    selectedList.value.movies = selectedList.value.movies.filter(m => m.id !== movieId)
    const idx = lists.value.findIndex(l => l.id === selectedList.value.id)
    if (idx !== -1) lists.value[idx].movies = selectedList.value.movies
  } catch { /* ignorieren */ }
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.list-card {
  transition: border-color 0.2s, transform 0.15s;
}
.list-card:hover {
  border-color: rgba(168,85,247,0.4);
  transform: translateY(-2px);
}

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
.text-purple { color: #A855F7; }
</style>
