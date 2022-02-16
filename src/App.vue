<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
// NPM
import { useQuasar } from 'quasar';

// LIB
import { SetInitialData } from 'lib/authentication/auth';
import { getSystemTheme } from 'lib/settings/settings';

// Set System Theme
const $q = useQuasar();
const theme = getSystemTheme();
$q.dark.set(theme);

SetInitialData();

/**
 * Viewport 100vh problem debugging
 */
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
window.addEventListener('resize', appHeight);
window.addEventListener('load', appHeight);
appHeight();
</script>

<style>
/* 100vh mobile fix fallback*/
:root {
  --app-height: 100%;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
