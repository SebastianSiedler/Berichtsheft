<template>
  <div>
    <div class="text-h5">Profil</div>

    <!-- Username and Email -->
    <div>
      <div class="text-h6">
        {{ $store.state.auth.user.first_name }}
        {{ $store.state.auth.user.last_name }}
      </div>

      <div style="text-decoration: underline">
        {{ $store.state.auth.user.username }}
      </div>
    </div>

    <!-- Verwalten -->
    <Verwalten v-if="$store.state.auth.user.is_trainee" />

    <q-btn color="primary" @click="signOut()"> Sign Out </q-btn>
    <dark-mode />
  </div>
</template>

<script lang="ts" setup>
// LIB
import { signOut } from 'lib/authentication/auth';

// COMPONENTS
import DarkMode from './DarkMode.vue';
import Verwalten from './Verwalten/Verwalten.vue';
</script>
