<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <path d="M14 2 L24 10 L14 26 L4 10 Z" fill="#7C3AED" opacity="0.7"/>
            <path d="M14 6 L21 11 L14 22 L7 11 Z" fill="#22D3EE"/>
          </svg>
          <span><span class="text-purple">Pick</span> <span class="text-white">and</span> <span class="text-cyan">Look</span></span>
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/movies">Filme</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/genres">Genres</RouterLink>
            </li>
            <li class="nav-item ms-2">
              <RouterLink class="btn btn-primary" to="/movies/new">
                <i class="bi bi-plus-lg me-1"></i>Film hinzufügen
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Seiten-Inhalt -->
    <main class="container py-4">
      <RouterView />
    </main>

    <!-- Bootstrap JS (Hamburger-Menü) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </div>
</template>

<style>
:root {
  --bg:        #111118;
  --bg-card:   #1A1A2E;
  --purple:    #7C3AED;
  --purple-lt: #A855F7;
  --cyan:      #22D3EE;
}

* { box-sizing: border-box; }

body {
  background: var(--bg);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  min-height: 100vh;
}

.navbar {
  background: rgba(17,17,24,0.95);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}

.navbar-brand { font-weight: 700; font-size: 1.2rem; }
.nav-link     { color: #aaa !important; transition: color .2s; }
.nav-link:hover, .nav-link.router-link-active { color: #fff !important; }

.btn-primary  { background: var(--purple); border-color: var(--purple); border-radius: 999px; }
.btn-primary:hover { background: var(--purple-lt); border-color: var(--purple-lt); }

.btn-outline-light { border-radius: 999px; }

.text-purple { color: var(--purple-lt); }
.text-cyan   { color: var(--cyan); }

.card {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #fff;
}

.form-control, .form-select {
  background: #252535;
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  border-radius: 8px;
}
.form-control:focus, .form-select:focus {
  background: #252535;
  color: #fff;
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(124,58,237,0.25);
}
.form-control::placeholder { color: #666; }

.form-label { color: #ccc; font-size: 0.9rem; }

.badge-purple { background: var(--purple); }
.badge-cyan   { background: #0E7490; }
.badge-gold   { background: #854D0E; }
.badge-gray   { background: #374151; }

.alert-danger   { background: rgba(220,38,38,0.15); border-color: rgba(220,38,38,0.3); color: #fca5a5; }
.alert-success  { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: #6ee7b7; }
</style>
