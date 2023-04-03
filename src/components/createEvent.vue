<template>
    <router-link to="/homePage">Page d'accueil</router-link>

    <form @submit.prevent="submitForm">
        <label>
            Titre:
            <input type="title" id="title" name="title" v-model="title" required>
            <div v-if="titleError" class="error-message">{{ titleError }}</div>

        </label>
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
            title: '',
            adress: '',
            date: '',
            titleError: '',
            adressError: '',
            dateError: '',
            error: ''
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
    }
}
</script>