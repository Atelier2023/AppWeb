import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createStore } from 'vuex'
import VuexPersist from 'vuex-persistedstate' // importer la bibliothèque Vuex Persisted State

const store = createStore({
    state() {
        return {
            authenticated: false,
            id: '',
            email: '',
            username: '',
            tel_number: '',
            token: '',
        }
    },
    mutations: {
        logout(state) { // ajuster la définition de la mutation pour qu'elle prenne un paramètre `state`
            state.authenticated = false;
            state.id = '';
            state.email = '';
            state.username = '';
            state.tel_number = '';
            state.token = '';
        }
    },
    plugins: [VuexPersist({
        key: 'my-app',
        storage: window.localStorage,
    })], // Ajouter VuexPersist en tant que plugin de Vuex avec la configuration
})

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)
app.use(store)

app.mount('#app')
