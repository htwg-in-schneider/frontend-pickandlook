<template>
  <div>

    <!-- Hero Section -->
    <section class="hero-section py-5 mb-5">
      <div class="row align-items-center g-5">
        <!-- Left -->
        <div class="col-lg-6">
          <h1 class="hero-title fw-bold mb-3">
            Dein perfekter Film.<br>
            <span class="text-purple">Jede Nacht.</span><br>
            <span class="text-cyan">Jede Stimmung.</span>
          </h1>
          <p class="text-warning fw-semibold mb-2">Weniger suchen. Mehr genießen</p>
          <p class="text-muted mb-4">
            Pick and Look zeigt dir deine Lieblingsfilme und Serien –
            sortiert nach Genre, Bewertung und deiner persönlichen Merkliste.
          </p>
          <div class="d-flex gap-3 flex-wrap">
            <RouterLink to="/movies" class="btn btn-primary btn-lg">
              Jetzt loslegen
            </RouterLink>
            <a href="#kontakt" class="btn btn-outline-light btn-lg">Mehr Erfahren</a>
          </div>
        </div>

        <!-- Right: Empfohlen für dich -->
        <div class="col-lg-6">
          <div class="recommend-card p-4">
            <p class="text-purple fw-semibold mb-3">Empfohlen für dich</p>
            <div v-for="movie in topMovies" :key="movie.titel" class="recommend-item d-flex align-items-center gap-3 mb-3">
              <div class="recommend-thumb d-flex align-items-center justify-content-center" :style="{ background: movie.color }">
                <i class="bi bi-play-fill text-white"></i>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <div class="fw-semibold" style="font-size:0.95rem;">{{ movie.titel }}</div>
                  <span class="small" style="color:#C4B5FD;">{{ movie.match }}%</span>
                </div>
                <div class="small mb-1" style="color:#888;">{{ movie.genre }} · {{ movie.year }}</div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: movie.match + '%', background: movie.barColor }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Was macht Pick and Look besonders -->
    <section class="mb-5 text-center">
      <h2 class="fw-bold mb-2">Was Pick and Look <span class="text-purple">besonders</span> macht</h2>
      <p class="text-muted mb-5">Nicht nur eine weitere Empfehlungs-App – ein intelligenter Filmbegleiter</p>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card p-4 h-100 text-start">
            <div class="feature-icon mb-3"><i class="bi bi-check-circle-fill text-purple fs-3"></i></div>
            <h6 class="fw-bold">Personalisierte Empfehlungen</h6>
            <p class="text-muted small">Basierend auf deinen Interessen schlägt Pick and Look Filme vor, die wirklich zu dir passen</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 h-100 text-start">
            <div class="feature-icon mb-3"><i class="bi bi-funnel-fill text-cyan fs-3"></i></div>
            <h6 class="fw-bold">Smarte Filterung</h6>
            <p class="text-muted small">Filtere nach Genre, Erscheinungsjahr oder Bewertung und finde genau das, wonach du suchst</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 h-100 text-start">
            <div class="feature-icon mb-3"><i class="bi bi-star-fill text-purple fs-3"></i></div>
            <h6 class="fw-bold">Persönliche Merkliste</h6>
            <p class="text-muted small">Speichere interessante Filme und Serien auf deiner Merkliste und behalte immer den Überblick</p>
          </div>
        </div>
      </div>
    </section>

    <!-- So funktioniert Pick and Look -->
    <section class="mb-5 text-center">
      <h2 class="fw-bold mb-2">So funktioniert <span class="text-cyan">Pick and Look</span></h2>
      <p class="text-muted mb-5">In drei einfachen Schritten zu deinem nächsten Lieblingsfilm.</p>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="step-circle mx-auto mb-3" style="background:var(--purple);">1</div>
          <h6 class="fw-bold">Interessen auswählen</h6>
          <p class="text-muted small">Wähle deine Lieblingsgenres und Themen aus</p>
        </div>
        <div class="col-md-4">
          <div class="step-circle mx-auto mb-3" style="background:var(--purple);">2</div>
          <h6 class="fw-bold">Empfehlungen erhalten</h6>
          <p class="text-muted small">Unser System zeigt dir passende Filme und Serien</p>
        </div>
        <div class="col-md-4">
          <div class="step-circle mx-auto mb-3" style="background:var(--cyan);">3</div>
          <h6 class="fw-bold">Film genießen</h6>
          <p class="text-muted small">Klicke auf deinen Wunschfilm und leg sofort los</p>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-section text-center py-5 mb-5 full-width">
      <h2 class="fw-bold mb-2 text-warning">Bereit für dein nächstes<br>Filmerlebnis?</h2>
      <p class="text-warning-light mb-4">Kostenlos registrieren. Kein Abo nötig. Sofort loslegen</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink to="/movies" class="btn btn-warning btn-lg fw-semibold">Jetzt kostenlos Starten</RouterLink>
        <a href="#kontakt" class="btn btn-outline-warning btn-lg">Mehr erfahren</a>
      </div>
    </section>

    <!-- Kontaktformular -->
    <section id="kontakt" class="row justify-content-center mb-5">
      <div class="col-md-6">
        <div class="card p-4">
          <h3 class="mb-4 fw-bold"><i class="bi bi-envelope me-2 text-purple"></i>Kontakt</h3>

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
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated, loginWithRedirect } = useAuth0()

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

const topMovies = [
  { titel: 'Inception',       genre: 'Sci-Fi',  year: 2010, match: 98, color: 'rgba(124,58,237,0.6)', barColor: '#7C3AED' },
  { titel: 'Interstellar',    genre: 'Drama',   year: 2014, match: 95, color: 'rgba(34,211,238,0.5)', barColor: '#22D3EE' },
  { titel: 'The Dark Knight', genre: 'Action',  year: 2008, match: 92, color: 'rgba(234,179,8,0.5)',  barColor: '#EAB308' },
]
</script>

<style scoped>
.hero-title { font-size: 2.8rem; line-height: 1.2; }

.recommend-card {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
}

.recommend-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
}

.recommend-item { border-radius: 10px; }

.progress-bar-bg {
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  height: 6px;
  width: 100%;
}
.progress-bar-fill {
  height: 6px;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.step-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.cta-section {
  background: linear-gradient(135deg, #2D1B69 0%, #1A1A4E 100%);
  border: none;
}

.full-width {
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
