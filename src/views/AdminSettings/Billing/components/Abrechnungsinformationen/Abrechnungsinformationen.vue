<template>
  <q-item clickable @click="editDialog = true">
    <q-item-section>
      <q-icon name="edit"></q-icon>
    </q-item-section>
    <q-item-section> Informationen aktualisieren </q-item-section>
  </q-item>
  <q-dialog v-model="editDialog" persistent>
    <edit-data @onCancel="editDialog = false" />
  </q-dialog>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// COMPONENTS
import EditData from './EditInformation.vue';

const editDialog = ref(false);
</script>
