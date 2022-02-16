<template>
  <error-banner v-if="!!error" :error="error" />
  <p v-else-if="loading">Loading Trainees Table for Supervisor...</p>
  <supervisor-table
    v-else
    :supervisor-reports-view="tableData"
    @itemClicked="
      activeRepId = $event;
      desktopDialog = true;
    "
  />

  <q-dialog persistent v-model="desktopDialog">
    <q-card style="width: 550px">
      <q-card-section>
        <einzelansicht
          @close="desktopDialog = false"
          :bareReport="{
            id: activeRepId,
          }"
          @reportDataChange="onReportDataChange"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
// NPM
import { ref, watch } from 'vue';
import { useStore } from 'src/store/index';

// LIB
import { SupervisorDesktopTableAPI } from 'lib/reports/types';
import { GetReportDetailAPI } from 'lib/reports/types';
import { getDesktopTraineeTable } from 'lib/reports/apiCalls';

// COMPONENTS
import SupervisorTable from './TraineeTableComponent.vue';
import Einzelansicht from 'src/views/Berichte/Einzelansicht/einzelansicht.vue';

const store = useStore();

const loading = ref(true);
const error = ref('');

const tableData = ref<SupervisorDesktopTableAPI[]>([]);

const desktopDialog = ref(false);

/**
 * Läd die Daten für die Tabelle
 */
const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    tableData.value = await getDesktopTraineeTable(
      store.state.settings.asManager
    );
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};

/**
 * Wenn sich der Toggle/Switch öndert, die Tabelle neu laden
 */
watch(
  () => store.state.settings.asManager,
  () => {
    loadData();
  },
  { immediate: true }
);

/**
 * Wenn sich Status beim Freigeben ändert soll auch in der Übersicht analog dazu
 * angepasst werden
 */
const onReportDataChange = (report: GetReportDetailAPI) => {
  console.log('onReportDataChange');
  tableData.value.forEach((user) => {
    const findReport = user.reports.find((rep) => rep.id == report.id);
    if (!!findReport) Object.assign(findReport, report);
    return;
  });
};
</script>
