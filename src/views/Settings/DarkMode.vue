<template>
  <div>
    <q-radio
      v-model="activeTheme"
      v-for="theme in themes"
      :key="theme.label"
      :val="theme.value"
      :label="theme.label"
      @click="setSystemTheme(theme.value)"
    >
    </q-radio>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const activeTheme = ref($q.dark.mode);

const themes: { label: string; value: 'auto' | boolean }[] = [
  { label: 'Hell', value: false },
  { label: 'Dark', value: true },
  { label: 'System', value: 'auto' },
];

const setSystemTheme = (value: boolean | 'auto'): void => {
  $q.dark.set(value);
  localStorage.setItem('darkMode', JSON.stringify(value));
};
</script>
