<template>
  <div>
    <div v-if="isNew">
      <p>Registrierung abschließen</p>
      <p>
        Herzlich willkommen. Du musst nur noch ein Passwort setzen um mit dem
        Berichtsheft loszulegen
      </p>
    </div>
    <div v-else>Passwort zurücksetzen</div>

    <!-- Error -->
    <error-banner v-if="!!error" :error="error" />

    <!-- First Step -->
    <div v-else-if="!passwordSet">
      <q-form @submit="sendUserActivation">
        <q-input
          label="Passwort"
          v-model="password"
          :rules="rules.passwordRules"
        />

        <q-input
          label="Passwort"
          v-model="passwordRepeat"
          :rules="[
            rules.passwordRules,
            (val) => singleRules.passwordMatch(password, val),
          ]"
        />
        <q-btn type="submit">Senden</q-btn>
      </q-form>
    </div>

    <!-- Second Step -->
    <div v-else>
      <p>Neues Passwort erfolgreich gesetzt</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// LIB
import { setUserPassword } from 'lib/authentication/accountActions';
import { rules, singleRules } from 'lib/utils';

const loading = ref(true);
const error = ref('');
const passwordSet = ref(false);

const route = useRoute();
const token = route.query.token as string;

// Wenn der Token aus der URL leer ist
if (!token) {
  error.value = 'URL ungültig';
}

const password = ref('');
const passwordRepeat = ref('');

/**
 * Diese View Komponente wird sowohl für erstes Passwort setzten,
 * als auch für password zurücksetzen benutzt
 */
const isNew = useRoute().name == 'PasswordNew';

const sendUserActivation = () => {
  setUserPassword(token, password.value, isNew)
    .then(() => {
      loading.value = false;
    })
    .catch((e: string) => {
      loading.value = false;
      error.value = e;
    });
};
</script>
