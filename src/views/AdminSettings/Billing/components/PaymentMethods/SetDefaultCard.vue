<template>
  <q-card style="width: 360px">
    <!-- Titlebar -->
    <q-card-section class="row">
      <div class="col-2">
        <q-btn icon="close" @click="$emit('close')" flat />
      </div>
      <div class="col-8 text-center text-h6">Standard setzen</div>
    </q-card-section>

    <!-- Error -->
    <error-banner v-if="!!error" :error="error" />

    <!-- Als Standard festlegen -->
    <q-card-section>
      <div class="row justify-end">
        <q-btn @click="setDefault()"> Als Standard festlegen </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
// NPM
import { ref } from 'vue';

// LIB
import { setDefaultCardAPI } from 'lib/admin/billing/index';

// emits
const emit = defineEmits(['close', 'success']);

// props
const props = defineProps({
  card_id: {
    type: Number,
    required: true,
  },
});

const loading = ref(false);
const error = ref('');

// Die aktuelle Karte als Default festlegen
const setDefault = async () => {
  loading.value = true;
  try {
    await setDefaultCardAPI(props.card_id);
    emit('success', props.card_id);
    emit('close');
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};
</script>
