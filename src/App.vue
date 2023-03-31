

<template>
  <nav>

  </nav>




  <router-view></router-view>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  components: {},
  data() {
    return {
    }
  },
  methods: {

  },
  mounted() {
    this.$router.push('/homePage')
  },
  computed: {

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
