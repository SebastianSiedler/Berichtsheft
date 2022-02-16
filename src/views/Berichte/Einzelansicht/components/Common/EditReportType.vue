<template>
  <q-card style="width: 360px">
    <q-card-section class="row">
      <div class="col-3">
        <q-btn icon="close" @click="$emit('close')" flat />
      </div>
      <div class="col">
        <div class="text-h6">Bericht ändern</div>
      </div>
    </q-card-section>

    <!-- Loading -->
    <q-card-section v-if="loading">
      <p>Loading ...</p>
    </q-card-section>

    <!-- Bearbeiten -->
    <q-card-section v-else>
      <q-form @submit="onSubmit">
        <!-- rtype (Berichte, Schule, Kombiniert) -->
        <q-select
          v-model="rtype"
          :options="rtypes"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          :rules="[singleRules.stringRequired]"
        ></q-select>

        <!-- Team -->
        <q-select
          v-if="rtype != 'S'"
          v-model="teamId"
          :options="teams"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          :rules="[singleRules.stringRequired]"
        />

        <div class="row justify-end q-mt-md">
          <q-btn type="submit">Speichern</q-btn>
        </div>
      </q-form>
    </q-card-section>

    <!-- Error -->
    <q-card-section v-if="!!error">
      <error-banner :error="error" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { rtypes } from 'lib/reports/common';
import { useReportStore } from 'lib/reports/einzelansicht';
import { GetTraineeTeam } from 'lib/reports/types';
import { singleRules } from 'lib/utils/rules';

// emits
const emit = defineEmits(['close']);

const reportStore = useReportStore();
const loading = ref(true);
const error = ref('');

const teams = ref([] as GetTraineeTeam[]);

const loadTeams = () => {
  loading.value = true;
  error.value = '';
  reportStore
    .getTeams()
    .then((res) => {
      teams.value = res;
    })
    .catch((e: string) => {
      error.value = e;
    })
    .finally(() => {
      loading.value = false;
    });
};
loadTeams();

const rtype = ref(reportStore.state.report.rtype);
const teamId = ref(reportStore.state.report.team?.id);

const onSubmit = () => {
  reportStore
    .patchReportMeta(rtype.value, teamId.value)
    .then(() => emit('close'))
    .catch((e: string) => (error.value = e));
};
</script>
