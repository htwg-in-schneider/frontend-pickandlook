<template>
  <div class="row justify-content-center">
    <div class="col-lg-6">
      <div class="d-flex align-items-center gap-3 mb-4">
        <RouterLink to="/genres" class="btn btn-outline-light btn-sm">
          <i class="bi bi-arrow-left"></i>
        </RouterLink>
        <h3 class="mb-0">{{ isEdit ? 'Genre bearbeiten' : 'Neues Genre anlegen' }}</h3>
      </div>

      <div v-if="error"   class="alert alert-danger mb-3">{{ error }}</div>
      <div v-if="success" class="alert alert-success mb-3">{{ success }}</div>

      <div class="card p-4">
        <form @submit.prevent="submit">

          <div class="mb-3">
            <label class="form-label">Name *</label>
            <input v-model="form.name" type="text" class="form-control"
                   placeholder="z.B. Action" required />
          </div>

          <div class="mb-4">
            <label class="form-label">Beschreibung</label>
            <textarea v-model="form.description" class="form-control" rows="3"
                      placeholder="Kurze Beschreibung des Genres…"></textarea>
          </div>

          <div class="d-flex gap-3">
            <button type="submit" class="btn btn-primary px-4" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Speichern' : 'Anlegen' }}
            </button>
            <RouterLink to="/genres" class="btn btn-outline-light">Abbrechen</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGenre, createGenre, updateGenre } from '../services/api.js'

const route  = useRoute()
const router = useRouter()

const isEdit  = computed(() => !!route.params.id)
const saving  = ref(false)
const error   = ref(null)
const success = ref(null)
const form    = ref({ name: '', description: '' })

onMounted(async () => {
  if (isEdit.value) {
    const res = await getGenre(route.params.id)
    form.value = { name: res.data.name, description: res.data.description || '' }
  }
})

async function submit() {
  saving.value = true
  error.value  = null
  success.value = null
  try {
    if (isEdit.value) {
      await updateGenre(route.params.id, form.value)
      success.value = 'Genre erfolgreich gespeichert!'
    } else {
      await createGenre(form.value)
      success.value = 'Genre erfolgreich angelegt!'
    }
    setTimeout(() => router.push('/genres'), 1000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Fehler beim Speichern.'
  } finally {
    saving.value = false
  }
}
</script>
