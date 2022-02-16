<template>
  <div>
    <!-- Bericht Typ: Schule, Betireb, Kombiniert -->
    <div class="row q-col-gutter-md" v-if="!reportStore.state.report.is_daily">
      <div class="col" v-for="type in rtypes" :key="type.name">
        <q-card
          bordered
          flat
          class="cursor-pointer text-center"
          @click="selectedTypeId = type.id"
          :class="selectedTypeId == type.id ? '' : 'bg-transparent'"
          :style="
            selectedTypeId == type.id ? 'background: var(--primaryweak)' : ''
          "
        >
          <q-card-section>
            <q-icon :name="type.icon" size="md" />
          </q-card-section>
          <q-card-section> {{ type.name }} </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Teams auswahl -->
    <div v-if="selectedTypeId != 'S'">
      <p v-if="loading">Loading...</p>
      <q-list v-else style="height: 50vh; overflow: auto">
        <q-item
          v-for="team in filterTeams"
          :key="team.id"
          clickable
          @click="selectedTeam = team"
          :active="JSON.stringify(team) == JSON.stringify(selectedTeam)"
          active-class=""
        >
          <q-item-section> {{ team.name }}</q-item-section>
        </q-item>
      </q-list>
      <q-input v-model="inputQuery" outlined label="Team Name" />
    </div>

    <div class="row justify-end q-mt-md">
      <q-btn
        :disable="!((selectedTeam || selectedTypeId == 'S') && selectedTypeId)"
        @click="onSubmit()"
      >
        Weiter</q-btn
      >
    </div>
    <error-banner v-if="!!error" :error="error" />
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref, computed, watch } from 'vue';

// LIB
import { rtypes } from 'lib/reports/common';
import { GetTraineeTeam } from 'lib/reports/types';
import { useReportStore } from 'lib/reports/einzelansicht';

const reportStore = useReportStore();
const loading = ref(true);
const loadingBtn = ref(false);
const error = ref('');

const teams = ref([] as GetTraineeTeam[]);

const selectedTypeId = ref<string>();
const selectedTeam = ref<GetTraineeTeam>();
const inputQuery = ref('');

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

watch(
  () => reportStore.state.report.nr,
  () => {
    loadTeams();
  },
  {
    immediate: true,
  }
);

const filterTeams = computed(() => {
  const needle = inputQuery.value.toLowerCase();

  const filtered = teams.value.filter(
    (v) => v.name.toLowerCase().indexOf(needle) > -1
  );

  return filtered;
});

watch(
  () => filterTeams.value.length,
  (len) => {
    if (len == 1) {
      selectedTeam.value = filterTeams.value[0];
    }
  }
);

const onSubmit = () => {
  loadingBtn.value = true;
  reportStore
    .create(selectedTypeId.value, selectedTeam.value?.id)
    .catch((e: string) => (error.value = e))
    .finally(() => (loadingBtn.value = false));
};
</script>
