<template>
  <q-drawer side="left" show-if-above bordered>
    <q-list padding>
      <q-item
        clickable
        v-ripple
        v-for="item in navItems"
        :to="{ name: item.linkName }"
        :key="item.title"
      >
        <q-item-section avatar>
          <q-icon :name="item.action" />
        </q-item-section>

        <q-item-section> {{ item.title }} </q-item-section>
      </q-item>
    </q-list>

    <p>Angemeldet als: {{ $store.state.auth.user.username }}</p>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from 'src/store/index';

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

const store = useStore();

const navItems = ref([...items]);

if (store.state.auth.user.is_manager) {
  navItems.value.push({
    action: 'manage_accounts',
    title: 'Admin',
    linkName: 'Admin',
  });
}
</script>
