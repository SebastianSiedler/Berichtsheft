<template>
  <q-dialog
    v-model="dialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-layout>
        <!-- Toolbar -->
        <q-header reveal>
          <q-toolbar>
            <q-btn @click="closeDialog()" icon="close" flat />
            <q-toolbar-title>Berichte</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <!-- Hier wird die Liste der Berichte angezeigt -->
        <q-page-container>
          <q-page>
            <p v-if="!loading && !reports.length">
              Noch keine Berichte vorhanden
            </p>
            <ReportsList
              :reports="reports"
              :loading="loading"
              v-else
              supervisor
            />
          </q-page>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
  <ViewSingleReport @onReportDataChange="updateListItem" />
</template>

<script lang="ts" setup>
// NPM
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// LIB
import { getTraineeReporsList } from 'lib/reports/apiCalls';
import { GetReportDetailAPI, GetReportsOverviewAPI } from 'lib/reports/types';

// COMPONENTS
import ReportsList from 'src/views/Berichte/List/List.vue';
import ViewSingleReport from './ViewSingleReport.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');

const reports = ref<GetReportsOverviewAPI[]>([]);

const dialog = ref(false);

watch(
  () => route.params.uid,
  (userId) => {
    const uid = userId as unknown as number;
    if (!!uid) {
      loading.value = true;
      getTraineeReporsList(uid)
        .then((res) => (reports.value = res))
        .catch((e: string) => (error.value = e))
        .finally(() => (loading.value = false));
      dialog.value = true;
    } else {
      dialog.value = false;
    }
  }
);

/**
 * Wenn sich durch Freigeben, Create usw. Daten am Einzelbericht ändern, muss
 * auch die Liste/Tabele angepasst werden
 */
const updateListItem = (report: GetReportDetailAPI) => {
  Object.assign(
    reports.value.find((item) => item.nr == report.nr),
    report
  );
};

const closeDialog = async () => {
  await router.push('/reports/u/');
  dialog.value = false;
};
</script>
