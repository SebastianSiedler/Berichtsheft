<template>
  <router-view />
</template>

<script lang="ts" setup>
// NPM
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'src/store/index';

const router = useRouter();
const store = useStore();

// Wenn Azubi
const isTrainee = store.state.auth.user.is_trainee;

// Wenn Teamleiter, Ausbilder oder Admin/Manager
const isSupervisor =
  store.state.auth.user.is_manager ||
  store.state.auth.user.is_trainer ||
  store.state.auth.user.is_teamleader;

onBeforeRouteUpdate((to, from, next) => {
  // Router Guards dass die User jeweils nicht an die andere View kommen
  if (to.path.includes('/reports/nr') && isTrainee) next();
  else if (to.path.includes('/reports/u') && isSupervisor) next();
});

if (isTrainee) {
  router.replace({ name: 'TraineeView' });
} else if (isSupervisor) {
  router.replace({ name: 'SelectUser' });
}
</script>
