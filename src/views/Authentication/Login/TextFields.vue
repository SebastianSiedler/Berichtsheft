<template>
  <q-form @submit="signIn">
    <!-- E-Mail  -->
    <q-input
      label="E-Mail"
      v-model="email"
      :rules="rules.mailRules"
      lazy-rules
    />

    <!-- Passwort -->
    <q-input
      label="Passwort"
      :type="hidePassword ? 'password' : 'text'"
      v-model="password"
      :rules="[singleRules.stringRequired]"
      lazy-rules
    >
      <template v-slot:append>
        <q-icon
          :name="hidePassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="hidePassword = !hidePassword"
        />
      </template>
    </q-input>

    <!-- Submit Button -->
    <q-btn type="submit" :loading="loading">Login</q-btn>
  </q-form>

  <!-- Temporär zum Testen für Verschiedene User -->
  <p class="text-h6">Users</p>
  <q-list separator>
    <q-item
      v-for="user in [
        'manager@x.com',
        'trainer-teamleader1@x.com',
        'trainer1@x.com',
        'teamleader1@x.com',
        'azubi1@x.com',
      ]"
      :key="user"
      clickable
      @click="
        email = user;
        signIn();
      "
    >
      <q-item-section>{{ user }}</q-item-section>
    </q-item>
  </q-list>

  <error-banner v-if="!!error" :error="error" />
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// LIB
import { Login } from 'lib/authentication/auth';
import { singleRules, rules } from 'lib/utils';

const hidePassword = ref(true);

const reason = useRoute().query.reason;

const error = ref('');
if (!!reason) {
  error.value = reason as string;
}

let email = ref('vollzugriff@x.com');
let password = ref('#asdf1234');
let loading = ref(false);

const signIn = async () => {
  loading.value = true;
  error.value = '';

  try {
    await Login(email.value, password.value);
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};
</script>
