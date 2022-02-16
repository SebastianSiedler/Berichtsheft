<template>
  <input :value="props.modelValue" @input="updateValue" />
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
