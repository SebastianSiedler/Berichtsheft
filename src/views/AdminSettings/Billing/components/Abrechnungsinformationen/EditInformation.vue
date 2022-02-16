<template>
  <q-card>
    <q-card-section>
      <q-btn @click="$emit('onCancel')">Cancel</q-btn>
      <span class="text-h5">Informationen bearbeiten</span>
    </q-card-section>
    <q-card-section> </q-card-section>
    <q-card-section>
      <q-form @submit="onSubmit">
        <q-btn type="submit">Speichern</q-btn>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// Emits
const emit = defineEmits(['onCancel']);

const onSubmit = () => {
  emit('onCancel');
};
</script>
