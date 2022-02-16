<template>
  <div>
    <skeleton v-if="loading" />
    <reports-list v-else :items="reports || trainees" v-slot="{ item }">
      <report-item v-if="!!reports" :report="item" :supervisor="supervisor" />
      <trainee-item v-if="!!trainees" :trainee="item" />
    </reports-list>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { PropType } from 'vue';

// LIB
import { GetReportsOverviewAPI, MobileTraineeListAPI } from 'lib/reports/types';

// COMPONENTS
import Skeleton from './ListComponents/ListSkeleton.vue';
import ReportsList from './ListComponents/ListReports.vue';
import ReportItem from './ListComponents/ListItem.vue';
import TraineeItem from './ListComponents/TraineeItem.vue';

defineProps({
  loading: {
    type: Boolean,
  },
  reports: {
    type: Object as PropType<GetReportsOverviewAPI[]>,
  },
  trainees: {
    type: Object as PropType<MobileTraineeListAPI[]>,
  },
  supervisor: Boolean,
});
</script>
