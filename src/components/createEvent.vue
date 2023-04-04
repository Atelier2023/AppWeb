<template>
    <nav class="nav-event">
        <router-link to="/homePage">Mes événements</router-link>
        <button v-if="this.$store.state.authenticated" @click="createEvent"  class="onPage createEventButton">Créer un évenement</button>
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

    </div>
    <div style="height:600px; width:1000px">
        <l-map ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
        <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
        ></l-tile-layer>
        </l-map>
    </div>
</template>
<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";


export default {
    name: 'signin',
    components: {
        LMap,
        LTileLayer,
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
            zoom:2,

        }
    },
    methods: {
        submitForm() {
            this.dateError = this.validatedate(this.date)
            this.titleError = this.validatetitle(this.title)
            this.addressError = this.validateadress(this.address)

            // Vérifications de sécurité
            if (this.dateError || this.titleError || this.adressError) {
                return
            }

            axios.post("http://localhost:19100/events/create", {
                id_user: this.$store.state.id,
                title: this.title,
                address: this.adress,
                date_event: this.date,
            }).then(
                (response) => {
                    if (response.status === 201) {
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
}

.createEvent {
    margin: 25px ;
    padding-right: 15px;
    max-height: 750px;
    overflow: auto;
    width:45%
}

.createEvent form {
    text-align: center;
}
.createEvent h2 {
    margin-bottom: 25px;
    text-align: center;
}

.createEvent input:nth-child(n + 1) {
    margin-bottom: 25px;
    width: 30%;
}
</style>