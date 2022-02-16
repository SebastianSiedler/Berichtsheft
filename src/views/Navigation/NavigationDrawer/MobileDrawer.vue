<template>
  <q-footer>
    <q-tabs
      v-model="activeTab"
      indicator-color="transparent"
      active-color="white"
      class="text-grey-5 shadow-2"
    >
      <q-route-tab
        v-for="item in items"
        :key="item.linkName"
        :label="item.title"
        :icon="item.action"
        :to="{ name: item.linkName }"
      />
    </q-tabs>
  </q-footer>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

const items = [
  {
    action: 'view_week',
    title: 'Übersicht',
    linkName: 'Dashboard',
  },
  {
    action: 'library_books',
    title: 'Berichte',
    linkName: 'Reports',
  },
  {
    action: 'school',
    title: 'Noten',
    linkName: 'Grades',
  },
  {
    title: 'Einstellungen',
    action: 'settings',
    linkName: 'Settings',
  },
];
const activeTab = ref();
</script>
