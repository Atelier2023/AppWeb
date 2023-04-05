<template>
    <nav class="nav-event">
        <router-link to="/homePage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent" class="onPage createEventButton">Créer un
            évenement</button>
    </nav>

    <div class="container-createpage">
        <div class="createEvent">
            <h2>Créer un événement</h2>
            <form @submit.prevent="submitForm">
                <label>
                    Titre: <br>
                    <input type="title" id="title" name="title" v-model="title" required><br>
                    <div v-if="titleError" class="error-message">{{ titleError }}</div>

                </label>
                <label>
                    Adresse:<br>
                    <input type="adress" id="adress" name="adress" v-model="adress" required><br>
                    <div v-if="adressError" class="error-message">{{ adressError }}</div>

                </label>
                <label>
                    Date:<br>
                    <input style="margin-bottom: 0px;" type="date" id="date" name="date" v-model="date" required><br>
                    <div v-if="dateError" class="error-message">{{ dateError }}</div>
                </label>
                <button class="buttonLog" type="submit">Ajouter</button>
                <p v-if="error">{{ error }}</p>
            </form>
        </div>
        <l-map ref="map" style="margin-right: 50px; height:600px" @ready="getAddress" :use-global-leaflet="false" v-model:zoom="zoom"
            :center="[48.691673232896015, 6.182424175083767]">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <l-marker ref="marker" :lat-lng="[this.lat, this.long]">
                <l-popup>
                    <span>{{ this.adressPopup }}</span>
                </l-popup>
            </l-marker>
        </l-map>
    </div>
</template>
<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";


export default {
    name: 'signin',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup
    },

    data() {
        return {
            title: '',
            adress: '',
            date: '',
            titleError: '',
            adressError: '',
            dateError: '',
            error: '',
            zoom: 14,
            apiKey: '262e66a1a59d85f290a21363615184fa',
            adressPopup: '',
            lat: '',
            long: ''
        }
    },
    methods: {
        getAddress(map) { // Onclick sur la map, récupère l'adresse et l'affiche dans le popup et dans le champ adresse
            map.on('click', (e) => {
                axios.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&format=jsonv2`)
                    .then((response) => {
                        let numero
                        if (response.data.address.house_number) { 
                            numero = response.data.address.house_number
                        }
                        else {
                            numero = ""
                        }
                        let adressReturn = numero + " " + response.data.address.road + ", " + response.data.address.municipality + ", " + response.data.address.country
                        this.adress = adressReturn
                        console.log(this.adress)
                        this.adressPopup = adressReturn
                        this.lat = e.latlng.lat
                        this.long = e.latlng.lng
                        this.$refs.marker.leafletObject.openPopup()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
        },
        submitForm() {
            this.dateError = this.validatedate(this.date)
            this.titleError = this.validatetitle(this.title)
            this.addressError = this.validateadress(this.address)

            // Vérifications de sécurité
            if (this.dateError || this.titleError || this.adressError) {
                return
            }

            axios.post("http://localhost:19106/events/create", {
                id_user: this.$store.state.id,
                title: this.title,
                address: this.adress,
                date_event: this.date,
            }).then(
                (response) => {
                    if (response.status === 200) {
                        this.$router.push('/homePage')
                    }
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                    this.error = "Une erreur est survenu lors de la création d'un événement";
                }
            );
        },

        validatetitle(title) {
            if (!title) {
                return 'Veuillez entrer une titre.'
            }
            return ''
        },
        validateadress(adress) {
            if (!adress) {
                return 'Veuillez entrer une adresse .'
            }
            return ''
        },
        validatedate(date) {
            if (!date) {
                return 'Veuillez entrer une date.'
            }
            return ''
        },

    },
    mounted() {
    }
}
</script>

<style>
.container-createpage {
    display: flex;
    height: 700px;
    margin-top: 50px;
}

.createEvent {
    margin: 75px 100px 25px 50px;
    padding-right: 15px;
    height: 60%;
    overflow: auto;
    width: 30%;
    background-color: #FFFFFF;
    border-radius: 10px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.createEvent form {
    text-align: center;
}

.createEvent h2 {
    margin-bottom: 25px;
    margin-top: 25px;
    text-align: center;
}

.createEvent input:nth-child(n + 1) {
    margin-bottom: 25px;
    width: 50%;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
</style>