<template>
  <div class="q-pa-md">
    <p class="text-h3">Persönliche Daten</p>
    <p>
      Um die Nutzer des Berichtsheft zu verwalten wird ein Administrator
      benötigt. Es können nach der Registrierung weitere Administratoren
      hinzugefügt werden.
    </p>
    <q-form @submit="onSubmit">
      <q-input
        label="Firmen-Name"
        v-model="obj.companyName"
        :rules="rules.userFirstName"
        lazy-rules
      />

      <q-input
        label="Vorname"
        v-model="obj.firstName"
        :rules="rules.userFirstName"
        lazy-rules
      />
      <q-input
        label="Nachname"
        v-model="obj.lastName"
        :rules="rules.userLastName"
        lazy-rules
      />

      <q-select
        label="Geschlecht"
        v-model="obj.salutation"
        :options="salutations"
        option-value="value"
        option-label="label"
        map-options
        emit-value
        lazy-rules
        :rules="[singleRules.stringRequired]"
      >
      </q-select>
      <q-input
        label="Mail"
        v-model="obj.mail"
        :rules="rules.mailRules"
        lazy-rules
      />

      <!-- Passwort -->
      <q-input
        label="Passwort"
        :type="hide.password ? 'password' : 'text'"
        v-model="obj.password"
        :rules="rules.passwordRules"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon
            :name="hide.password ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="hide.password = !hide.password"
          />
        </template>
      </q-input>

      <!-- Passwort wiederholen -->
      <q-input
        label="Passwort wiederholen"
        :type="hide.repeatPassword ? 'password' : 'text'"
        v-model="obj.passwordRepeat"
        :rules="[
          ...[(val) => singleRules.passwordMatch(obj.password, val)],
          ...rules.passwordRules,
        ]"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon
            :name="hide.repeatPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="hide.repeatPassword = !hide.repeatPassword"
          />
        </template>
      </q-input>

      <q-checkbox v-model="obj.terms" label="Ich habe die dings gelesen" />

      <q-btn type="submit" :loading="loading" :disable="!obj.terms"
        >Weiter</q-btn
      >
      <q-btn @click="$router.go(-1)">Zurück</q-btn>
    </q-form>
    <error-banner v-if="!!error" :error="error" />
  </div>
</template>

<script lang="ts" setup>
// NPM
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// LIB
import { singleRules, rules } from 'lib/utils';
import { SignUpEnterprise, sendSignUp } from './signUp'; //TODO: Noch in ./lib ordner verschieben und neue js struktur

const router = useRouter();

const salutations = [
  { label: 'männlich', value: 1 },
  { label: 'weiblich', value: 2 },
  { label: 'divers', value: 3 },
];

const hide = reactive({
  password: true,
  repeatPassword: true,
});

// TODO: das noch leeren, da für testzwecke, da ich nicht jedes mal neu daten eintragen will
const obj = reactive<SignUpEnterprise>({
  mail: 'a@a.de',
  salutation: 1,
  firstName: 'asdf',
  lastName: 'asdf',
  password: 'asdf123!',
  passwordRepeat: 'asdf123!',
  companyName: 'CooleFirma GmbH',
  terms: false,
  recaptchaToken: '',
});

/**
 * Submit/Send form Data to Backend
 */
const loading = ref(false);
const error = ref('');

const onSubmit = async () => {
  loading.value = true;
  obj.recaptchaToken = await recaptcha();

  try {
    await sendSignUp(obj);
    router.push('/');
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};

// rechapta-v3
import { load } from 'recaptcha-v3';

async function recaptcha() {
  const siteKey = '6LfDF4QcAAAAADU9T9TXLly2AFpMgTDV1I8fIJar'; // https://www.google.com/recaptcha/admin/site/478418883
  const recaptcha = await load(siteKey, {
    autoHideBadge: true,
    useRecaptchaNet: true, // TODO: Nachschauen - Due to limitations in certain countries it's required to use recaptcha.net instead of google.com.
  });
  const token = await recaptcha.execute('signup_Berichtsheft');
  return token;
}
</script>
