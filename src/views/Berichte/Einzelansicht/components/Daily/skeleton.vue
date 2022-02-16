<template>
  <div v-for="n in 8" :key="n">
    <q-skeleton type="text" width="100px"></q-skeleton>

    <q-list>
      <q-item>
        <q-item-section>
          <q-skeleton type="rect"></q-skeleton>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>