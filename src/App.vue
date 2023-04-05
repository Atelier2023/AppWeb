

<template>
  <nav class="global-nav" v-if="!this.$store.state.authenticated">
    <div class="reunionou">
      <router-link to="/homePage">Réunionou</router-link>
    </div>
    <div  class="items-nav">
      <router-link to="/signin" id="connect">Connexion</router-link>
      <router-link to="/signup">Inscription</router-link>
    </div>
  </nav>

  <nav class="global-nav" v-if="this.$store.state.authenticated">
    <div class="reunionou">
      <router-link to="/homePage">Réunionou</router-link>
    </div>
    <div class="item-nav">
      <router-link to="/signin">Mon compte</router-link>
      <router-link to="/logout" id="disconnect"><img src="shutdown.png" alt="disconnect img" title="Se déconnecter" id="disconnect-img"></router-link>
    </div>
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
      loggin:false
    }
  },
  methods: {
    
  },
  computed: {
    isLoggin() {
      axios.get('http://localhost:19102/users/validate', {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`
        }
      }).then(
        (response) => {
            if (response.status === 200) {
              console.log("loggin")
              this.loggin = true;
            } else {
              console.log("not loggin")
              this.loggin = false;
            }
        });
    }
  },
  
}
</script>

<style>
* {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin:0;
  padding: 0;
  
}

.reunionou {
  font-size: 2em;
  font-weight: bold;
  padding: 1rem;
  text-decoration: none;
  color: #ebebeb;
  margin-left: 15px;
  width: 95%;
}

.items-nav {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1rem;
  text-decoration: none;
  color: #D7D7D7;
  padding-top: 25px;
  width: 25%;
}
.item-nav {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1rem;
  text-decoration: none;
  color: #ebebeb;
  padding-top: 25px;
  width: 15%;
}

#disconnect-img {
  width: 18px;
  height: 18px;
  cursor: pointer;
  vertical-align: -3px;
}
#disconnect {
  padding : 0;
}

#connect {
  margin-right: 25px;
  width: 150px;
}

nav {
  background-color: rgb(67, 67, 216);
  display: flex;
}

nav a {
  padding: 1rem;
  text-decoration: none;
  color: #ebebeb;
}

.global-nav a:hover {
  color: lightgrey;
}

body {
  background-color: #D7D7D7;
}
</style>
