import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createStore } from 'vuex'
import VuexPersist from 'vuex-persistedstate'

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
    plugins: [
        VuexPersist({
            key: 'my-app',
            storage: window.localStorage,
        })
    ],
    mutations: {
        login(state) {
            state.authenticated = true;
            state.id = state.id;
            state.email = state.email;
            state.username = state.username;
            state.tel_number = state.tel_number;
            state.token = state.token;
        },
        logout(state) {
            state.authenticated = false;
            state.id = '';
            state.email = '';
            state.username = '';
            state.tel_number = '';
            state.token = '';
        }
    },

})

const app = createApp(App)
app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')
