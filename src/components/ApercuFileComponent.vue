<template>
  <div>
    <canvas ref="pdfCanvas"></canvas>
  </div>

  <object
    data="W:\E_mail\Projets\P2023A170Test\Email\Email-E-2023_01_16-ras-PJ-AP suite releve-AP-A - Copie (3).msg"
    type="application/vnd.ms-outlook"
  ></object>
</template>

<script>
import * as PDFJS from "pdfjs-dist";
export default {
  mounted() {
    this.loadPdf();
  },
  methods: {
    async loadPdf() {
      const pdfUrl =
        "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

      // Spécifie le chemin vers le worker de PDF.js
      PDFJS.GlobalWorkerOptions.workerSrc =
        "node_modules/pdfjs-dist/build/pdf.worker.js";

      // Charge le document PDF
      const pdf = await PDFJS.getDocument(pdfUrl).promise;

      // Obtient la première page du document
      const page = await pdf.getPage(1);

      // Obtient l'élément canvas et son contexte de dessin
      const canvas = this.$refs.pdfCanvas;
      const context = canvas.getContext("2d");

      // Obtient les dimensions de la page et définit les dimensions du canvas
      const viewport = page.getViewport({ scale: 0.7 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Dessine la page sur le canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      });
    },
  },
};
</script>
