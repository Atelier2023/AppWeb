<template>
    <nav>
        <h1></h1>
        <router-link v-if="!this.$store.state.authenticated" to="/signin">connexion</router-link>
        <router-link v-if="!this.$store.state.authenticated" to="/signup">inscription</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent">Créer un évenement</button>
        <router-link v-if="this.$store.state.authenticated" class="nav-link" to="/logout">Déconnexion</router-link>
    </nav>

    <div v-if="events != ''">

        <div v-for="(event, index) in events" :key="event.id">
            <table style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 5px;">Titre de l'événement</th>
                        <th style="border: 1px solid black; padding: 5px;">Date de l'événement</th>
                        <th style="border: 1px solid black; padding: 5px;">Adresse de l'événement</th>
                        <th style="border: 1px solid black; padding: 5px;">Statut</th>
                        <th style="border: 1px solid black; padding: 5px;">Créateur de l'événement</th>
                        <th style="border: 1px solid black; padding: 5px;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">{{ event.title }}</td>
                        <td style="border: 1px solid black; padding: 5px;">{{ event.date_event }}</td>
                        <td style="border: 1px solid black; padding: 5px;">{{ event.address }}</td>
                        <td style="border: 1px solid black; padding: 5px;">{{ event.state }}</td>
                        <td style="border: 1px solid black; padding: 5px;">{{ event.username[0].firstname }}</td>
                        <td style="border: 1px solid black; padding: 5px;"><button style="padding: 5px;"
                                @click="goToOneEvent(event.id_event)">Détails</button></td>
                    </tr>
                </tbody>
            </table>
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
            user: '',
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
                                        this.$store.state.token = response.data.accesstoken;
                                        this.$router.push('/createEvent')
                                    })
                                    .catch(error => {
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
                    this.events = response.data;

                    this.events.forEach(event => {
                        axios.get(`http://localhost:19102/users/getUser/${event.id_user}`)
                            .then(response => {
                                event.username = response.data;
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });

                })
                .catch(error => {
                    console.log(error);
                });
        },
        goToOneEvent(id) {
            axios.get('http://localhost:19102/users/validate', {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            }).then(
                (response) => {
                    if (response.status === 200) {
                        this.$router.push(`/oneEvent/${id}`)
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
                                        this.$store.state.token = response.data.accesstoken;
                                        this.$router.push(`/oneEvent/${id}`)
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


