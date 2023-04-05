<template>
    <nav class="nav-event">
        <router-link to="/homePage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent" class="onPage createEventButton">Créer un
            évenement</button>
    </nav>

    <div class="detail-event">
        <h1>{{ events.title }}</h1>
        <div class="detail-event-info">
            <span class="detail-date">Date de l'évenement : <b>{{ events.date_event }}</b></span>
            &nbsp;
            <br>
            <span class="detail-address">Adresse : <b>{{ events.address }}</b></span>
            <span class="detail-creater">{{ events.username }}</span>
        </div>
    </div>
    <div class="container-onevent">
        <div class="left-container">
            <h1>Participants</h1>
            <div class="participants">
                <div v-for="(participant, index) in participants" :key="participant.id" class="participant">
                    <div class="part-top">
                        <span class="part-name">{{ participant.participants.name }}</span>
                        <span class="part-firstname">{{ participant.participants.firstname }}</span>
                        <span class="part-tel">{{ participant.participants.state }}</span>
                    </div>
                    <div class="part-bot">
                        <span class="part-state">{{ participant.participants.tel_number }}</span>
                    </div>
                </div>
            </div>
            <div class="partage">
                <h3>Lien de partage :</h3>
                <a :href="'http://localhost:5173/shared/' + events.shared_url">http://localhost:5173/shared/{{
                    events.shared_url }}</a>
            </div>
        </div>
        <div style="height:750px; width:1050px" class="mapLeaflet">
            <l-map ref="map" :use-global-leaflet="false" v-model:zoom="zoom" :center="[this.lat, this.long]">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap"></l-tile-layer>
                <l-marker :lat-lng="[this.lat, this.long]">
                    <l-popup style="text-align: center;">
                        <h2>{{ events.title }}</h2>
                        <span><i>{{ events.date_event.substring(0, 10) }}</i></span>
                        <p>{{ events.address }}</p>
                    </l-popup>
                </l-marker>
            </l-map>
        </div>
    </div>

    <div class="commentaires">

        <h1>Commentaires</h1>

        <div v-for="(commentaire, index) in coms" :key="commentaire.id" class="commentaire">
            <span class="com-user">{{ commentaire.username[0].firstname }}</span><br>
            <span class="com-date"><i>{{ commentaire.date.substring(0, 10) }}</i></span><br>
            <span class="com-com">{{ commentaire.commentaire }}</span>
        </div>

        <div class="form-com">
            <form @submit.prevent="addCom">
                <div>
                    <textarea name="com" id="com" v-model="com" cols="205" rows="10" required></textarea>
                </div>
                <button type="submit" class="buttonLog">Publier</button>
            </form>
        </div>

    </div>


    <router-view></router-view>
</template>

<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LMarker } from "@vue-leaflet/vue-leaflet";


export default {
    name: 'homePage',
    components: {
        LMap,
        LTileLayer,
        LPopup,
        LMarker
    },
    data() {
        return {
            events: '',
            user: '',
            com: '',
            coms: '',
            participants: '',
            username: '',
            address: '',
            zoom: 15,
            apiKey: '262e66a1a59d85f290a21363615184fa',
            lat: '45',
            long: '1',
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
                    console.log(response.data)
                    this.events = response.data;
                    this.address = response.data.address;
                    console.log(this.events)
                    this.setMarker();

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
        /* goToSharedURL(id) {
            this.$router.push(`/shared/${id}`)
        }, */
        setMarker() {
            console.log(this.events.address)
            //axios.get(`http://api.positionstack.com/v1/forward?access_key=${this.apiKey}&query=${this.events.address}`)
            axios.get(`https://nominatim.openstreetmap.org/search.php?q=${this.events.address}&format=jsonv2`)
                .then((response) => {
                    console.log(this.events.address)
                    console.log((response.data[0].lat + " " + response.data[0].lon))
                    this.lat = response.data[0].lat;
                    this.long = response.data[0].lon;
                })
                .catch((error) => {
                    console.log(error)
                })
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

.detail-event {
    margin: 20px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.detail-event h1 {
    border: 1px solid black;
    color: #f2f2f2;
    padding: 15px;
    font-size: 1.6em;
    background-color: rgb(67, 67, 216);
}

.detail-event-info {
    padding: 30px;
}

.container-onevent {
    display: flex;
    margin-top: 50px;
}

.left-container {
    width: 40%;
    display: flex;
    flex-direction: column;
    margin: 20px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.left-container h1 {
    border: 1px solid black;
    color: #f2f2f2;
    padding: 15px;
    font-size: 1.6em;
    background-color: rgb(67, 67, 216);
}

.participants {
    margin: 15px;
}

.participant {
    border-bottom: 1px solid black;
    padding: 5px 0 5px 0;
    margin: 15px;
}

.part-name,
.part-firstname {
    margin-right: 5px;
    margin-bottom: 5px;
}

.part-tel {
    float: right
}

.part-state {
    margin-bottom: 10px;
}

.part-bot {
    margin-top: 5px;
}

.partage {
    float: bottom;
    text-align: center;
    margin-bottom: 5%;
}

.commentaires {
    margin: 20px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.commentaire {
    border-bottom: 1px solid black;
    padding: 5px 0 5px 0;
    margin: 25px;
}

.com-user {
    font-size: 1.6em;
    font-weight: 600;
}

.com-date {
    font-size: 0.9em;
}

.com-com {
    font-size: 1.2em;
}

.commentaires h1 {
    border: 1px solid black;
    color: #f2f2f2;
    padding: 15px;
    font-size: 1.6em;
    background-color: rgb(67, 67, 216);
}

.commentaires form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

textarea {
    width: 100%;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #838383;
}
</style>


