<template>
  <!-- Verwalten von Fächern und Noten -->
  <div>
    <div class="row q-gutter-sm">
      <div v-for="item in items" :key="item.label">
        <q-card
          flat
          bordered
          class="cursor-pointer"
          @click="
            activeComponent = item.component;
            dialog = true;
          "
        >
          <q-card-section>
            <div class="text-subtitle2">{{ item.label }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-btn icon="close" @click="dialog = false" flat />
      <q-card-section>
        <component :is="activeComponent"></component>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// NPM
import { shallowRef, ref } from 'vue';

// COMPONENTS
import SetTraineeSubjects from './SetTraineeSubjects.vue';
import NotenGewichtung from './NotenGewichtung.vue';

const activeComponent = shallowRef();

const items = [
  {
    label: 'Fächer',
    component: SetTraineeSubjects,
  },
  {
    label: 'Noten',
    component: NotenGewichtung,
  },
];

const dialog = ref(false);
</script>
