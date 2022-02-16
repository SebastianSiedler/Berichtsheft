<template>
  <skeleton v-if="loading" />
  <q-card v-else bordered flat>
    <q-card-section>
      <!-- Type -->
      <p>{{ getRTypeUi(report.rtype)?.name }}</p>

      <!-- Zeitraum -->
      <p>
        {{ formDate(report.date_start) }} -
        {{ formDate(report.date_end) }}
      </p>

      <!-- Ausbilder -->
      <p>
        Ausbilder: {{ report.trainer.first_name }}
        {{ report.trainer.last_name }}
      </p>

      <template v-if="report.rtype != 'S'">
        <!-- Teamleiter -->
        <p v-if="!!report.teamleader">
          Teamleiter:
          {{ report.teamleader?.first_name }}
          {{ report.teamleader?.last_name }}
        </p>

        <p>Team: {{ report.team?.name }}</p>
      </template>
    </q-card-section>

    <!-- History/Verlauf Dialog -->
    <q-btn
      @click="historyDialog = true"
      style="position: absolute; top: 10px; right: 10px"
      :icon="getStatusUi(report.status).icon"
      :color="getStatusUi(report.status).color"
      stack
      label="Verlauf"
      flat
      size="sm"
    />
    <q-dialog v-model="historyDialog">
      <Verlauf :reportid="report.id" @close="historyDialog = false" />
    </q-dialog>

    <!-- Bericht Typ bearbeiten -->
    <q-btn
      v-if="perms.edit"
      icon="edit"
      @click="editDialog = true"
      flat
      color="primary"
      style="position: absolute; bottom: 10px; right: 10px"
    />
    <q-dialog v-model="editDialog">
      <edit-type @close="editDialog = false" />
    </q-dialog>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { PropType, ref, computed } from 'vue';

// LIB
import { getRTypeUi, getStatusUi } from 'lib/reports/common';
import { GetReportDetailAPI } from 'lib/reports/types';
import { useReportStore } from 'lib/reports/einzelansicht';
import { reportPermissionEdit } from 'lib/reports/common';

// COMPONENTS
import Skeleton from './Skeleton/InformationSkeleton.vue';
import EditType from './EditReportType.vue';
import Verlauf from './Verlauf.vue';

// props
defineProps({
  report: {
    type: Object as PropType<GetReportDetailAPI>,
    required: true,
  },
  loading: {
    type: Boolean,
  },
});

const formDate = (date: string) => {
  return new Date(date).toLocaleString('de-DE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
};

const editDialog = ref(false);

const historyDialog = ref(false);

const reportStore = useReportStore();

const perms = computed(() =>
  reportPermissionEdit(reportStore.state.report.status)
);
</script>
