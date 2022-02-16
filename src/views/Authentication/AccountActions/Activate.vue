<template>
  <div>
    <!-- Loading Animation -->
    <div v-if="loading">
      <q-spinner size="3em"></q-spinner>
    </div>

    <!-- Error -->
    <error-banner v-else-if="!!error" :error="error" />

    <!-- Success -->
    <div v-else>
      <p>Registierung erfolgreich</p>
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * Wird für den Admin verwendet, der das Unternehmen
 * beim Berichtsheft registriert
 */

// NPM
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// LIB
import { sendActivationRequest } from 'lib/authentication/accountActions';

const loading = ref(true);
const error = ref('');

const route = useRoute();
const token = route.query.token as string;

sendActivationRequest(token)
  .then(() => {
    loading.value = false;
  })
  .catch((e: string) => {
    error.value = e;
    loading.value = false;
  });
</script>
