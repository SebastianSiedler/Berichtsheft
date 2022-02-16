<template>
  <q-banner class="bg-red text-white" v-if="!!copyError">
    <div class="row justify-between items-center">
      <div class="col">{{ copyError }}</div>
      <slot></slot>
      <q-btn icon="close" flat @click="copyError = ''"></q-btn>
    </div>
  </q-banner>
</template>

<script lang="ts" setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  error: {
    type: String,
    default: 'error not provided',
  },
});

const { error } = toRefs(props);

// Wird benötigt, um Fehlermeldung zu schließen
const copyError = ref('');

/**
 * Wenn sich der error über die Props ändert wird der copyError
 * identisch zugewiesen
 */
watch(
  () => error.value,
  (e) => (copyError.value = e),
  { immediate: true }
);
</script>
