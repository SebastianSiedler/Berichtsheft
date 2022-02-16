<template>
  <div
    class="basic-chip background-green"
    :class="clickable ? 'cursor-pointer' : ''"
  >
    <slot> </slot>
  </div>
</template>

<script setup lang="ts">
// NPM
import { PropType } from 'vue';

defineProps({
  type: {
    type: String as PropType<'success' | 'warning' | 'error'>,
    required: true,
  },
  clickable: {
    type: Boolean,
  },
});

const colorTypes = {
  success: {
    text: '#40ba96',
    bg: '#d8f3ec',
  },
  warning: {
    text: 'red',
    bg: 'orange',
  },
  error: {
    text: 'white',
    bg: 'red',
  },
  gray: {
    text: '',
    bg: '',
  },
};
</script>

<style>
.basic-chip {
  padding: 5px 10px;
  border-radius: 8px;
  display: inline-flex;
  margin: 5px;
  font-weight: 600;
}

.background-green {
  background: v-bind('colorTypes[type].bg');
  color: v-bind('colorTypes[type].text');
}
</style>
