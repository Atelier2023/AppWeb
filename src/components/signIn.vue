<template>
    <form @submit.prevent="handleSubmit">
        <label>
            Email:
            <input type="email" v-model="email" required>
        </label>
        <label>
            Mot de passe:
            <input type="password" v-model="password" required>
        </label>
        <button type="submit">Se connecter</button>
        <p v-if="error">{{ error }}</p>
    </form>
</template>
  
<script>
export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        handleSubmit() {
            // Vérification d'injection de code
            const regex = /<[^>]*>?/gm;
            if (regex.test(this.email) || regex.test(this.password)) {
                this.error = 'Les caractères spéciaux ne sont pas autorisés.';
                return;
            }

            // Gestion d'erreur
            if (this.email !== 'monemail@exemple.com' || this.password !== 'monmotdepasse') {
                this.error = 'Email ou mot de passe incorrect.';
                return;
            }

            // Connexion réussie
            this.error = '';
        }
    }
}
</script>
  