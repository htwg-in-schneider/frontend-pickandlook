<template>
  <div>
    <div v-if="!isAuthenticated || !isAdmin" class="alert alert-danger">
      <i class="bi bi-shield-x me-2"></i>Kein Zugriff – nur für Administratoren.
    </div>

    <div v-else>
      <h2 class="mb-4"><i class="bi bi-shield-check me-2 text-purple"></i>Admin-Bereich</h2>

      <!-- Statistiken -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card p-3 text-center">
            <div class="fs-2 fw-bold text-purple">{{ stats.totalMovies ?? '–' }}</div>
            <div class="small text-muted mt-1"><i class="bi bi-film me-1"></i>Filme & Serien</div>
            <div class="small text-muted">{{ stats.totalFilme ?? 0 }} Filme · {{ stats.totalSerien ?? 0 }} Serien</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 text-center">
            <div class="fs-2 fw-bold text-cyan">{{ stats.totalUsers ?? '–' }}</div>
            <div class="small text-muted mt-1"><i class="bi bi-people me-1"></i>Registrierte User</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 text-center">
            <div class="fs-2 fw-bold" :class="stats.offeneAnfragen > 0 ? 'text-warning' : 'text-cyan'">
              {{ stats.offeneAnfragen ?? '–' }}
            </div>
            <div class="small text-muted mt-1"><i class="bi bi-inbox me-1"></i>Offene Anfragen</div>
            <div class="small text-muted">{{ stats.totalAnfragen ?? 0 }} gesamt</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 text-center">
            <div class="fs-2 fw-bold text-purple">{{ stats.totalRatings ?? '–' }}</div>
            <div class="small text-muted mt-1"><i class="bi bi-star me-1"></i>Bewertungen</div>
            <div class="small text-muted">{{ stats.totalWatchlist ?? 0 }} Merklisten-Einträge</div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Genre-Verwaltung -->
        <div class="col-md-6">
          <div class="card p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3">
              <i class="bi bi-tags-fill fs-2 text-cyan"></i>
              <div>
                <h5 class="mb-0">Genre-Verwaltung</h5>
                <small class="text-muted">Genres anlegen, bearbeiten und löschen</small>
              </div>
            </div>
            <div class="d-flex gap-2 mt-auto">
              <RouterLink to="/genres" class="btn btn-outline-light flex-fill">
                <i class="bi bi-list me-1"></i>Alle Genres
              </RouterLink>
              <RouterLink to="/genres/new" class="btn btn-primary flex-fill">
                <i class="bi bi-plus-lg me-1"></i>Neu
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Film-Verwaltung -->
        <div class="col-md-6">
          <div class="card p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3">
              <i class="bi bi-film fs-2 text-purple"></i>
              <div>
                <h5 class="mb-0">Film-Verwaltung</h5>
                <small class="text-muted">Filme anlegen, bearbeiten und löschen</small>
              </div>
            </div>
            <div class="d-flex gap-2 mt-auto">
              <RouterLink to="/movies" class="btn btn-outline-light flex-fill">
                <i class="bi bi-list me-1"></i>Alle Filme
              </RouterLink>
              <RouterLink to="/movies/new" class="btn btn-primary flex-fill">
                <i class="bi bi-plus-lg me-1"></i>Neu
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Eingeloggt als -->
        <div class="col-md-6">
          <div class="card p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3">
              <i class="bi bi-people-fill fs-2 text-cyan"></i>
              <div>
                <h5 class="mb-0">Eingeloggt als</h5>
                <small class="text-muted">{{ user?.email }}</small>
              </div>
            </div>
            <span class="badge badge-purple">Administrator</span>
          </div>
        </div>
      </div>

      <!-- Benutzerverwaltung -->
      <div class="mt-5">
        <div class="d-flex align-items-center gap-3 mb-3">
          <h4 class="mb-0"><i class="bi bi-people me-2 text-purple"></i>Benutzerverwaltung</h4>
          <button @click="loadUsers" class="btn btn-sm btn-outline-light">
            <i class="bi bi-arrow-clockwise"></i> Aktualisieren
          </button>
        </div>
        <p class="text-muted small mb-3">Alle registrierten Benutzer anzeigen und bearbeiten</p>

        <div v-if="loadingUsers" class="text-center py-3">
          <div class="spinner-border text-purple"></div>
        </div>

        <div v-else-if="users.length === 0" class="text-muted">Noch keine Benutzer vorhanden.</div>

        <div v-else class="card p-0" style="overflow:hidden;">
          <table class="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>E-Mail</th>
                <th>Name</th>
                <th>Stadt</th>
                <th>Telefon</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.auth0Sub">
                <td class="small">{{ u.email || '–' }}</td>
                <td>{{ u.name || '–' }}</td>
                <td>{{ u.city || '–' }}</td>
                <td>{{ u.phone || '–' }}</td>
                <td>
                  <button @click="openEdit(u)" class="btn btn-sm btn-outline-light">
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit-Modal -->
      <div v-if="editUser" class="modal-backdrop-custom" @click.self="editUser = null">
        <div class="modal-box">
          <h5 class="mb-3"><i class="bi bi-person me-2"></i>Benutzer bearbeiten</h5>
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input v-model="editUser.name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">E-Mail</label>
            <input v-model="editUser.email" type="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Adresse</label>
            <input v-model="editUser.address" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Stadt</label>
            <input v-model="editUser.city" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Telefon</label>
            <input v-model="editUser.phone" type="text" class="form-control" />
          </div>
          <div v-if="editError" class="alert alert-danger py-2 small">{{ editError }}</div>
          <div class="d-flex gap-2 justify-content-end">
            <button @click="editUser = null" class="btn btn-outline-light">Abbrechen</button>
            <button @click="saveUser" class="btn btn-primary">Speichern</button>
          </div>
        </div>
      </div>

      <!-- Merklisten-Übersicht -->
      <div class="mt-5">
        <div class="d-flex align-items-center gap-3 mb-3">
          <h4 class="mb-0"><i class="bi bi-bookmark-heart me-2 text-cyan"></i>Merklisten-Übersicht</h4>
          <button @click="loadWatchlistEntries" class="btn btn-sm btn-outline-light">
            <i class="bi bi-arrow-clockwise"></i> Aktualisieren
          </button>
        </div>
        <p class="text-muted small mb-3">Alle Merklisten-Einträge aller Benutzer</p>

        <div v-if="loadingWatchlist" class="text-center py-3">
          <div class="spinner-border text-purple"></div>
        </div>

        <div v-else-if="watchlistEntries.length === 0" class="text-muted">
          Noch keine Einträge vorhanden.
        </div>

        <div v-else class="card p-0" style="overflow:hidden;">
          <table class="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Film / Serie</th>
                <th>Typ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, i) in watchlistEntries" :key="i">
                <td class="text-muted small">{{ resolveUser(entry.user) }}</td>
                <td>{{ entry.movieTitel }}</td>
                <td>
                  <span class="badge" :class="entry.movieType === 'serie' ? 'badge-cyan' : 'badge-purple'">
                    {{ entry.movieType === 'serie' ? 'Serie' : 'Film' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getWatchlistAdmin, getAllUsers, updateUserByAdmin, getStats } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()

const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})

// ── Statistiken ─────────────────────────────────────
const stats = ref({})
async function loadStats() {
  try {
    const res = await getStats()
    stats.value = res.data
  } catch (e) {
    console.error('Stats konnten nicht geladen werden', e)
  }
}

// ── Benutzerverwaltung ───────────────────────────────
const users = ref([])
const loadingUsers = ref(true)
const editUser = ref(null)
const editError = ref('')

async function loadUsers() {
  loadingUsers.value = true
  try {
    const res = await getAllUsers()
    users.value = res.data
  } catch (e) {
    console.error('Fehler beim Laden der Benutzer', e)
  } finally {
    loadingUsers.value = false
  }
}

function openEdit(u) {
  editUser.value = { ...u }
  editError.value = ''
}

async function saveUser() {
  editError.value = ''
  try {
    const res = await updateUserByAdmin(editUser.value.auth0Sub, editUser.value)
    const idx = users.value.findIndex(u => u.auth0Sub === editUser.value.auth0Sub)
    if (idx !== -1) users.value[idx] = res.data
    editUser.value = null
  } catch (e) {
    editError.value = 'Speichern fehlgeschlagen. Bitte erneut versuchen.'
    console.error(e)
  }
}

function resolveUser(sub) {
  const found = users.value.find(u => u.auth0Sub === sub)
  return found ? (found.email || found.name || sub) : sub
}

// ── Merklisten ───────────────────────────────────────
const watchlistEntries = ref([])
const loadingWatchlist = ref(true)

async function loadWatchlistEntries() {
  try {
    const res = await getWatchlistAdmin()
    watchlistEntries.value = res.data
  } catch (e) {
    console.error('Fehler beim Laden der Merklisten', e)
  } finally {
    loadingWatchlist.value = false
  }
}

// Laden sobald isAuthenticated true wird
watch(isAuthenticated, async (val) => {
  if (val) {
    loadStats()
    await loadUsers()
    loadWatchlistEntries()
  }
}, { immediate: true })
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-box {
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
}
</style>
