<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <span class="text-h6">{{ getTitle() }}</span>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="comment"
          label="Anmerkungen..."
          :rules="[singleRules.releaseRepMaxLen]"
        >
        </q-input>
      </q-card-section>

      <q-card-section>
        <error-banner v-if="!!error" :error="error" />
      </q-card-section>

      <q-card-section class="row">
        <div class="col" @click="$emit('close')">
          <q-btn @click="$emit('close')">Abbrechen</q-btn>
        </div>
        <div class="col">
          <q-btn :loading="loadingBtn" type="submit">{{ getTitle() }}</q-btn>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { toRefs, ref } from 'vue';

// LIB
import { singleRules } from 'lib/utils';
import { useReportStore } from 'lib/reports/einzelansicht';
import { getChangeStatusLabel } from 'lib/reports/common';
const props = defineProps({
  release: {
    type: Boolean,
    required: true,
  },
  reportId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['success', 'close']);
const reportStore = useReportStore();

const { release } = toRefs(props);
const error = ref('');

const loadingBtn = ref(false);
const comment = ref('');

const submit = () => {
  loadingBtn.value = true;

  reportStore
    .release(release.value, comment.value)
    .then(() => {
      emit('close');
      emit('success');
    })
    .catch((e: string) => (error.value = e))
    .finally(() => (loadingBtn.value = false));
};

const getTitle = () => {
  const labels = getChangeStatusLabel(reportStore.state.report.status);
  return release.value ? labels.release : labels.reject;
};
</script>
