import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MoviesView from '../views/MoviesView.vue'
import MovieFormView from '../views/MovieFormView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import GenresView from '../views/GenresView.vue'
import GenreFormView from '../views/GenreFormView.vue'
import ProfileView from '../views/ProfileView.vue'
import ImpressumView from '../views/ImpressumView.vue'
import DatenschutzView from '../views/DatenschutzView.vue'
import WatchlistView from '../views/WatchlistView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import KontaktView from '../views/KontaktView.vue'
import EmpfehlungenView from '../views/EmpfehlungenView.vue'

const routes = [
  { path: '/',              component: HomeView },
  { path: '/empfehlungen',  component: EmpfehlungenView },
  { path: '/profile',       component: ProfileView },
  { path: '/impressum',     component: ImpressumView },
  { path: '/datenschutz',   component: DatenschutzView },
  { path: '/kontakt',       component: KontaktView },
  { path: '/watchlist',     component: WatchlistView },
  { path: '/admin',         component: AdminView },
  { path: '/movies',    component: MoviesView },
  { path: '/movies/new',      component: MovieFormView },
  { path: '/movies/:id/edit', component: MovieFormView },
  { path: '/movies/:id',      component: MovieDetailView },
  { path: '/genres',          component: GenresView },
  { path: '/genres/new',      component: GenreFormView },
  { path: '/genres/:id/edit', component: GenreFormView },
  { path: '/:pathMatch(.*)*',  component: NotFoundView },
]

// GitHub Pages benötigt Hash-History (keine Server-seitigen Weiterleitungen)
// Lokal: createWebHistory() wäre schöner, aber Hash funktioniert überall
const isProduction = import.meta.env.PROD
const router = createRouter({
  history: isProduction ? createWebHashHistory() : createWebHistory(),
  routes
})


export default router
