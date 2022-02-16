<template>
  <div>
    <p class="text-h2">Los geht's</p>
    <p>Welche Art von Account möchten Sie erstellen</p>
    <q-list>
      <q-item
        v-for="item in items"
        class="q-my-md rounded"
        :key="item.title"
        clickable
        :to="`/signup/${item.link}`"
        :disable="!item.active"
        style="height: 100px"
      >
        <q-item-section avatar>
          <q-avatar color="primary" size="75px">
            <q-icon :name="item.icon" size="sm" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-h6">
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.subtitle }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <p>
      <span>Sie haben ein Konto? </span>
      <router-link to="/login">Anmelden</router-link>
    </p>
  </div>
</template>

<script lang="ts" setup>
const items = [
  {
    title: 'Business',
    subtitle: 'Für den Einsatz im Unternehmen',
    link: 'enterprise',
    icon: 'business',
    active: true,
  },
  {
    title: 'Privat',
    subtitle: 'Für den privaten Gebrauch - coming soon',
    link: 'private',
    icon: 'person',
    active: false,
  },
];
</script>
