<template>
  <q-pull-to-refresh @refresh="$emit('onRefresh')" color="primary">
    <p v-if="items.length == 0">Keine Elemente vorhanden</p>
    <q-list separator>
      <template v-for="item in items" :key="item">
        <slot :item="item"></slot>
      </template>
    </q-list>
  </q-pull-to-refresh>
</template>

<script lang="ts" setup>
defineEmits(['onRefresh']);

defineProps({
  items: {
    type: Object,
    required: true,
  },
  supervisor: Boolean,
});
</script>
