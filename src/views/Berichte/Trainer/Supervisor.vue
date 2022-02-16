<template>
  <div>
    <!-- Mobile -->
    <mobile-trainee-list v-if="isMobileScreen" />

    <!-- Desktop -->
    <trainees-table v-else />
  </div>
</template>

<script lang="ts" setup>
// NPM
import { computed } from 'vue';
import { useQuasar } from 'quasar';

// COMPONENTS
import TraineesTable from './Desktop/TrainerDesktop.vue';
import MobileTraineeList from './Mobile/ListTrainees.vue';

const $q = useQuasar();

const isMobileScreen = computed(() => !$q.screen.gt.sm);
</script>
