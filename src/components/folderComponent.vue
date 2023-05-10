<template>
  <div class="left-panelA">
    <!-- Contenu du panneau gauche -->
    <div class="button-group">
      <button
        class="button"
        @click="(parameterButton = true), (fileButton = false)"
      >
        ⚙️
      </button>
    </div>

    <!-- Contenu panneau gauche Fichier-->
    <div v-if="fileButton" class="File" style="bottom: 55px">
      <h1>Gestionnaire d'emplacement</h1>

      <form @submit.prevent="submitForm">
        <div class="search-container">
          <input
            type="text"
            id="searchFolderBar"
            placeholder="Recherche..."
            v-model="folderName"
          />
          <button type="submit" class="buttonLog">Trouver</button>
        </div>
      </form>
      <div>
        <tree
          :nodes="nodes"
          :config="config"
          @node-focus="handleFolderClick"
        ></tree>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import treeview from "vue3-treeview";
import "vue3-treeview/dist/style.css";
export default {
  name: "folderComponent",
  components: { tree: treeview },
  data() {
    return {
      parameterButton: false,
      fileButton: true,
      folderName: "",
      folderData: "",
      selectedFolder: "",
      tableauData: "",
      config: {
        roots: [],
        openedIcon: {
          type: "shape",
          stroke: "black",
          strokeWidth: 3,
          viewBox: "0 0 24 24",
          draw: "M 2 12 L 22 12",
        },
        closedIcon: {
          type: "shape",
          stroke: "black",
          strokeWidth: 3,
          viewBox: "0 0 24 24",
          draw: `M 12 2 L 12 22 M 2 12 L 22 12`,
        },
      },
      nodes: {},
    };
  },
  methods: {
    async handleFolderClick(folder) {
      this.selectedFolder = folder.path;
      const path = encodeURIComponent(this.selectedFolder);
      await axios
        .post(`http://localhost:8000/file/getAllfile/${path}`)
        .then((response) => {
          this.tableauData = response.data;
          console.log(this.tableauData);
          this.$emit("folder-selected", this.tableauData);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async submitForm() {
      await axios
        .post("http://localhost:8000/file/getAllfolders", {
          folderName: this.folderName,
        })
        .then(async (response) => {
          this.data = response.data;
          this.folderData = this.data;
          this.folderData.forEach((folder, index) => {
            const nodeId = `id${index}`;
            this.nodes[nodeId] = {
              text: folder.name,
              path: folder.path,
            };
            if (folder.children.length > 0) {
              const addNodes = (nodes, children, parentId) => {
                const childrenIds = [];
                children.forEach((child, childIndex) => {
                  const childNodeId = `${parentId}_${childIndex}`;
                  nodes[childNodeId] = {
                    text: child.name,
                    path: child.path,
                  };
                  if (child.children && child.children.length > 0) {
                    const grandchildrenIds = addNodes(
                      nodes,
                      child.children,
                      childNodeId
                    );
                    nodes[childNodeId].children = grandchildrenIds;
                  }
                  childrenIds.push(childNodeId);
                });
                return childrenIds;
              };
              const childrenIds = addNodes(this.nodes, folder.children, nodeId);
              this.nodes[nodeId].children = childrenIds;
            }
            if (!folder.parent) {
              this.config.roots.push(nodeId);
            }
          });

          const path = encodeURIComponent(
            `W:/E_mail/Projets/${this.folderName}/Email`
          );
          await axios
            .post(`http://localhost:8000/file/getAllfile/${path}`)
            .then((response) => {
              this.tableauData = response.data;
              console.log(this.tableauData);
              this.$emit("folder-selected", this.tableauData);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addNodes(nodes, parent, parentId) {
      parent.forEach((folder, index) => {
        const nodeId = `${parentId}_${index}`;
        nodes[nodeId] = {
          text: folder.name,
        };
        if (folder.children.length > 0) {
          const childrenIds = addNodes(nodes, folder.children, nodeId);
          nodes[nodeId].children = childrenIds;
        }
      });
      return parent.map((folder, index) => `${parentId}_${index}`);
    },
  },
  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    const projet = searchParams.get("projet");
    if (projet) {
      this.folderName = projet;
      this.submitForm();
    }
  },

  computed: {},
};
</script>
<style scoped>
.left-panelA {
  flex-basis: 13%;
  height: 98vh;
  background-color: #ff6961;
  position: relative;
}
.button-group {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px;
}
.button-param {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.button {
  width: 32%;
  height: 50px;
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
