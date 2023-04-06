<template>
    <div class="detail-event">
        <h1>{{ events.title }}</h1>
        <div class="detail-event-info">
            <span class="detail-date">Date de l'évenement : <b>{{ this.getDate() }}</b></span>
            <br>
            <span class="detail-address">Adresse : <b>{{ events.address }}</b></span>
            <span class="detail-creater">{{ events.username }}</span>
        </div>
    </div>

    <label id="urlperso">{{ urlperso }}</label>
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
                        &nbsp; <br>
                        <span class="part-state">{{ participant.participants.comment }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="height:750px; width:1050px; margin-right: 15px;;" class="mapLeaflet">
            <l-map ref="map" :use-global-leaflet="false" v-model:zoom="zoom" :center="[this.lat, this.long]">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap"></l-tile-layer>
                <l-marker ref="markerShared" :lat-lng="[this.lat, this.long]">
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
        <div class="no-participant" v-if="coms.length === 0">
            Aucun commentaire n'a été posté pour l'instant
        </div>
        <div v-else>
            <div v-for="(commentaire, index) in coms" :key="commentaire.id" class="commentaire">
                <span><b> Participant</b></span><br>
                <span class="com-date"><i>{{ commentaire.date.substring(0, 10) }}</i></span><br>
                <span class="com-com">{{ commentaire.commentaire }}</span>
            </div>
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
            error: '',
            id_event: '',
            shared_url: this.$route.params.id,
            events: '',
            participants: '',
            urlperso: '',
            id_participant: '',
            com: '',
            coms: '',
            lat: '',
            long: '',
            zoom: 15,
        }
    },
    methods: {


        getEvents() {
            axios.get(`http://localhost:19106/events/${this.$route.params.id_event}`)
                .then(response => {
                    this.events = response.data;
                    this.address = response.data.address;
                    this.setMarker();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getDate() {
            const date = new Date(this.events.date_event);
            return date.toLocaleDateString("fr");
        },
        getParticipants() {
            axios.get(`http://localhost:19106/participants/getParticipants/${this.$route.params.id_event}`)
                .then(response => {
                    this.participants = response.data.participants;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        setMarker() {
            axios.get(`https://nominatim.openstreetmap.org/search.php?q=${this.events.address}&format=jsonv2`)
                .then((response) => {
                    this.lat = response.data[0].lat;
                    this.long = response.data[0].lon;
                    this.$refs.markerShared.leafletObject.openPopup()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        addCom() {

            const current = new Date();
            const date = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}`;
            axios.post("http://localhost:19106/commentaires/create", {
                commentaire: this.com,
                id_user: this.$route.params.id_participant,
                id_event: this.$route.params.id_event,
                date: date
            }).then(
                (response) => {
                    if (response.status === 200) {
                        this.getComs()
                        this.com = ''
                    }
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                }
            );
        },
        getComs() {
            axios.get(`http://localhost:19106/commentaires/${this.$route.params.id_event}`)
                .then(response => {
                    this.coms = response.data.comments;
                    this.coms.forEach(com => {
                        /* axios.get(`http://localhost:19102/users/getUser/${com.id_user}`)
                            .then(response => {
                                com.username = response.data;
                            })
                            .catch(error => {
                                console.log(error);
                            }); */
                        /* axios.get(`http://localhost:19100/participants/getParticipant/${com.id_user}`)
                            .then(response => {
                                com.username = response.data;
                            })
                        console.log(response)
                            .catch(error => {
                                console.log(error);
                            }); */
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        },

    },
    mounted() {
        this.getEvents()
        this.getParticipants()
        this.getComs()

    },
}
</script>

