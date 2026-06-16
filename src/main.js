import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import { setTokenGetter } from './services/api.js'

const app = createApp(App)

app.use(createPinia())

const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    // Lokales Entwickeln: http://localhost:5173/
    // GitHub Pages:       https://htwg-in-schneider.github.io/frontend-pickandlook/
    redirect_uri: window.location.origin + import.meta.env.BASE_URL,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE
  }
})

app.use(auth0)
app.use(router)
app.mount('#app')

// JWT-Token-Getter für den Axios-Interceptor registrieren
// Nur Token senden wenn User eingeloggt ist, sonst kein Authorization-Header
const { getAccessTokenSilently, isAuthenticated } = auth0
setTokenGetter(() => {
  if (!isAuthenticated.value) return Promise.resolve(null)
  return getAccessTokenSilently()
})

