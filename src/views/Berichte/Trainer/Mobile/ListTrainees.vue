<template>
  <!-- Toolbar Header -->
  <q-header reveal>
    <q-toolbar style="position: sticky">
      <q-toolbar-title>Azubis</q-toolbar-title>
    </q-toolbar>
  </q-header>

  <!-- Trainee Users List -->
  <q-page>
    <TraineesList :trainees="trainees" :loading="loading"></TraineesList>
  </q-page>

  <!-- Dialog with reports for individual Trainee -->
  <ReportsList />
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { getMobileTraineeList } from 'lib/reports/apiCalls';
import { MobileTraineeListAPI } from 'lib/reports/types';

// COMPONENTS
import ReportsList from './TraineeReportsOverview.vue';
import TraineesList from 'src/views/Berichte/List/List.vue';

const trainees = ref<MobileTraineeListAPI[]>([]);

const loading = ref(true);
const error = ref('');

getMobileTraineeList()
  .then((res) => {
    trainees.value = res;
  })
  .catch((e: string) => (error.value = e))
  .finally(() => (loading.value = false));
</script>
