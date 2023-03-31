<template>
    <nav>
        <router-link to="/homePage">Page d'accueil</router-link>

        <router-link v-if="!this.$store.state.authenticated" to="/signin">connexion</router-link>
        <router-link v-if="!this.$store.state.authenticated" to="/signup">inscription</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent">Créer un évenement</button>
        <router-link v-if="this.$store.state.authenticated" class="nav-link" to="/logout">Déconnexion</router-link>
    </nav>

    <div v-if="events != ''">

        <div v-for="event in events" :key="event.id">{{ event }}>
            <p></p>
        </div>
    </div>



    <router-view></router-view>
</template>

<script>
import axios from "axios";

export default {
    name: 'homePage',
    components: {},
    data() {
        return {
            events: '',
        }
    },
    methods: {
        createEvent() {
            axios.get('http://localhost:19102/users/validate', {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            }).then(
                (response) => {
                    if (response.status === 200) {
                        this.$router.push('/createEvent')
                    }
                },
                (error) => {
                    if (error.response.status === 401) {
                        axios.get(`http://localhost:19102/users/getRefresh/${this.$store.state.id}`, {
                        }).then(
                            (response) => {
                                const refresh_token = response.data[0].refresh_token;
                                axios.post('http://localhost:19102/users/refresh', {}, {
                                    headers: {
                                        Authorization: `Bearer ${refresh_token}`
                                    }
                                })
                                    .then(response => {
                                        console.log(response)
                                        this.$store.state.token = response.data.accesstoken;
                                        this.$router.push('/createEvent')
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    });
                            });
                    }
                    this.error = "Une erreur est survenue lors de la connexion";
                }
            );
        },
        getEvents() {
            axios.get(`http://localhost:19100/events/getEvent/${this.$store.state.id}`)
                .then(response => {
                    console.log(response)
                    this.events = response.data;
                    console.log(this.events)
                })
                .catch(error => {
                    console.log(error);
                });

        }
    },
    mounted() {
        this.getEvents()
    },
    computed: {

    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
}

nav {
    display: flex;
    justify-content: center;
}

nav a {
    font-size: 1.2rem;
    padding: 1rem;
    text-decoration: none;
    color: #2c3e50;
}

nav a:hover {
    color: lightgrey;
}
</style>