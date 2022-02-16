<template>
  <div style="overflow: auto; height: 100vh">
    <p class="text-h2">Rechnungsstellung</p>
    <div v-for="item in items" class="q-mt-xl" :key="item.label">
      <p class="text-h6">{{ item.label }}</p>
      <q-separator></q-separator>
      <component :is="item.component" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// COMPONENTS
import Abrechnungsinformationen from './components/Abrechnungsinformationen/Abrechnungsinformationen.vue';
import CurrentPlan from './components/CurrentPlan/CurrentPlan.vue';
import PaymentHistory from './components/PaymentHistory/PaymentHistory.vue';
import PaymentMethods from './components/PaymentMethods/PaymentMethods.vue';

const items = [
  {
    label: 'Derzeitiger Plan',
    component: CurrentPlan,
  },
  {
    label: 'Zahlungsmethoden',
    component: PaymentMethods,
  },
  {
    label: 'Abrechnungsinformationen',
    component: Abrechnungsinformationen,
  },
  {
    label: 'Rechnungsstellungshistorie',
    component: PaymentHistory,
  },
];
</script>
