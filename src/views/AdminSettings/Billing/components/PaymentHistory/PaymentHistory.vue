<template>
  <div>
    <table>
      <thead>
        <tr>
          <td>Rechnungs-ID</td>
          <td>Datum</td>
          <td>Preis</td>
          <td>Plan/Produkt</td>
          <td>Lizenzen</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>
            <div><q-icon name="open_in_new" />{{ item.id }}</div>
          </td>
          <td>{{ item.date }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.plan }}</td>
          <td>{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>

    <Chart style="max-width: 50%" />
  </div>
</template>

<script lang="ts" setup>
// COMPONENTS
import Chart from './charts.vue';

const history = [
  {
    id: 2,
    date: '01.07.2021',
    price: '10.35€',
    plan: 'Berichtsheft Monatlich',
    amount: 34,
  },
  {
    id: 3,
    date: '01.08.2021',
    price: '10.35€',
    plan: 'Berichtsheft Monatlich',
    amount: 34,
  },
  {
    id: 4,
    date: '01.09.2021',
    price: '10.35€',
    plan: 'Berichtsheft Monatlich',
    amount: 34,
  },
  {
    id: 5,
    date: '01.10.2021',
    price: '10.35€',
    plan: 'Berichtsheft Monatlich',
    amount: 34,
  },
];
</script>
