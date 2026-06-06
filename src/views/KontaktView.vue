<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card p-4">
        <h2 class="mb-4"><i class="bi bi-envelope me-2 text-purple"></i>Kontakt</h2>

        <div class="mb-4">
          <h5>Pick and Look</h5>
          <p class="text-muted">
            <i class="bi bi-geo-alt me-2 text-cyan"></i>Musterstraße 1, 70173 Stuttgart<br>
            <i class="bi bi-envelope me-2 text-cyan"></i>kontakt@pickandlook.com<br>
            <i class="bi bi-telephone me-2 text-cyan"></i>0711-123456
          </p>
        </div>

        <hr style="border-color: rgba(255,255,255,0.1)">

        <h5 class="mb-3">Nachricht senden</h5>

        <div v-if="sent" class="alert alert-success">
          ✅ Deine Nachricht wurde gesendet! Wir melden uns bald.
        </div>

        <form v-else @submit.prevent="sendContact">
          <div class="mb-3">
            <label class="form-label">Name *</label>
            <input v-model="contact.name" type="text" class="form-control" placeholder="Dein Name" required />
          </div>
          <div class="mb-3">
            <label class="form-label">E-Mail *</label>
            <input v-model="contact.email" type="email" class="form-control" placeholder="deine@email.de" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Nachricht *</label>
            <textarea v-model="contact.message" class="form-control" rows="4" placeholder="Deine Nachricht..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-send me-1"></i>Absenden
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sent = ref(false)
const contact = ref({ name: '', email: '', message: '' })

function sendContact() {
  const subject = encodeURIComponent('Kontaktanfrage von ' + contact.value.name)
  const body = encodeURIComponent(
    `Name: ${contact.value.name}\nE-Mail: ${contact.value.email}\n\n${contact.value.message}`
  )
  window.location.href = `mailto:kontakt@pickandlook.com?subject=${subject}&body=${body}`
  sent.value = true
}
</script>
