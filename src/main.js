import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    // Lokales Entwickeln: http://localhost:5173/
    // GitHub Pages:       https://htwg-in-schneider.github.io/frontend-pickandlook/
    redirect_uri: window.location.origin + import.meta.env.BASE_URL
  }
})

app.use(auth0)
app.use(router)
app.mount('#app')

