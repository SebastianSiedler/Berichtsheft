<template>
  <q-toolbar>
    <q-btn @click="$emit('close')" icon="close" flat v-if="!noclose" />

    <template v-if="loading">
      <q-toolbar-title>Loading...</q-toolbar-title>
    </template>
    <template v-else>
      <q-toolbar-title>
        Bericht {{ reportStore.state.report.nr }}
      </q-toolbar-title>
      <q-btn
        flat
        rounded
        dense
        icon="cancel"
        :label="changeStatusLabels.reject"
        @click="
          release = false;
          releaseDialog = true;
        "
        v-if="perms.reject"
      />
      <q-btn
        flat
        rounded
        dense
        icon="send"
        :label="changeStatusLabels.release"
        @click="
          release = true;
          releaseDialog = true;
        "
        v-if="perms.release"
      />
    </template>
  </q-toolbar>

  <!-- freigeben oder ablehnen-->
  <q-dialog v-model="releaseDialog" persistent>
    <freigeben
      :release="release"
      :report-id="reportStore.state.report.id"
      @close="releaseDialog = false"
      @success="$emit('close')"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
// NPM
import { ref, computed } from 'vue';

// LIB
import { useReportStore } from 'lib/reports/einzelansicht';
import { reportPermissionEdit, getChangeStatusLabel } from 'lib/reports/common';

// COMPONENTS
import Freigeben from './Freigeben.vue';

// props
defineProps({
  loading: {
    type: Boolean,
  },
  noclose: Boolean,
});

// emits
defineEmits(['close', 'success']);

const reportStore = useReportStore();

const perms = computed(() =>
  reportPermissionEdit(reportStore.state.report.status)
);

const releaseDialog = ref(false);

const release = ref(false);

const changeStatusLabels = computed(() =>
  getChangeStatusLabel(reportStore.state.report.status)
);
</script>
