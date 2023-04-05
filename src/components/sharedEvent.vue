<template>
    <h1>Formulaire d'inscription à l'événement</h1>
    <div class="detail-event">
        <h1>{{ events.title }}</h1>
        <div class="detail-event-info">
            <span class="detail-date">Date de l'évenement : <b>{{ this.getDate() }}</b></span>
            <br>
            <span class="detail-address">Adresse : <b>{{ events.address }}</b></span>
            <span class="detail-creater">{{ events.username }}</span>
        </div>
    </div>
    <form @submit.prevent="submitForm">
        <label>
            Nom:
            <input type="text" id="nom" name="nom" v-model="nom" required>
            <div v-if="nomError" class="error-message">{{ nomError }}</div>

        </label>
        <label>
            Prénom:
            <input type="text" id="prenom" name="prenom" v-model="prenom" required>
            <div v-if="prenomError" class="error-message">{{ prenomError }}</div>

        </label>
        <label>
            Numéro Tel:
            <input type="text" id="telephone" name="telephone" v-model="telephone" required>
            <div v-if="telephoneError" class="error-message">{{ telephoneError }}</div>
        </label>
        <label>
            commentaire:
            <input type="text" id="comment" name="comment" v-model="comment" required>
            <div v-if="commentError" class="error-message">{{ commentError }}</div>
        </label>
        <label>
            Présence:
            <select name="presence" id="presence" v-model="selected">
                <option disabled value="" selected>Selectionnez une option</option>
                <option>present</option>
                <option>missing</option>
            </select>
            <div v-if="presenceError" class="error-message">{{ presenceError }}</div>
        </label>
        <button type="submit">Enregistrer</button>
        <p v-if="error">{{ error }}</p>
    </form>
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
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'homePage',
    components: {},
    data() {
        return {
            nom: '',
            prenom: '',
            telephone: '',
            comment: '',
            selected: '',
            nomError: '',
            prenomError: '',
            telephoneError: '',
            commentError: '',
            presenceError: '',
            error: '',
            id_event: '',
            shared_url: this.$route.params.id,
            events: '',
            participants: '',
            urlperso: '',
        }
    },
    methods: {
        submitForm() {
            this.nomError = this.validatenom(this.nom)
            this.prenomError = this.validateprenom(this.prenom)
            this.telephoneError = this.validatetelephone(this.telephone)
            this.commentError = this.validatecomment(this.comment)
            this.presenceError = this.validatepresence(this.selected)

            // Vérifications de sécurité
            if (this.nomError || this.prenomError || this.telephoneError || this.commentError || this.presenceError) {
                return
            }

            axios.get("http://localhost:19100/events/shared/" + this.shared_url).then(
                (response) => {
                    axios.post("http://localhost:19100/participants/create", {
                        name: this.nom,
                        firstname: this.prenom,
                        tel_number: this.telephone,
                        state: this.selected,
                        comment: this.comment,
                        id_event: response.data.id_event,
                    }).then(
                        (response) => {
                            if (response.status === 201) {
                                this.getParticipants();


                                this.urlperso = `http://localhost:5173/shared/${this.$route.params.id}/${this.$route.params.id_event}`
                            }
                        },
                        (error) => {
                            this.error = error.response.data.message
                        }
                    )
                },
                (error) => {
                    this.error = error.response.data.message
                }
            )


        },
        validatenom(nom) {
            if (nom.length < 3) {
                return 'Le nom doit contenir au moins 3 caractères'
            }
            return ''
        },
        validateprenom(prenom) {
            if (prenom.length < 3) {
                return 'Le prénom doit contenir au moins 3 caractères'
            }
            return ''
        },
        validatetelephone(telephone) {
            if (telephone.length < 10) {
                return 'Le numéro de téléphone doit contenir au moins 10 caractères'
            }
            return ''
        },
        validatecomment(comment) {
            if (comment.length < 3) {
                return 'L\'adresse doit contenir au moins 3 caractères'
            }
            return ''
        },
        validatepresence(selected) {
            if (selected.length < 1) {
                return 'Vous devez selectionner une option'
            }
            return ''
        },
        getEvents() {
            axios.get(`http://localhost:19100/events/${this.$route.params.id_event}`)
                .then(response => {
                    console.log(response.data)
                    this.events = response.data;
                    this.address = response.data.address;
                    console.log(this.events)
                    //this.setMarker();

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
            axios.get(`http://localhost:19100/participants/getParticipants/${this.$route.params.id_event}`)
                .then(response => {
                    console.log(response)
                    this.participants = response.data.participants;
                    console.log(this.participants)
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    mounted() {
        this.getEvents()
        this.getParticipants()

    },
}
</script>

