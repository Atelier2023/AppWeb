<template>
    <nav>
        <router-link to="/homePage">Page d'accueil</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent">Créer un évenement</button>
        <router-link v-if="this.$store.state.authenticated" class="nav-link" to="/logout">Déconnexion</router-link>
    </nav>
    <p>{{ events }}</p>

    <h1>Détails de l'événement : {{ events.title }}</h1>
    <h3>Date : {{ events.date_event }}</h3>
    <h3>Adresse : {{ events.address }}</h3>

    <h1>Listes des participants :</h1>

    <h1>Commentaires de l'évenement :</h1>

    <div v-for="(commentaire, index) in coms" :key="commentaire.id">
        <table>
            <thead>
                <tr>
                    <th>ID utilisateur</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ commentaire.id_user }}</td>
                    <td>{{ commentaire.commentaire }}</td>
                    <td>{{ commentaire.date }}</td>
                </tr>
            </tbody>
        </table>

    </div>
    <form @submit.prevent="addCom">
        <div>
            <label for="com">Commentaires:</label><br>
            <textarea name="com" id="com" v-model="com" cols="50" rows="5" required></textarea>
        </div>
        <button type="submit">Ajouter un commentaires</button>
    </form>

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
            com: '',
            coms: '',
            username: '',
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
            axios.get(`http://localhost:19100/events/${this.$route.params.id}`)
                .then(response => {
                    console.log(response)
                    this.events = response.data;
                    console.log(this.events)


                })
                .catch(error => {
                    console.log(error);
                });
        },

        getComs() {
            axios.get(`http://localhost:19100/commentaires/${this.$route.params.id}`)
                .then(response => {
                    console.log(response)
                    this.coms = response.data.comments;
                    console.log(this.coms)
                })
                .catch(error => {
                    console.log(error);
                });
        },
        addCom() {
            axios.get('http://localhost:19102/users/validate', {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            }).then(
                (response) => {
                    console.log(response)
                    if (response.status === 200) {
                        const current = new Date();
                        const date = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}`;
                        axios.post("http://localhost:19100/commentaires/create", {
                            commentaire: this.com,
                            id_user: this.$store.state.id,
                            id_event: this.$route.params.id,
                            date: date
                        }).then(
                            (response) => {
                                if (response.status === 201) {
                                    this.getComs()
                                    this.$router.push(`/oneEvent/${this.$route.params.id}`)
                                }
                                console.log(response);
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
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
                                        const current = new Date();
                                        const date = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}`;
                                        axios.post("http://localhost:19100/commentaires/create", {
                                            commentaire: this.com,
                                            id_user: this.$store.state.id,
                                            id_event: this.$route.params.id,
                                            date: date
                                        }).then(
                                            (response) => {
                                                if (response.status === 201) {
                                                    this.getComs()
                                                    this.$router.push(`/oneEvent/${this.$route.params.id}`)
                                                }
                                                console.log(response);
                                            },
                                            (error) => {
                                                console.log(error);
                                                this.error = true;
                                            }
                                        );
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
        this.getComs()
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

table {
    border-collapse: collapse;
    width: 80%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>


