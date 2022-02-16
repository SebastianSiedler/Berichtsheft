<template>
  <q-card>
    <q-card-section>
      <q-btn @click="$emit('onCancel')">Cancel</q-btn>
      Plan kündigen
    </q-card-section>
    <q-card-section> {{ props }}</q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  currentPlan: {
    required: true,
  },
});
</script>
