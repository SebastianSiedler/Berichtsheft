<template>
  <div>
    <toolbar
      :loading="loading || loadingReport"
      :noclose="noclose"
      @close="$emit('close')"
    />
    <error-banner v-if="!!error" :error="error" />
    <!-- Bericht erstellen -->
    <template v-else-if="reportStore.state.report.id == -1">
      <p v-if="loading || loadingReport">Loading Create...</p>
      <create-report v-else />
    </template>

    <!-- Bericht ansicht -->
    <template v-else>
      <!-- Daily -->
      <daily-view
        v-if="reportStore.state.report.is_daily"
        :loading="loading || loadingReport"
        :report="reportStore.state.report"
      />

      <!-- Weekly -->
      <weekly-view v-else :loading="loading || loadingReport" />
    </template>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { watch, PropType, ref } from 'vue';

// LIB
import { GetReportsOverviewAPI } from 'lib/reports/types';
import { providereportStore } from 'lib/reports/einzelansicht';

// COMPONENTS
import CreateReport from './components/createReport.vue';
import WeeklyView from './components/Weekly/Weekly.vue';
import DailyView from './components/Daily/daily.vue';
import Toolbar from './components/Common/Toolbar.vue';

const props = defineProps({
  loading: {
    type: Boolean,
  },
  bareReport: {
    type: Object as PropType<GetReportsOverviewAPI>,
    required: true,
  },
  noclose: Boolean,
});

const emit = defineEmits(['reportDataChange', 'close']);

const { provideStore, reportStore } = providereportStore();
provideStore();

const error = ref('');

const loadingReport = ref(true);

watch(
  () => props.bareReport,
  (bareRep) => {
    if (!props.loading) {
      loadingReport.value = true;
      reportStore
        .setActive(bareRep)
        .catch((e: string) => (error.value = e))
        .finally(() => (loadingReport.value = false));
    }
  },
  {
    immediate: true,
  }
);

/**
 * Wenn sich etwas an den Bereicht Details ändert (z.B. Status oder Type),
 * soll der Parent darüber informiert werden und entsprechent ein Icon ändern o.Ä.
 */
watch(
  () => reportStore.state.report,
  (report) => {
    if (report.status != 0) {
      emit('reportDataChange', report);
    }
  },
  {
    deep: true,
  }
);
</script>
