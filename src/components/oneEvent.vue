<template>
    <nav class="nav-event">
        <router-link to="/homePage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent"  class="onPage createEventButton">Créer un évenement</button>
    </nav>

    <div class="container-onevent">

        <div class="left-container">
            <h1>Détails de l'événement : {{ events.title }}</h1>
            <h3>Date : {{ events.date_event }}</h3>
            <h3>Adresse : {{ events.address }}</h3>
            <h3>Shared: {{ events.shared_url }}</h3>

            <h1>Listes des participants :</h1>
            <div v-for="(participant, index) in participants" :key="participant.id">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>num</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ participant.participants.name }}</td>
                            <td>{{ participant.participants.firstname }}</td>
                            <td>{{ participant.participants.tel_number }}</td>
                            <td>{{ participant.participants.state }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2>Lien de partage :</h2>
            <a :href="'http://localhost:5173/shared/' + events.shared_url">http://localhost:5173/shared/{{ events.shared_url }}</a>
        </div>
        <div style="height:600px; width:800px" class="mapLeaflet">
            <l-map ref="map" :use-global-leaflet="false" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>
            </l-map>
        </div>   
    </div>

    <div class="commentaires">
    <h1>Commentaires de l'évenement :</h1>

    <div v-for="(commentaire, index) in coms" :key="commentaire.id">
        <table>
            <thead>
                <tr>
                    <th>Pseudo</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ commentaire.username[0].firstname }}</td>
                    <td>{{ commentaire.commentaire }}</td>
                    <td>{{ commentaire.date.substring(0, 10) }}</td>
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
    </div>


    <router-view></router-view>
</template>

<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";


export default {
    name: 'homePage',
    components: {
        LMap,
        LTileLayer,
    },
    data() {
        return {
            events: '',
            user: '',
            com: '',
            coms: '',
            participants: '',
            username: '',
            zoom: 13,
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
                    this.coms = response.data.comments;
                    this.coms.forEach(com => {
                        axios.get(`http://localhost:19102/users/getUser/${com.id_user}`)
                            .then(response => {
                                com.username = response.data;
                                console.log(this.coms)
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
        getParticipants() {
            axios.get(`http://localhost:19100/participants/getParticipants/${this.$route.params.id}`)
                .then(response => {
                    console.log(response)
                    this.participants = response.data.participants;
                    console.log(this.participants)
                })
                .catch(error => {
                    console.log(error);
                });
        },
        goToSharedURL(id) {
            this.$router.push(`/shared/${id}`)
        },

    },
    mounted() {
        this.getEvents()
        this.getComs()
        this.getParticipants()
    },
    computed: {
        substringDate() {
            return this.events.date_event.substring(0, 10)
        },
    }
}
</script>

<style>
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

.container-onevent {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
}

.left-container {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.left-container h1,h2 {
    text-align: center;
    margin-top: 20px;
}

.commentaires h1 {
    text-align: center;
    margin: 20px 0 20px 0;
}

.commentaires form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>


