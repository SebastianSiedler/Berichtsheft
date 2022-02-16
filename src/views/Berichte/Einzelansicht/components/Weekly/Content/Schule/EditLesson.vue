<!-- Nutzt der Azubi um im Bericht eine Unterrichtsstude den Text zu ändern -->

<template>
  <q-card style="width: 400px">
    <q-card-section>
      <div class="row space-between">
        <div class="col">
          <q-btn @click="$emit('close')" icon="close" flat rounded></q-btn>
        </div>
        <div class="col text-center">
          <span class="text-h6"> {{ getTitle(editItem.id) }} </span>
        </div>
        <div class="col row justify-end">
          <q-btn
            @click="saveLesson()"
            v-if="hasChanged && !!editItem.text"
            :loading="loading"
            icon="save"
            class="text-primary"
            flat
            rounded
          ></q-btn>
          <q-btn
            v-else-if="editItem.id != -1"
            @click="deleteLesson()"
            :loading="loading"
            icon="delete_outline"
            class="text-red-7"
            flat
            rounded
          ></q-btn>
        </div>
      </div>
    </q-card-section>

    <!-- Editor -->
    <q-card-section>
      <q-editor
        v-model="editItem.text"
        :toolbar="editorConfig.toolbar"
        min-height="5rem"
      />
    </q-card-section>

    <!-- Error -->
    <q-card-section>
      <error-banner v-if="!!error" :error="error" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { PropType, ref, toRefs, computed } from 'vue';

// LIB
import { SchoolDataAPI } from 'lib/reports/types';
import { isDifferent } from 'lib/utils';
import { useReportStore } from 'lib/reports/einzelansicht';

const props = defineProps({
  reportId: {
    type: Number,
    required: true,
  },
  lesson: {
    type: Object as PropType<SchoolDataAPI>,
    required: true,
  },
});

const emit = defineEmits(['close']);
const reportStore = useReportStore();

const { lesson } = toRefs(props);

const loading = ref(false);
const error = ref('');

const editItem = ref({ ...lesson.value });

// Zeigt an, ob sich seit dem öffnen am Text etwas geändert hat
const hasChanged = computed(() =>
  isDifferent(lesson.value.text, editItem.value.text)
);

const saveLesson = () => {
  loading.value = true;
  reportStore
    .saveLesson(editItem.value)
    .then(() => emit('close'))
    .catch((e: string) => (error.value = e))
    .finally(() => (loading.value = false));
};

const deleteLesson = () => {
  loading.value = true;
  reportStore
    .deleteLesson(editItem.value.id)
    .then(() => emit('close'))
    .catch((e: string) => (error.value = e))
    .finally(() => (loading.value = false));
};

const getTitle = (id: number) => (id == -1 ? 'Neu erstellen' : 'Bearbeiten');

// Define q-editor behavior
const editorConfig = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['undo', 'redo'],
  ],
};
</script>
