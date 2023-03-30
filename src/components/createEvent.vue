<template>
    <form @submit.prevent="submitForm">
        <label>
            Adresse:
            <input type="adress" id="adress" name="adress" v-model="adress" required>
            <div v-if="adressError" class="error-message">{{ adressError }}</div>

        </label>
        <label>
            Date:
            <input type="date" id="date" name="date" v-model="date" required>
            <div v-if="dateError" class="error-message">{{ dateError }}</div>
        </label>
        <button type="submit">Enregistrer</button>
        <p v-if="error">{{ error }}</p>
    </form>
</template>
<script>
import axios from "axios";

export default {
    name: 'signin',
    data() {
        return {
            adress: '',
            date: '',
            adressError: '',
            dateError: '',
            error: ''
        }
    },
    methods: {
        submitForm() {
            axios.post("http://localhost:19100/events/create", {
                id_user: this.$store.state.id,
                adress: this.adress,
                date_event: this.date,
            }).then(
                (response) => {
                    if (response.status === 201) {


                    }
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                    this.error = "Une erreur est survenu lors de la création d'un evenement";
                }
            );
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
    }
}
</script>