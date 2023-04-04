<template>
    <div>
        <h1>Page d'inscription</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" v-model="email" required>
                <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>
            <div>
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" name="password" v-model="password" required>
                <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </div>
            <div>
                <label for="address">Adresse:</label>
                <input type="text" id="address" name="address" v-model="address" required>
                <div v-if="addressError" class="error-message">{{ addressError }}</div>
            </div>
            <div>
                <label for="phone">Numéro de téléphone:</label>
                <input type="tel" id="phone" name="phone" v-model="phone" required>
                <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
            </div>
            <div>
                <label for="nickname">Surnom:</label>
                <input type="text" id="nickname" name="nickname" v-model="nickname" required>
                <div v-if="nicknameError" class="error-message">{{ nicknameError }}</div>
            </div>
            <button type="submit">S'inscrire</button>
        </form>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'signup',
    data() {
        return {
            email: '',
            password: '',
            address: '',
            phone: '',
            nickname: '',
            emailError: '',
            passwordError: '',
            addressError: '',
            phoneError: '',
            nicknameError: '',
        }
    },
    methods: {
        submitForm() {
            // Vérifications d'erreur
            this.emailError = this.validateEmail(this.email)
            this.passwordError = this.validatePassword(this.password)
            this.addressError = this.validateAddress(this.address)
            this.phoneError = this.validatePhone(this.phone)
            this.nicknameError = this.validateNickname(this.nickname)

            // Vérifications de sécurité
            if (this.emailError || this.passwordError || this.addressError || this.phoneError || this.nicknameError) {
                return
            }

            axios.post("http://localhost:19102/users/create", {
                firstname: this.nickname,
                email: this.email,
                password: this.password,
                tel_number: this.phone
            }).then(
                (response) => {
                    if (response.status === 201) {
                        this.$router.push('/signin')
                    }
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                    this.error = true;
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
            } else if (password.length < 8) {

                return 'Le mot de passe doit comporter au moins 8 caractères.'
            }
            return ''
        },
        validateAddress(address) {
            if (!address) {
                return 'Veuillez entrer une adresse.'
            }
            return ''
        },
        validatePhone(phone) {
            if (!phone) {
                return 'Veuillez entrer un numéro de téléphone.'
            } else if (!/^\d{10}$/.test(phone)) {
                return 'Veuillez entrer un numéro de téléphone valide.'
            }
            return ''
        },
        validateNickname(nickname) {
            if (!nickname) {
                return 'Veuillez entrer un surnom.'
            } else if (nickname.length > 20) {
                return 'Le surnom ne doit pas dépasser 20 caractères.'
            }
            return ''
        }
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