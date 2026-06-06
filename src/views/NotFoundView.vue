<template>
  <div class="text-center py-5">
    <div class="mb-4" style="font-size: 6rem;">🎬</div>
    <h1 class="display-4 fw-bold text-purple mb-3">404</h1>
    <h2 class="mb-3">Seite nicht gefunden</h2>
    <p class="text-muted mb-5">Die Seite die du suchst existiert nicht oder wurde verschoben.</p>
    <div class="d-flex justify-content-center gap-3">
      <RouterLink to="/" class="btn btn-primary btn-lg">
        <i class="bi bi-house me-2"></i>Zur Startseite
      </RouterLink>
      <RouterLink to="/movies" class="btn btn-outline-light btn-lg">
        <i class="bi bi-film me-2"></i>Filme entdecken
      </RouterLink>
    </div>
  </div>
</template>
