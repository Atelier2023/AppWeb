<template>
    <router-link to="/homePage">Page d'accueil</router-link>
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
  
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
}

nav {
    display: flex;
    justify-content: center;
}

nav a {
    font-size: 1.2rem;
    padding: 1rem;
    text-decoration: none;
    color: #2c3e50;
}

nav a:hover {
    color: lightgrey;
}
</style>