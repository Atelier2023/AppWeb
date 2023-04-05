<template>
    <nav class="nav-event">
        <router-link to="/homePage" v-if="this.$store.state.authenticated" class="onPage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent" class="createEventButton">Créer un
            évenement</button>

    </nav>

    <div class="container-homepage">
        <div v-if="events != ''" class="allEvents">
            <h2>Mes événements</h2>
            <div v-for="(event, index) in this.events" :key="event.id" class="event-home">
                <div class="event-left">
                    <span class="event-title"><b>{{ event.title }}</b></span> - <i style="font-size: 0.9em;">{{
                        event.date_event.substring(0, 10) }} </i><span class="state-event"> {{ event.state }} </span><br>
                    <br>{{ event.address }} <br><br>
                    <u> Organisateur :</u> {{ event.username }}
                </div>
                <button class="buttonLog" @click="goToOneEvent(event.id_event)">Détails</button>
                <br>
            </div>
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
            axios.get('http://localhost:19106/users/validate', {
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
                        axios.get(`http://localhost:19106/users/getRefresh/${this.$store.state.id}`, {
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
            axios.get(`http://localhost:19106/events/getEvent/${this.$store.state.id}}`)
                .then(response => {
                    this.events = response.data;

                    this.events.forEach(event => {
                        axios.get(`http://localhost:19106/users/getUser/${event.id_user}`)
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
            axios.get('http://localhost:19106/users/validate', {
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
                        axios.get(`http://localhost:19106/users/getRefresh/${this.$store.state.id}`, {
                        }).then(
                            (response) => {
                                const refresh_token = response.data[0].refresh_token;
                                axios.post('http://localhost:19106/users/refresh', {}, {
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
    background-color: #D7D7D7;
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

.event-home {
    padding: 25px 25px 80px 25px;
    border: #242429 solid 2px;
    background-color: white;
    margin-bottom: 25px;
}

.event-title {
    font-size: 1.3em;
}

.state-event {
    float: right;
}

.event-home button {
    float: right;
}

.allEvents h2 {
    border: 1px solid black;
    color: #f2f2f2;
    padding: 15px;
    font-size: 1.6em;
    background-color: rgb(67, 67, 216);
}

.createEventButton {
    color: #242429;
    background-color: #D7D7D7;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: #D7D7D7 solid 2px;
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
    margin: 50px auto;
    padding-right: 15px;
    width: 45%
}

.mapLeaflet {
    width: 70%;
    margin-top: 25px;
}
</style>
