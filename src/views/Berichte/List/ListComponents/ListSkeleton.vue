<template>
  <q-virtual-scroll
    style="height: 91vh"
    :items="Array.from(Array(40).keys())"
    separator
  >
    <template v-slot="{ index }">
      <q-item :key="index">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" size="70%"></q-skeleton>
        </q-item-section>
        <q-item-section>
          <q-skeleton type="text"></q-skeleton>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-virtual-scroll>
</template>