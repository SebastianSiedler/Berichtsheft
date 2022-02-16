<template>
  <div>
    <q-form @submit="sendResetPwMail" v-if="!success">
      <q-input v-model="mail" :rules="rules.mailRules" label="Email" />
      <q-btn type="submit" :loading="loading">Senden</q-btn>
      <error-banner v-if="!!error" :error="error" />
      <router-link to="/login">Zum Login</router-link>
    </q-form>

    <div v-else>
      <p>Email erfolgreich gesendet</p>
      <router-link to="/login">Zum Login</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { rules } from 'lib/utils';
import { sendResetPasswordMail } from 'lib/authentication/accountActions';

const mail = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const sendResetPwMail = () => {
  loading.value = true;
  sendResetPasswordMail(mail.value)
    .then(() => {
      loading.value = false;
      success.value = true;
    })
    .catch((e: string) => {
      error.value = e;
      loading.value = false;
    });
};
</script>
