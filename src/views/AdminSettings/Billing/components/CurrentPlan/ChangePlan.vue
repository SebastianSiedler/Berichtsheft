<template>
  <q-card style="width: 367px">
    <q-card-section>
      <q-btn @click="$emit('onCancel')">Cancel</q-btn>
      Plan ändern
    </q-card-section>

    <q-card-section>
      <div class="row">
        <div class="col" v-for="plan in plans" :key="plan.id">
          <p>{{ plan.name }}</p>

          <p v-if="plan.active">
            <q-icon name="done" size="sm"></q-icon>Aktueller Plan
          </p>

          <q-btn v-else> Weiter</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
const plans = [
  {
    id: 'plan_3',
    active: true,
    price: '0.79',
    name: 'Berichtsheft Monatlich',
  },
  {
    id: 'plan_4',
    active: false,
    price: '0.49',
    name: 'Berichtsheft Jährlich',
  },
];
</script>
