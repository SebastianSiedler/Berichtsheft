<template>
  <skeleton v-if="loading" />
  <template v-else>
    <div class="row space-between">
      <p class="col text-h6">{{ title }}</p>
      <div class="col row justify-end" v-if="textChanged">
        <q-btn icon="save" @click="submitSave()" flat>Speichern</q-btn>
      </div>
    </div>
    <!-- Edit -->
    <q-editor
      v-model="editText"
      min-height="5rem"
      :toolbar="editorConfig.toolbar"
    />
  </template>
</template>

<script lang="ts" setup>
// NPM
import { ref, computed, PropType, watch } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

// LIB
import { isDifferent } from 'lib/utils';

// COMPONENTS
import Skeleton from '../Skeleton/EditorSkeleton.vue';

// Define q-editor behavior
const editorConfig = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['undo', 'redo'],
  ],
};

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  save: {
    type: Function as PropType<(v: string) => Promise<void>>,
    required: true,
  },
  loading: {
    type: Boolean,
  },
});

const saveText = ref(props.text || '');

const editText = ref(props.text || '');

const textChanged = computed(() => isDifferent(saveText.value, editText.value));

const submitSave = () => {
  props
    .save(editText.value)
    .then(() => {
      saveText.value = editText.value;
    })
    .catch((e: string) => console.log(e));
};

/**
 * Damit die default Values für den Editor Content erst gesetzt werden,
 * wenn Loading abgeschlossen ist. Sonst bleibt das Text Feld leer!
 */
watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      saveText.value = props.text;
      editText.value = props.text;
    }
  }
);

/**
 * Wenn noch nicht gespeicherte änderungen sind eine Warnung,
 * dass man nicht ausversehen wo anders hin clickt
 */
onBeforeRouteUpdate(() => {
  const answer =
    !textChanged.value ||
    window.confirm(
      'Möchtest du die Seite wirklich verlassen? Dein Text ist noch nicht gespeichert'
    );
  // cancel the navigation and stay on the same page
  if (!answer) return false;
});
</script>
