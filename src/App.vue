<template>
  <div id="app">
    <div class="container">
      <folderComponent
        @folder-selected="updateSelectedFolder"
      ></folderComponent>
      <tagComponent></tagComponent>
      <centerComponent :selectedFolder="selectedFolder"></centerComponent>
      <apercuFileComponent></apercuFileComponent>
    </div>
  </div>
</template>

<script>
import folderComponent from "./components/folderComponent.vue";
import tagComponent from "./components/tagComponent.vue";
import centerComponent from "./components/centerComponent.vue";
import apercuFileComponent from "./components/ApercuFileComponent.vue";
export default {
  name: "App",
  components: {
    tagComponent,
    folderComponent,
    centerComponent,
    apercuFileComponent,
  },
  data() {
    return {
      selectedFolder: "",
    };
  },
  methods: {
    updateSelectedFolder(folder) {
      this.selectedFolder = folder;
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
}

* {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
body {
  font-family: Helvetica;
  -webkit-font-smoothing: antialiased;
}
</style>
