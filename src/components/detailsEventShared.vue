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
    </div>

    <div class="commentaires">

        <h1>Commentaires</h1>
        <div class="no-participant" v-if="coms.length === 0">
            Aucun commentaire n'a été posté pour l'instant
        </div>
        <div v-else>
            <div v-for="(commentaire, index) in coms" :key="commentaire.id" class="commentaire">
                <span class="com-user">{{ commentaire.username[0].firstname }}</span><br>
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

export default {
    name: 'homePage',
    components: {},
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
        }
    },
    methods: {


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
        getComs() {
            axios.get(`http://localhost:19100/commentaires/${this.$route.params.id_event}`)
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
    },
    mounted() {
        this.getEvents()
        this.getParticipants()
        this.getComs()

    },
}
</script>

