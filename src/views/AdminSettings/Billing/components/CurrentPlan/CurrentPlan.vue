<template>
  <div class="row">
    <div class="col">
      <template v-if="currentPlan != null">
        <p class="text-subtitle2">{{ currentPlan.name }}</p>
        <p class="text-body2">{{ currentPlan.price }} pro Azubi/Monat</p>
        <p class="text-caption">
          Ihr Plan verlängert sich am {{ currentPlan.extension_date }}
        </p>
      </template>
      <p v-else>Noch kein Berichtsheft-Zahlungsmodell ausgewählt</p>
    </div>

    <div class="col">
      <q-btn rounded color="primary" @click="changeDialog = true"
        >Plan ändern</q-btn
      ><br />
      <q-btn
        rounded
        outline
        @click="cancelDialog = true"
        v-if="currentPlan != null"
        >Plan kündigen</q-btn
      >
    </div>

    <!-- Plan ändern -->
    <q-dialog v-model="changeDialog" persistent>
      <ChangePlan @onCancel="changeDialog = false" />
    </q-dialog>
    <!-- Plan Kündigen -->
    <q-dialog v-model="cancelDialog" persistent>
      <CancelPlan @onCancel="cancelDialog = false" :currentPlan="currentPlan" />
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// COMPONENTS
import CancelPlan from './CancelPlan.vue';
import ChangePlan from './ChangePlan.vue';

const currentPlan = {
  price: '0.49',
  name: 'Berichtsheft Jährlich',
  extension_date: '2022-02-08',
};

const changeDialog = ref(false);
const cancelDialog = ref(false);
</script>
