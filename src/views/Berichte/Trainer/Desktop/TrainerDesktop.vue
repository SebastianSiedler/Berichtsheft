<template>
  <p v-if="asManager">Ansicht als Admin</p>
  <q-toggle v-if="showToggle" v-model="asManager" label="Als Administrator" />
  <trainees-table />
</template>

<script lang="ts" setup>
// NPM
import { computed } from 'vue';
import { useStore } from 'src/store/index';
import { SettingsMutations } from 'src/store/modules/settings/index';

//COMPONENTS
import TraineesTable from './TraineesTable.vue';

const store = useStore();

const user = computed(() => store.state.auth.user);

// Zeigt den Slider nur an, wenn der User Admin + (TL Oder Ausbilder) ist
const showToggle =
  user.value.is_manager && (user.value.is_trainer || user.value.is_teamleader);

// Wenn nur Admin soll er default admin laden
store.commit(
  SettingsMutations.SET_ASMANAGER,
  user.value.is_manager && !showToggle
);

const asManager = computed({
  get(): boolean {
    return store.state.settings.asManager;
  },
  set(newVal: boolean): void {
    store.commit(SettingsMutations.SET_ASMANAGER, newVal);
  },
});
</script>
