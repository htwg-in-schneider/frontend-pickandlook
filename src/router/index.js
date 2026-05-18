import { createRouter, createWebHistory } from 'vue-router'
import MoviesView from '../views/MoviesView.vue'
import MovieFormView from '../views/MovieFormView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import GenresView from '../views/GenresView.vue'
import GenreFormView from '../views/GenreFormView.vue'

const routes = [
  { path: '/',          redirect: '/movies' },
  { path: '/movies',    component: MoviesView },
  { path: '/movies/new',      component: MovieFormView },
  { path: '/movies/:id/edit', component: MovieFormView },
  { path: '/movies/:id',      component: MovieDetailView },
  { path: '/genres',          component: GenresView },
  { path: '/genres/new',      component: GenreFormView },
  { path: '/genres/:id/edit', component: GenreFormView },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
