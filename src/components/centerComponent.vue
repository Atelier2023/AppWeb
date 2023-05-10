<template>
  <div class="center-panel">
    <h1>tableau central</h1>
    <p>
      {{ currentPath }}
    </p>

    <div v-if="tableauData.length > 0">
      <div class="table-wrapper">
        <table class="fl-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>étiquettes</th>
            </tr>
          </thead>
          <tbody v-for="(tab, index) in tableauData" :key="index">
            <td style="text-align: left">{{ tab.name }}</td>
            <td>{{ tab.type }}</td>
            <td
              @drop="dropHandler(index)"
              @dragover.prevent
              class="droppable"
              style="display: flex; flex-wrap: wrap"
            >
              <span v-if="tab.tags.length === 0"> poser un tag </span>
              <span
                v-else
                style="margin-right: 3px; border: 1px solid black"
                v-for="(tag, tagIndex) in tab.tags"
                :key="tagIndex"
              >
                {{ tag }}
                <button @click="removeTag(tab, tag)">🗑️</button>
                <br v-if="(tagIndex + 1) % 3 === 0" />
              </span>
            </td>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else><p>Aucun Fichier ou Dossier Trouvé</p></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "centerComponent",
  props: {
    selectedFolder: {
      type: Array,
      default: () => [], // initialiser la prop avec un tableau vide
    },
  },
  emits: ["update:selectedFolder"],
  components: {},
  data() {
    return {
      tableauData: [],
    };
  },
  methods: {
    async dropHandler(index) {
      const tag = event.dataTransfer.getData("text/plain");
      if (event.dataTransfer) {
        if (this.tableauData[index].type === "Dossier 📁") {
          try {
            const path = encodeURIComponent(this.tableauData[index].path);
            await axios.post(
              `http://localhost:8000/file/renameFolder/${path}/${tag}`
            );
          } catch (error) {
            console.error(error);
          }
        } else {
          try {
            const path = encodeURIComponent(this.tableauData[index].path);
            await axios.post(
              `http://localhost:8000/file/renameFile/${path}/${tag}`
            );
          } catch (error) {
            console.error(error);
          }
        }

        try {
          const curPath = encodeURIComponent(this.currentPath);
          await axios
            .post(`http://localhost:8000/file/getAllfile/${curPath}`)
            .then((response) => {
              this.tableauData = response.data;
              console.log(this.tableauData);
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    async removeTag(tab, tag) {
      const path = encodeURIComponent(tab.path);
      const tagToRemove = encodeURIComponent(tag);
      try {
        await axios.post(
          `http://localhost:8000/file/removeTag/${path}/${tagToRemove}`
        );
        const curPath = encodeURIComponent(this.currentPath);
        const response = await axios.post(
          `http://localhost:8000/file/getAllfile/${curPath}`
        );
        this.tableauData = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    currentPath() {
      if (this.tableauData.length === 0) {
        return "";
      }
      const fullPath = this.tableauData[0].path;
      const lastIndex = fullPath.lastIndexOf("\\");
      const parentPath = fullPath.slice(0, lastIndex);
      return parentPath;
    },
  },
  watch: {
    selectedFolder: {
      handler: function (newSelectedFolder) {
        this.tableauData = newSelectedFolder;
      },
      immediate: true, // pour initialiser tableauData
    },
  },
};
</script>

<style scoped>
.center-panel {
  flex-basis: 49%;
  height: 98vh;
  background-color: #02ec8e;
  overflow-y: auto; /* add scrollbar if content is too large */
}
.table-wrapper {
  margin: 2% 2% 2%;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.fl-table {
  border-radius: 5px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;

  white-space: nowrap;
  background-color: rgb(236, 236, 236);
}

.fl-table td,
.fl-table th {
  text-align: center;
  padding: 8px;
}

.fl-table thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}
</style>
