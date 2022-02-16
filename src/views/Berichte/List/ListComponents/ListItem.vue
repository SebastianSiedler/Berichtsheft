<template>
  <q-item
    :to="
      supervisor
        ? `${report.id}`
        : { name: 'TraineeView', params: { id: report.nr } }
    "
    active-class="active-item-bg"
  >
    <!-- Wenn Azubi -->
    <template v-if="$store.state.auth.user.is_trainee">
      <!-- Daily -->
      <q-item-section v-if="report.is_daily">
        <q-item-label>
          <strong>{{ report.nr }}:</strong>
          {{ formDate(report.date_start) }} - {{ formDate(report.date_end) }}
        </q-item-label>
      </q-item-section>

      <!-- Weekly -->
      <template v-else>
        <q-item-section avatar>
          <q-icon
            rounded
            class="my-0"
            :name="format_type.icon"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong>{{ report.nr }} - {{ format_type.name }}</strong>
          </q-item-label>
          <q-item-label>
            {{ formDate(report.date_start) }} - {{ formDate(report.date_end) }}
          </q-item-label>
        </q-item-section>
      </template>
    </template>

    <!-- Ausbilder -->
    <template v-else>
      <q-item-section avatar>
        <q-icon rounded class="my-0" :name="format_type.icon" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <strong>{{ report.nr }} - {{ format_type.name }}</strong>
        </q-item-label>
        <q-item-label>
          {{ formDate(report.date_start) }} - {{ formDate(report.date_end) }}
        </q-item-label>
      </q-item-section>
    </template>
    <q-item-section avatar>
      <q-icon :name="format_status.icon" :color="format_status.color"> </q-icon>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { PropType, computed, toRefs } from 'vue';
import { getRTypeUi, getStatusUi } from 'lib/reports/common';
import { GetReportsOverviewAPI } from 'lib/reports/types';

const props = defineProps({
  report: {
    type: Object as PropType<GetReportsOverviewAPI>,
    required: true,
  },
  supervisor: {
    type: Boolean,
  },
});

const { report: rep } = toRefs(props);

/**
 * Icon und Farbe für das linke Icon
 */
const format_type = computed(() => {
  const rtype = rep.value.rtype;
  // Betrieb = B
  return getRTypeUi(rtype);
});

/**
 * Icon und Farbe für das rechte Icon
 */
const format_status = computed(() => {
  const status = rep.value.status;
  return getStatusUi(status);
});

const formDate = (date: string) => {
  return new Date(date).toLocaleString('de-DE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
};
</script>

<style>
.active-item-bg {
  background-color: #1573f630;
}
</style>
