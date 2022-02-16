<template>
  <q-card style="width: 460px">
    <q-form @submit="onSubmitSave">
      <!-- Titelleiste -->
      <q-card-section class="row">
        <span class="col-4">
          <q-btn @click="$emit('onClose')" icon="close" flat rounded />
        </span>
        <span class="text-h6 col-4 text-center">Edit</span>
        <span class="col-4 row justify-end">
          <q-btn
            icon="save"
            flat
            rounded
            v-if="hasChanged"
            type="submit"
            :loading="loadingBtn"
          />
          <q-btn icon="delete" flat rounded v-else-if="task.id != -1" />
        </span>
      </q-card-section>

      <!-- Select Felder -->
      <q-card-section class="row q-col-gutter-sm">
        <!-- Wochentag -->
        <q-select
          class="col"
          label="Tag"
          v-model="editTask.weekday"
          :options="daysArray"
          option-value="id"
          option-label="label"
          map-options
          emit-value
        />

        <!-- Fach oder Nichts -->
        <q-select
          class="col"
          label="Fach"
          v-model="editTask.subject"
          :options="subjectsList"
          option-value="id"
          option-label="name"
          map-options
          emit-value
        />

        <!-- Dauer -->
        <q-input
          label="Dauer"
          type="number"
          min="0"
          max="24"
          step="0.25"
          class="col"
          v-model="editTask.duration"
        />
      </q-card-section>

      <!-- Editor -->
      <q-card-section>
        <q-editor
          v-model="editTask.text"
          :toolbar="editorConfig.toolbar"
          min-height="5rem"
        >
        </q-editor>
      </q-card-section>

      <!-- Error -->
      <q-card-section v-if="!!error">
        <error-banner :error="error" />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { PropType, toRefs, computed, ref } from 'vue';

// LIB
import { DailyTaskAPI, GetRepSubjectAPI } from 'lib/reports/types';
import { useReportStore } from 'lib/reports/einzelansicht';
import { isDifferent } from 'lib/utils';
import { daysArray } from 'lib/reports/common';

// props
const props = defineProps({
  task: {
    type: Object as PropType<DailyTaskAPI>,
    required: true,
  },
  subjects: {
    type: Object as PropType<GetRepSubjectAPI[]>,
    required: true,
  },
});

// emits
const emit = defineEmits(['onClose']);

const { task, subjects: subjectsList } = toRefs(props);
const error = ref('');
const loadingBtn = ref(false);

const savedTask = ref({ ...task.value });
const editTask = ref({ ...task.value });

const reportStore = useReportStore();

const hasChanged = computed(() => isDifferent(savedTask.value, editTask.value));

const onSubmitSave = () => {
  loadingBtn.value = true;
  reportStore
    .saveTask(editTask.value)
    .then((res) => {
      savedTask.value = res;
      editTask.value = res;
      emit('onClose');
    })
    .catch((e: string) => (error.value = e))
    .finally(() => (loadingBtn.value = false));
};

// Define q-editor behavior
const editorConfig = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['undo', 'redo'],
  ],
};
</script>
