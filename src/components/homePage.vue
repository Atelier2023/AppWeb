<template>
    <nav class="nav-event">
        <router-link to="/homePage" class="onPage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent" class="createEventButton">Créer un évenement</button>
        
    </nav>

    <div class="container-homepage">
        <div v-if="events != ''" class="allEvents">
            <h2>Mes événements</h2>
            <div v-for="(event, index) in this.events" :key="event.id">
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
                            <td style="border: 1px solid black; padding: 5px;">{{ event.date_event.substring(0,10) }}</td>
                            <td style="border: 1px solid black; padding: 5px;">{{ event.address }}</td>
                            <td style="border: 1px solid black; padding: 5px;">{{ event.state }}</td>
                            <td style="border: 1px solid black; padding: 5px;">{{ event.username }}</td>
                            <td style="border: 1px solid black; padding: 5px;"><button style="padding: 5px;"
                                    @click="goToOneEvent(event.id_event)">Détails</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mapLeaflet">
            <mapLeaflet/>
        </div>
    </div>

    <router-view></router-view>
</template>

<script>
import axios from "axios";

export default {
    name: 'homePage',
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
            axios.get(`http://localhost:19100/events/getEvent/${this.$store.state.id}}`)
                .then(response => {
                    this.events = response.data;

                    this.events.forEach(event => {
                        axios.get(`http://localhost:19102/users/getUser/${event.id_user}`)
                            .then(response => {
                                event.username = response.data[0].firstname;
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
    .nav-event {
        display: flex;
        background-color: #EEEEEE;
    }

    .nav-event a {
        text-decoration: none;
        color: #242429;
    }

    .nav-event a:hover {
        border-bottom: #242429 solid 2px;
    }
    .onPage {
        border-bottom: #242429 solid 2px;
    }
    .createEventButton {
        color: #242429;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        border: none;
        font-size: 1em;
        margin: 0;
    }
    .createEventButton:hover {
        color: #242429;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        border: none;
        font-size: 1em;
        margin: 0;
        cursor: pointer;
        border-bottom: #242429 solid 2px;
    }
    .container-homepage {
        display: flex;
        height: 700px;
    }
    .allEvents {
        margin: 25px ;
        padding-right: 15px;
        max-height: 750px;
        overflow: auto;
        width:45%
    }
    .allEvents h2 {
        margin-bottom: 25px;
        text-align: center;
    }
    .mapLeaflet {
        width: 70%;
        margin-top:25px;
    }

    
</style>
