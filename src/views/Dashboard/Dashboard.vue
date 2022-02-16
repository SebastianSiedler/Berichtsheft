<template>
  <div>
    <h1>Dashboard</h1>
    {{ name }}
    {{ comboModel }}
    <br />

    <q-form @submit="testSubmit()">
      <test-combo
        v-model="comboModel"
        :items="items"
        option-label="b"
        option-value="a"
        multiple
        :rules="[singleRules.arrayRequired]"
      />
      <v-input v-model="name" :rules="[singleRules.arrayRequired]" />
      <q-btn type="submit">Submit</q-btn>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { singleRules } from 'lib/utils/rules';

const name = ref('');

const items = [
  { a: 'val_1', b: 'l_1' },
  { a: 'val_2', b: 'l_2' },
  { a: 'val_3', b: 'l_3' },
  { a: 'val_4', b: 'l_4' },
];

const comboModel = ref([]);

const testSubmit = () => console.log('asdf');
</script>
