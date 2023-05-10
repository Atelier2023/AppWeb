<template>
  <div class="left-panelB">
    <!-- Contenu panneau gauche Tag -->
    <div v-if="tagButton" class="Tag" style="bottom: 55px">
      <h1>Tag</h1>
      <div class="search-container">
        <input type="text" id="searchTagBar" placeholder="Recherche..." />
      </div>
      <div class="tag-list">
        <ul>
          <li
            v-for="(tag, index) in tags"
            :key="index"
            draggable="true"
            @dragstart="dragStartHandler"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "tagComponent",
  components: {},
  data() {
    return {
      tags: [
        "Tag 1",
        "Tag 2",
        "Tag 3",
        "Tag 4",
        "Tag 5",
        "Tag 6",
        "Tag 7",
        "Tag 8",
        "Tag 9",
        "Tag 10",
        "Tag 11",
        "Tag 12",
      ],
      tagButton: true,
    };
  },
  methods: {
    dragStartHandler(event) {
      if (event.dataTransfer) {
        event.dataTransfer.setData("text/plain", event.target.textContent);
      }
    },
  },

  computed: {},
};
</script>
<style scoped>
.left-panelB {
  flex-basis: 13%;
  height: 98vh;
  background-color: #f9eac3;
  position: relative;
}

.tag-list {
  position: absolute;
  max-height: 60%;
  overflow-y: auto;
  background-color: #0abab5;
  width: 75%;
  justify-content: center;
  align-items: center;
  margin-left: 10%;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  margin-bottom: 5px;
}
.search-container {
  margin-bottom: 10px;
}

input[type="text"] {
  width: 60%;
  margin: 1%;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f2f2f2;
}
</style>
