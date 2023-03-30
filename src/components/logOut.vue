<template>
    <div class="container" style="margin-top: 3em;">
        <div class="d-flex justify-content-center h-100">
            <h1>Vous êtes maintenant déconnecté</h1>
        </div>
    </div>
</template>
<script>

export default {
    name: 'LogOut',

    mounted: function () {
        this.$store.commit('logout')
        this.$router.push('/')
    },

}
</script>

  
  