<template>
    <h1>Page de connexion</h1>

    <form @submit.prevent="submitForm">
        <label>
            Email:
            <input type="email" id="email" name="email" v-model="email" required>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>

        </label>
        <label>
            Mot de passe:
            <input type="password" id="password" name="password" v-model="password" required>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </label>
        <button type="submit">Se connecter</button>
        <p v-if="error">{{ error }}</p>
    </form>
</template>
  
<script>
import axios from "axios";

export default {
    name: 'signin',
    data() {
        return {
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            error: ''
        }
    },
    methods: {
        submitForm() {


            this.emailError = this.validateEmail(this.email)
            this.passwordError = this.validatePassword(this.password)

            // Vérifications de sécurité
            if (this.emailError || this.passwordError) {
                return
            }

            axios.post("http://localhost:19102/users/signin", {

            }, {
                auth: {
                    username: this.email,
                    password: this.password
                }
            }).then(
                (response) => {
                    if (response.status === 201) {
                        this.$store.state.authenticated = true;
                        this.$store.state.id = response.data.id_user;
                        this.$store.state.email = response.data.email;
                        this.$store.state.username = response.data.user;
                        this.$store.state.tel_number = response.data.tel;
                        this.$store.state.token = response.data.accesstoken;
                        this.$router.push('/homePage')

                    }
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                    this.error = "Une erreur est survenu lors de la connexion";
                }
            );
        },
        validateEmail(email) {
            if (!email) {
                return 'Veuillez entrer une adresse e-mail.'
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                return 'Veuillez entrer une adresse e-mail valide.'
            }
            return ''
        },
        validatePassword(password) {
            if (!password) {
                return 'Veuillez entrer un mot de passe.'
            }
            return ''
        },
    }
}
</script>
  
<style scoped>
label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    width: 25%;
    font-size: 1rem;
}

.error-message {
    color: red;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}

button[type="submit"] {
    background-color: #008000;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #006400;
}
</style>