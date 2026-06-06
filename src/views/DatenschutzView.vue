<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card p-4">
        <h2 class="mb-4"><i class="bi bi-shield-check me-2 text-purple"></i>Datenschutzerklärung</h2>

        <h5>1. Datenschutz auf einen Blick</h5>
        <p class="text-muted">
          Diese Website wurde im Rahmen eines Hochschulprojekts erstellt und
          verarbeitet personenbezogene Daten nur im notwendigen Umfang.
        </p>

        <h5>2. Erhobene Daten</h5>
        <p class="text-muted">
          Bei der Nutzung dieser Website werden folgende Daten verarbeitet:
        </p>
        <ul class="text-muted">
          <li>E-Mail-Adresse (für den Login via Auth0)</li>
          <li>Name, Adresse und Telefonnummer (freiwillig im Profil)</li>
          <li>Merkliste mit gespeicherten Filmen</li>
        </ul>

        <h5>3. Authentifizierung</h5>
        <p class="text-muted">
          Die Authentifizierung erfolgt über Auth0 (auth0.com). Dabei gelten
          die Datenschutzbestimmungen von Auth0.
        </p>

        <h5>4. Datenspeicherung</h5>
        <p class="text-muted">
          Ihre Daten werden auf einem Server gespeichert und nicht an Dritte
          weitergegeben. Sie können Ihre Daten jederzeit im Profil-Bereich
          ändern oder uns kontaktieren um Ihre Daten löschen zu lassen.
        </p>

        <h5>5. Kontakt</h5>
        <p class="text-muted">
          Bei Fragen zum Datenschutz: kontakt@pickandlook.com
        </p>

        <RouterLink to="/" class="btn btn-outline-light mt-3">
          <i class="bi bi-arrow-left me-1"></i>Zurück zur Startseite
        </RouterLink>
      </div>
    </div>
  </div>
</template>
