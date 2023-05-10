<template>
    <div class="container-connexion">
        <h1>Connexion</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label>
                    Email:<br>
                    <input type="email" id="email" name="email" v-model="email" required>
                    <div v-if="emailError" class="error-message">{{ emailError }}</div>

                </label>
            </div>
            <div>
                <label>
                    Mot de passe:<br>
                    <input type="password" id="password" name="password" v-model="password" required>
                    <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
                </label>
            </div>
            <button type="submit" class="buttonLog">Se connecter</button>
            <p v-if="error" class="error-message">{{ error }}</p>
        </form>
    </div>
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

            axios.post("http://localhost:19106/users/signin", {

            }, {
                auth: {
                    username: this.email,
                    password: this.password
                }
            }).then(
                (response) => {
                    if (response.status === 200) {
                        this.$store.state.authenticated = true;
                        this.$store.state.id = response.data.id_user;
                        this.$store.state.email = response.data.email;
                        this.$store.state.username = response.data.user;
                        this.$store.state.tel_number = response.data.tel;
                        this.$store.state.token = response.data.accesstoken;
                        this.$store.commit('login')
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
body {
    background-color: #D7D7D7
}

.container-connexion {
    justify-content: center;
    text-align: center;
    margin: 100px auto;
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 40px;
    height: 250px;
    width: 250px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.container-connexion h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: hsl(0, 0%, 8%);
}

form {
    display: block;
}

form div {
    margin-top: 20px;
}

.buttonLog {
    border: 1px solid #F0F2F5;
    border-radius: 5px;
    color: #000000;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 35px 0 10px 0;
    cursor: pointer;
    background-color: rgb(112, 112, 201);
    color: #ebebeb;
}

.buttonLog:hover {
    background-color: rgb(68, 68, 218);
    color: #ebebeb;
}

.error-message {
    color: red;
    font-size: 0.8rem;
}
</style>