<template>
  <div>
    <h2 class="mb-4"><i class="bi bi-inbox me-2 text-purple"></i>Anfragen</h2>

    <!-- Publisher/Admin: selbst auch eine Anfrage stellen -->
    <div v-if="canManageContent && isAuthenticated" class="card p-4 mb-4">
      <h5 class="mb-3"><i class="bi bi-plus-circle me-2 text-cyan"></i>Eigene Anfrage stellen</h5>
      <div class="mb-3">
        <textarea v-model="neueAnfrage" class="form-control" rows="2"
          placeholder="z.B. Bitte fügt den Film 'Dune' hinzu..."></textarea>
      </div>
      <div v-if="sendSuccess" class="alert alert-success py-2 small">Anfrage gesendet!</div>
      <button @click="send" :disabled="!neueAnfrage.trim()" class="btn btn-primary btn-sm">
        <i class="bi bi-send me-1"></i>Absenden
      </button>
    </div>

    <!-- Publisher/Admin: alle Anfragen verwalten -->
    <div v-if="canManageContent">
      <div class="d-flex align-items-center gap-3 mb-3">
        <p class="text-muted mb-0">Alle Benutzer-Anfragen anzeigen und bearbeiten</p>
        <button @click="loadAll" class="btn btn-sm btn-outline-light ms-auto">
          <i class="bi bi-arrow-clockwise"></i> Aktualisieren
        </button>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-purple"></div>
      </div>

      <div v-else-if="anfragen.length === 0" class="text-muted">Keine Anfragen vorhanden.</div>

      <div v-else class="d-flex flex-column gap-3">
        <div v-for="a in anfragen" :key="a.id" class="card p-4">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="small text-muted">{{ a.userEmail || a.auth0Sub }}</span>
              <span class="ms-2 small text-muted">· {{ formatDate(a.createdAt) }}</span>
            </div>
            <div class="d-flex gap-2 align-items-center">
              <span class="badge" :class="statusBadge(a.status)">{{ statusLabel(a.status) }}</span>
              <button @click="openEdit(a)" class="btn btn-sm btn-outline-light">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="remove(a.id)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <p class="mb-1">{{ a.text }}</p>
          <p v-if="a.publisherNotiz" class="small text-cyan mb-0">
            <i class="bi bi-chat-left-text me-1"></i>Notiz: {{ a.publisherNotiz }}
          </p>
        </div>
      </div>
    </div>

    <!-- Normaler User: eigene Anfragen + neue stellen -->
    <div v-else-if="isAuthenticated">
      <!-- Neue Anfrage stellen -->
      <div class="card p-4 mb-4">
        <h5 class="mb-3"><i class="bi bi-plus-circle me-2 text-cyan"></i>Neue Anfrage stellen</h5>
        <p class="text-muted small mb-3">Möchtest du einen bestimmten Film oder eine Serie hinzugefügt haben? Schreib uns!</p>
        <div class="mb-3">
          <label class="form-label">Deine Anfrage</label>
          <textarea v-model="neueAnfrage" class="form-control" rows="3"
            placeholder="z.B. Bitte fügt den Film 'Dune' (2021) hinzu..."></textarea>
        </div>
        <div v-if="sendSuccess" class="alert alert-success py-2 small">Anfrage erfolgreich gesendet!</div>
        <div v-if="sendError" class="alert alert-danger py-2 small">{{ sendError }}</div>
        <button @click="send" :disabled="!neueAnfrage.trim()" class="btn btn-primary">
          <i class="bi bi-send me-1"></i>Absenden
        </button>
      </div>

      <!-- Eigene Anfragen -->
      <h5 class="mb-3">Meine Anfragen</h5>
      <div v-if="loadingMine" class="text-center py-3">
        <div class="spinner-border text-purple"></div>
      </div>
      <div v-else-if="meineAnfragen.length === 0" class="text-muted">Noch keine Anfragen gesendet.</div>
      <div v-else class="d-flex flex-column gap-3">
        <div v-for="a in meineAnfragen" :key="a.id" class="card p-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small text-muted">{{ formatDate(a.createdAt) }}</span>
            <span class="badge" :class="statusBadge(a.status)">{{ statusLabel(a.status) }}</span>
          </div>
          <p class="mb-1">{{ a.text }}</p>
          <p v-if="a.publisherNotiz" class="small text-cyan mb-0">
            <i class="bi bi-chat-left-text me-1"></i>{{ a.publisherNotiz }}
          </p>
        </div>
      </div>
    </div>

    <!-- Nicht eingeloggt -->
    <div v-else class="alert alert-danger">
      <i class="bi bi-lock me-2"></i>Bitte einloggen um Anfragen zu stellen.
    </div>

    <!-- Edit Modal (Publisher) -->
    <div v-if="editAnfrage" class="modal-backdrop-custom" @click.self="editAnfrage = null">
      <div class="modal-box">
        <h5 class="mb-3">Anfrage bearbeiten</h5>
        <div class="mb-3">
          <label class="form-label">Status</label>
          <select v-model="editAnfrage.status" class="form-select">
            <option value="offen">Offen</option>
            <option value="in_bearbeitung">In Bearbeitung</option>
            <option value="erledigt">Erledigt</option>
            <option value="abgelehnt">Abgelehnt</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Notiz (sichtbar für User)</label>
          <textarea v-model="editAnfrage.publisherNotiz" class="form-control" rows="3"
            placeholder="z.B. Film wurde hinzugefügt!"></textarea>
        </div>
        <div class="d-flex gap-2 justify-content-end">
          <button @click="editAnfrage = null" class="btn btn-outline-light">Abbrechen</button>
          <button @click="save" class="btn btn-primary">Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getAllAnfragen, getMyAnfragen, createAnfrage, updateAnfrage, deleteAnfrage } from '../services/api.js'

const { isAuthenticated, user } = useAuth0()

const isAdmin = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('admin')
})
const isPublisher = computed(() => {
  const roles = user.value?.['https://pickandlook.com/roles'] || []
  return roles.includes('publisher')
})
const canManageContent = computed(() => isAdmin.value || isPublisher.value)

// Publisher: alle Anfragen
const anfragen = ref([])
const loading = ref(false)

async function loadAll() {
  loading.value = true
  try {
    const res = await getAllAnfragen()
    anfragen.value = res.data
  } finally {
    loading.value = false
  }
}

// User: eigene Anfragen
const meineAnfragen = ref([])
const loadingMine = ref(false)
const neueAnfrage = ref('')
const sendSuccess = ref(false)
const sendError = ref('')

async function loadMine() {
  loadingMine.value = true
  try {
    const res = await getMyAnfragen(user.value.sub)
    meineAnfragen.value = res.data
  } finally {
    loadingMine.value = false
  }
}

async function send() {
  sendError.value = ''
  sendSuccess.value = false
  try {
    await createAnfrage(user.value.sub, {
      text: neueAnfrage.value,
      userEmail: user.value.email
    })
    neueAnfrage.value = ''
    sendSuccess.value = true
    if (canManageContent.value) loadAll()
    else loadMine()
  } catch {
    sendError.value = 'Fehler beim Senden. Bitte erneut versuchen.'
  }
}

// Publisher: Edit Modal
const editAnfrage = ref(null)

function openEdit(a) {
  editAnfrage.value = { ...a }
}

async function save() {
  try {
    const res = await updateAnfrage(editAnfrage.value.id, {
      status: editAnfrage.value.status,
      publisherNotiz: editAnfrage.value.publisherNotiz
    })
    const idx = anfragen.value.findIndex(a => a.id === editAnfrage.value.id)
    if (idx !== -1) anfragen.value[idx] = res.data
    editAnfrage.value = null
  } catch {
    console.error('Speichern fehlgeschlagen')
  }
}

async function remove(id) {
  if (!confirm('Anfrage wirklich löschen?')) return
  await deleteAnfrage(id)
  anfragen.value = anfragen.value.filter(a => a.id !== id)
}

// Hilfsfunktionen
function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusLabel(s) {
  return { offen: 'Offen', in_bearbeitung: 'In Bearbeitung', erledigt: 'Erledigt', abgelehnt: 'Abgelehnt' }[s] || s
}

function statusBadge(s) {
  return { offen: 'badge-gray', in_bearbeitung: 'badge-gold', erledigt: 'badge-cyan', abgelehnt: 'bg-danger' }[s] || 'badge-gray'
}

watch(isAuthenticated, (val) => {
  if (!val) return
  if (canManageContent.value) loadAll()
  else loadMine()
}, { immediate: true })
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
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
