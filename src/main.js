import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createStore } from 'vuex'



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
        logout() {
            store.state.authenticated = false;
            store.state.id = '';
            store.state.email = '';
            store.state.username = '';
            store.state.tel_number = '';
            store.state.token = '';
        }
    }
})
const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)
app.use(store)

app.mount('#app')
