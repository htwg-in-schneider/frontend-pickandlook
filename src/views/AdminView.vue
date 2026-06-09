<template>
  <div>
    <div v-if="!isAuthenticated || !isAdmin" class="alert alert-danger">
      <i class="bi bi-shield-x me-2"></i>Kein Zugriff – nur für Administratoren.
    </div>

    <div v-else>
      <h2 class="mb-4"><i class="bi bi-shield-check me-2 text-purple"></i>Admin-Bereich</h2>

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
                <td class="text-muted small">{{ entry.user }}</td>
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
import { getWatchlistAdmin } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()

const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})

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
watch(isAuthenticated, (val) => {
  if (val) loadWatchlistEntries()
}, { immediate: true })
</script>
