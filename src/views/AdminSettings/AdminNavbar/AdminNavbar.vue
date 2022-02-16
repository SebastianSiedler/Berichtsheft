<template>
  <div>
    <q-list>
      <q-item
        v-for="item in items"
        clickable
        v-ripple
        :to="`/admin/${item.to}`"
        :key="item.to"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.title }} </q-item-label>
          <q-item-label caption>{{ item.desc }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts" setup>
const items = [
  {
    title: 'Profile',
    desc: 'lorem ipsum dolor sit ammet',
    icon: 'person_outline',
    to: 'profile',
  },
  {
    title: 'Abteilungen',
    desc: 'lorem ipsum',
    icon: 'work_outline',
    to: 'departments',
  },
  {
    title: 'Templates',
    desc: 'lorem ipsum',
    icon: 'content_paste',
    to: 'jobyeartemplate',
  },
  {
    title: 'User Management',
    desc: 'lorem ipsum',
    icon: 'people_outline',
    to: 'usermanagement',
  },
  {
    title: 'Billing',
    desc: 'lorem ipsum dolor sit ammet',
    icon: 'credit_card',
    to: 'billing',
  },
];
</script>
