<template>
  <div class="row justify-content-center">
    <div class="col-md-6">

      <div class="card p-4">
        <h2 class="mb-4"><i class="bi bi-person-circle me-2 text-purple"></i>Mein Profil</h2>

        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-purple" role="status"></div>
        </div>

        <form v-else @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label">E-Mail</label>
            <input v-model="form.email" type="email" class="form-control" disabled />
            <small class="text-muted">E-Mail kann nicht geändert werden</small>
          </div>

          <div class="mb-3">
            <label class="form-label">Name</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Dein Name" />
          </div>

          <div class="mb-3">
            <label class="form-label">Adresse</label>
            <input v-model="form.address" type="text" class="form-control" placeholder="Straße und Hausnummer" />
          </div>

          <div class="mb-3">
            <label class="form-label">Stadt</label>
            <input v-model="form.city" type="text" class="form-control" placeholder="Stadt" />
          </div>

          <div class="mb-3">
            <label class="form-label">Telefon</label>
            <input v-model="form.phone" type="text" class="form-control" placeholder="Telefonnummer" />
          </div>

          <div v-if="success" class="alert alert-success">✅ Profil gespeichert!</div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              Speichern
            </button>
            <RouterLink to="/movies" class="btn btn-outline-light">Abbrechen</RouterLink>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'

const { user } = useAuth0()

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const loading = ref(true)
const saving  = ref(false)
const success = ref(false)
const error   = ref(null)

const form = ref({
  name:    '',
  email:   '',
  address: '',
  city:    '',
  phone:   ''
})

onMounted(async () => {
  try {
    const res = await axios.get(`${API}/api/users/me`, {
      params: {
        sub:   user.value.sub,
        email: user.value.email
      }
    })
    form.value = {
      name:    res.data.name    || '',
      email:   res.data.email   || user.value.email || '',
      address: res.data.address || '',
      city:    res.data.city    || '',
      phone:   res.data.phone   || ''
    }
  } catch (e) {
    error.value = 'Profil konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value  = true
  success.value = false
  error.value   = null
  try {
    await axios.put(`${API}/api/users/me`, form.value, {
      params: { sub: user.value.sub }
    })
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (e) {
    error.value = 'Speichern fehlgeschlagen.'
  } finally {
    saving.value = false
  }
}
</script>
