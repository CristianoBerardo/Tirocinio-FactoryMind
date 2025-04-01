import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// const app = createApp(App).use(Quasar, quasarUserOptions)

import { Quasar } from 'quasar'

// Import Quasar CSS
import 'quasar/dist/quasar.css'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)

// Register Quasar
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {},
})

app.use(createPinia())
app.use(router)

app.mount('#app')
