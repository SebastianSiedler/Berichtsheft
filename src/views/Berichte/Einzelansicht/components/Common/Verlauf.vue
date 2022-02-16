<template>
  <q-card>
    <q-card-section class="row">
      <div class="col-4">
        <q-btn icon="close" flat @click="$emit('close')" />
      </div>
      <div class="text-h5 col-4 text-center">Verlauf</div>
    </q-card-section>

    <!-- Loading -->
    <q-card-section v-if="loading">
      <p>Loading...</p>
    </q-card-section>

    <!-- Error -->
    <q-card-section v-if="error">
      <error-banner :error="error" />
    </q-card-section>

    <q-card-section>
      <q-timeline>
        <q-timeline-entry
          v-for="entry in history"
          :key="entry.id"
          :title="getTitle(entry).title"
          :subtitle="getTitle(entry).timestamp"
          :icon="getTitle(entry).icon.icon"
          :color="getTitle(entry).icon.color"
        >
          <div style="word-wrap: break-word">{{ entry.text }}</div>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { getReportHistoryAPI } from 'lib/reports/apiCalls';
import { ReportHistoryAPI } from 'lib/reports/types';
import { getHistoryStatusUi } from 'lib/reports/common';

// emits
defineEmits(['close']);

// props
const props = defineProps({
  reportid: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const error = ref('');

const history = ref<ReportHistoryAPI[]>([]);

const loadHistory = () => {
  loading.value = true;
  error.value = '';
  getReportHistoryAPI(props.reportid)
    .then((res) => {
      history.value = res.reverse();
    })
    .catch((e: string) => {
      error.value = e;
    })
    .finally(() => {
      loading.value = false;
    });
};
loadHistory();

const formatTimestamp = (ts: string) => {
  const date = new Date(ts).toLocaleString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return date;
};

const getTitle = (entry: ReportHistoryAPI) => {
  const statusUi = getHistoryStatusUi(
    entry.status,
    `${entry.first_name} ${entry.last_name}`
  );

  return {
    icon: {
      icon: statusUi.icon,
      color: statusUi.color,
    },
    title: statusUi.desc,
    timestamp: formatTimestamp(entry.timestamp),
  };
};
</script>
