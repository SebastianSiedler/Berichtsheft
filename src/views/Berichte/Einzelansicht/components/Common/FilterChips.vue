<template>
  <div class="row">
    <div class="col">
      <q-btn
        @click="downloadPDF()"
        color="primary"
        rounded
        :loading="loadingDownload"
      >
        Download
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { downloadReportPDFAPI } from 'lib/reports/apiCalls';

const loadingDownload = ref(false);
const downloadPDF = async () => {
  loadingDownload.value = true;
  try {
    await downloadReportPDFAPI();
  } catch (e) {
    console.log(e);
  }

  loadingDownload.value = false;
};
</script>
