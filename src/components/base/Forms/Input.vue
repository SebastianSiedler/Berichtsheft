<template>
  <q-input
    :modelValue="props.modelValue"
    @update:modelValue="updateValue"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const updateValue = (e: string) => {
  emit('update:modelValue', e);
};
</script>
