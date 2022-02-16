<template>
  <report-information :report="reportStore.state.report" :loading="loading" />

  <!-- Wenn Betrieb oder Kombiniert -->
  <div v-if="reportStore.state.report.rtype != 'S'" class="q-my-sm">
    <!-- Editor Für Betrieb -->
    <editor
      title="Betrieb"
      :text="reportStore.state.report.data_weekly.company"
      :save="reportStore.saveCompanyText"
      :readonly="!perms.edit"
      :loading="loading"
      :key="reportStore.state.report.nr"
    />

    <!-- Editor für Unterweisungen -->
    <editor
      title="Unterweisungen"
      :text="reportStore.state.report.data_weekly.instruction"
      :save="reportStore.saveInstructionText"
      :readonly="!perms.edit"
      :loading="loading"
      :key="reportStore.state.report.nr"
    />
  </div>

  <lesson-list
    v-if="reportStore.state.report.rtype != 'B'"
    :report="reportStore.state.report"
    :loading="loading"
    :key="reportStore.state.report.nr"
  />
</template>

<script lang="ts" setup>
// NPM
import { PropType, computed } from 'vue';

// LIB
import { reportPermissionEdit } from 'lib/reports/common';
import { useReportStore } from 'lib/reports/einzelansicht';
import { GetReportDetailAPI } from 'lib/reports/types';

// COMPONENTS
import ReportInformation from '../Common/Information.vue';
import Editor from './Content/BetriebEditor.vue';
import LessonList from './Content/Schule/ListLessons.vue';

defineProps({
  report: {
    type: Object as PropType<GetReportDetailAPI>,
    //required: true,
  },
  loading: {
    type: Boolean,
  },
});

const reportStore = useReportStore();

const perms = computed(() =>
  reportPermissionEdit(reportStore.state.report.status)
);
</script>
