<template>
  <div>
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { onMounted } from 'vue';
import {
  Chart,
  BarElement,
  PointElement,
  BarController,
  CategoryScale,
  LinearScale,
  Decimation,
  Filler,
  Legend,
  Title,
  ChartItem,
} from 'chart.js';

// MISC DATA
import { historyData } from './chart';

Chart.register(
  BarElement,
  PointElement,
  BarController,
  CategoryScale,
  LinearScale,
  Decimation,
  Filler,
  Legend,
  Title
);

onMounted(() => {
  const ctx = document.getElementById('planet-chart') as ChartItem;
  new Chart(ctx, historyData);
});
</script>
