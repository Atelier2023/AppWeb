<template>
    <router-link to="/homePage">Page d'accueil</router-link>
    <h1>shared URL</h1>

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
            Adresse:
            <input type="text" id="address" name="address" v-model="address" required>
            <div v-if="addressError" class="error-message">{{ addressError }}</div>
        </label>
        <label>
            Présence:
            <select name="presence" id="presence" v-model="selected">
                <option disabled value="">Selectionnez une option</option>
                <option>present</option>
                <option>missing</option>
                <option>not answered</option>
            </select>
            <div v-if="presenceError" class="error-message">{{ presenceError }}</div>
        </label>
        <button type="submit">Enregistrer</button>
        <p v-if="error">{{ error }}</p>
    </form>

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
            address: '',
            selected: '',
            nomError: '',
            prenomError: '',
            telephoneError: '',
            addressError: '',
            presenceError: '',
            error: '',
            id_event:'',
            shared_url: this.$route.params.id
        }
    },
    methods: {
        submitForm() {
            this.nomError = this.validatenom(this.nom)
            this.prenomError = this.validateprenom(this.prenom)
            this.telephoneError = this.validatetelephone(this.telephone)
            this.addressError = this.validateaddress(this.address)
            this.presenceError = this.validatepresence(this.selected)

            // Vérifications de sécurité
            if (this.nomError || this.prenomError || this.telephoneError || this.addressError || this.presenceError) {
                return
            }

            axios.get("http://localhost:19100/events/shared/" + this.shared_url).then(
                (response) => {
                    axios.post("http://localhost:19100/participants/create", {
                    name: this.nom,
                    firstname: this.prenom,
                    tel_number: this.telephone,
                    state: this.selected,
                    id_event: response.data.id_event,
                }).then(
                (response) => {
                    if (response.status === 201) {
                        this.$router.push('/homePage')
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
        validateaddress(address) {
            if (address.length < 3) {
                return 'L\'adresse doit contenir au moins 3 caractères'
            }
            return ''
        },
        validatepresence(selected) {
            if (selected.length < 1) {
                return 'Vous devez selectionner une option'
            }
            return ''
        }
    }

}
</script>

