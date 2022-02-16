<template>
  <q-card>
    <q-item-section>
      <q-skeleton type="text" v-for="n in 5" :key="n" class="q-my-sm"/>
    </q-item-section>
  </q-card>
</template>