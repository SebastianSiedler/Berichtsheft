<template>
  <div>
    <h1>Login</h1>
    <text-fields />
    <p>Noch kein Konto?</p>
    <router-link to="/signup">Konto erstellen</router-link><br />
    <router-link to="/login/resetpassword">Passwort vergessen?</router-link>
    <div>
      <router-link to="/home">Home</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
// COMPONENTS
import TextFields from './TextFields.vue';
</script>
