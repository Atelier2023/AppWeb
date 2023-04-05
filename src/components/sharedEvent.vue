<template>
    <nav class="nav-event">
        <router-link to="/homePage" class="onPage">Formulaire</router-link>
    </nav>
    <div class="detail-event">
        <h1>{{ events.title }}</h1>
        <div class="detail-event-info">
            <span class="detail-date">Date de l'évenement : <b>{{ this.getDate() }}</b></span>
            <br>
            <span class="detail-address">Adresse : <b>{{ events.address }}</b></span>
            <span class="detail-creater">{{ events.username }}</span>
        </div>
    </div>
<<<<<<< HEAD
    <div class="shared-container">
        <form @submit.prevent="submitForm">
            <h1>Formulaire</h1>
            <label>
                Nom: <br>
                <input type="text" id="nom" name="nom" v-model="nom" required>
                <div v-if="nomError" class="error-message">{{ nomError }}</div>

            </label><br>
            <label>
                Prénom:<br>
                <input type="text" id="prenom" name="prenom" v-model="prenom" required>
                <div v-if="prenomError" class="error-message">{{ prenomError }}</div>

            </label><br>
            <label><br>
                Email:<br>
                <input type="text" id="email" name="email" v-model="email" required>
                <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </label><br>
            <label>
                Numéro Tel:<br>
                <input type="text" id="telephone" name="telephone" v-model="telephone" required>
                <div v-if="telephoneError" class="error-message">{{ telephoneError }}</div>
            </label><br>
            <label>
                commentaire:<br>
                <input type="text" id="comment" name="comment" v-model="comment" required>
                <div v-if="commentError" class="error-message">{{ commentError }}</div>
            </label><br>
            <label>
                Présence:<br>
                <select name="presence" id="presence" v-model="selected">
                    <option disabled value="" selected>Selectionnez une option</option>
                    <option>present</option>
                    <option>missing</option>
                </select>
                <div v-if="presenceError" class="error-message">{{ presenceError }}</div>
            </label><br>
            <button type="submit" class="buttonLog">Enregistrer</button>
            <p v-if="error">{{ error }}</p>
        </form>
        <label id="urlperso">{{ urlperso }}</label>
            <div class="shared-participants">
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
=======
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
            Email:
            <input type="text" id="email" name="email" v-model="email" required>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
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
>>>>>>> ee0a4e177a08ebd8653e7c9dcc09aa94fb169358
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
            email: '',
            prenomError: '',
            telephoneError: '',
            commentError: '',
            presenceError: '',
            emailError: '',
            error: '',
            id_event: '',
            shared_url: this.$route.params.id,
            events: '',
            participants: '',
            urlperso: '',
            id_participant: '',
        }
    },
    methods: {
        submitForm() {
            this.nomError = this.validatenom(this.nom)
            this.prenomError = this.validateprenom(this.prenom)
            this.telephoneError = this.validatetelephone(this.telephone)
            this.commentError = this.validatecomment(this.comment)
            this.presenceError = this.validatepresence(this.selected)
            this.emailError = this.validatepresence(this.email)


            // Vérifications de sécurité
            if (this.nomError || this.prenomError || this.telephoneError || this.commentError || this.presenceError || this.emailError) {
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
                        email: this.email,
                        id_event: response.data.id_event,
                    }).then(
                        (response) => {
                            if (response.status === 201) {
                                this.getParticipants();
                                axios.post("http://localhost:19100/participants/idparticipant", {
                                    email: this.email,
                                    id_event: this.$route.params.id_event
                                }).then(
                                    (response) => {
                                        if (response.status === 200) {
                                            console.log(response.data[0].id_participant)
                                            // this.id_participant = response.data[0].id_participant
                                            this.urlperso = `http://localhost:5173/shared/${this.$route.params.id}/${this.$route.params.id_event}/${response.data[0].id_participant}`

                                        }
                                    },
                                    (error) => {
                                        console.log(error);
                                        this.error = true;
                                    }
                                );
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
                    this.events = response.data;
                    this.address = response.data.address;

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
                    this.participants = response.data.participants;
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

<style>
.shared-container {
    display: flex;
    justify-content: center;
}
.shared-container form {
    justify-content: center;
    text-align: center;
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 40px;
    height: 400px;
    width: 250px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

}

.shared-participants {
    display: flex;
    width:60%;
    flex-direction: column;
    margin: 20px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.shared-participants h1 {
    border: 1px solid black;
    color: #f2f2f2;
    padding: 15px;
    font-size: 1.6em;
    background-color: rgb(67, 67, 216);

}
</style>


