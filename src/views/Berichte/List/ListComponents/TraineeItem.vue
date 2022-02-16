<template>
  <q-item clickable :to="{ path: `/reports/u/${trainee.user.id}/` }">
    <q-item-section>
      {{ trainee.user.first_name }} {{ trainee.user.last_name }}
    </q-item-section>

    <q-item-section avatar class="relative-position">
      <q-icon name="flaky"></q-icon>
      <q-badge
        :color="getUnreleasedUi(trainee.unreleased)"
        floating
        :label="trainee.unreleased"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { MobileTraineeListAPI } from 'lib/reports/types';
import { getUnreleasedUi } from 'lib/reports/supervisor';

defineProps({
  trainee: {
    type: Object as PropType<MobileTraineeListAPI>,
    required: true,
  },
});
</script>
