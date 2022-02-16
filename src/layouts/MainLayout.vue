<template>
  <q-layout view="hHh Lpr fFf">
    <navigation-drawer v-if="!isMobileScreen" />
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <!-- <right-navigation-bar v-if="!isMobileScreen" /> -->
    <mobile-drawer v-if="isMobileScreen" />
  </q-layout>
</template>

<script lang="ts" setup>
// NPM
import { computed } from 'vue';
import { useQuasar } from 'quasar';

// COMPONENTS
import NavigationDrawer from 'views/Navigation/NavigationDrawer/NavigationDrawer.vue';
import MobileDrawer from 'views/Navigation/NavigationDrawer/MobileDrawer.vue';
//import RightNavigationBar from 'views/Navigation/RightNavigationBar/RightNavigationBar.vue';

const $q = useQuasar();

const isMobileScreen = computed(() => !$q.screen.gt.sm);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
