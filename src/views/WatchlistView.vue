<template>
  <div>
    <h2 class="mb-4"><i class="bi bi-bookmark-heart me-2 text-purple"></i>Meine Merkliste</h2>

    <div v-if="!isAuthenticated" class="alert alert-danger">
      <i class="bi bi-lock me-2"></i>Bitte logge dich ein um deine Merkliste zu sehen.
    </div>

    <div v-else-if="loading" class="text-center py-5">
      <div class="spinner-border text-purple"></div>
    </div>

    <div v-else-if="store.items.length === 0" class="text-center py-5">
      <i class="bi bi-bookmark fs-1 text-muted"></i>
      <p class="text-muted mt-3">Deine Merkliste ist leer.</p>
      <RouterLink to="/movies" class="btn btn-primary mt-2">Filme entdecken</RouterLink>
    </div>

    <div v-else class="row g-3">
      <div v-for="movie in store.items" :key="movie.id" class="col-md-4 col-lg-3">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge" :class="movie.type === 'serie' ? 'badge-cyan' : 'badge-purple'">
              {{ movie.type === 'serie' ? 'Serie' : 'Film' }}
            </span>
            <button @click="removeFromWatchlist(movie.id)" class="btn btn-sm btn-outline-danger p-1">
              <i class="bi bi-bookmark-x"></i>
            </button>
          </div>
          <h6 class="fw-bold mb-1">{{ movie.titel }}</h6>
          <div class="text-muted small mb-2">{{ movie.releaseYear }}</div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="text-cyan fw-semibold">⭐ {{ movie.avgRating }}</span>
            <RouterLink :to="`/movies/${movie.id}`" class="btn btn-sm btn-outline-light">Details</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useWatchlistStore } from '../stores/watchlist'

const { isAuthenticated, user } = useAuth0()
const store = useWatchlistStore()
const loading = ref(true)

onMounted(async () => {
  if (isAuthenticated.value) {
    await store.load(user.value.sub)
  }
  loading.value = false
})

async function removeFromWatchlist(movieId) {
  await store.remove(user.value.sub, movieId)
}
</script>
