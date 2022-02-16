<template>
  <information :report="report" :loading="loading" />
  <list-tasks :report="report" :loading="loading" />
</template>

<script lang="ts" setup>
// NPM
import { PropType } from 'vue';

// LIB
import { GetReportDetailAPI } from 'lib/reports/types';

// COMPONENTS
import Information from 'src/views/Berichte/Einzelansicht/components/Common/Information.vue';
import ListTasks from './ListTasks.vue';

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
</script>
