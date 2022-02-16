<template>
  <q-card style="width: 360px">
    <q-card-section class="row">
      <!-- Dialog schließen -->
      <div class="col-2">
        <q-btn @click="cancelTeam()" icon="close" flat />
      </div>
      <!-- Title -->
      <div class="col-8 text-center">
        <div class="text-h6">{{ formTitle() }}</div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="saveTeam">
        <!-- Input -->
        <q-input
          v-model="team.teamName"
          label="Team Name"
          :rules="rules.teamName"
        ></q-input>
        <!-- Autocomplete -->
        <q-select
          label="Teamleiter"
          v-model="team.trainerId"
          :options="options"
          use-input
          fill-input
          hide-selected
          option-value="id"
          option-label="first_name"
          map-options
          emit-value
          @filter="filterFn"
          input-debounce="0"
          ><template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Button -->
        <div class="row q-mt-md">
          <div class="col" v-if="team.teamId !== -1">
            <q-btn @click="deleteTeam()">Delete</q-btn>
          </div>
          <div class="col row justify-end">
            <q-btn type="submit" label="Speichern" />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section v-if="!!error">
      <error-banner :error="error" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { PropType, reactive, ref } from 'vue';

// LIB
import { apiAllTlandTrainer, TeamsTable } from 'lib/admin/departments/types';
import { rules } from 'lib/utils';
import {
  deleteApiTeam,
  saveApiTeam,
  apiTeamToTable,
} from 'lib/admin/departments/departments';

const props = defineProps({
  item: {
    type: Object as PropType<TeamsTable>,
    required: true,
  },
  trainers: {
    type: Object as PropType<apiAllTlandTrainer[]>,
    required: true,
  },
});

const trainers = ref([...props.trainers]);

/**
 * Damit man "kein Teamleiter" auswählen kann
 */
trainers.value.unshift({
  ...trainers.value[0],
  first_name: '- leer -',
  id: -1,
});

const emit = defineEmits(['onSaved', 'onDeleted', 'onCanceled']);

const options = ref(trainers.value);
const team = reactive(props.item);
const error = ref('');

const formTitle = () => {
  return props.item.teamId === -1 ? 'Neues Team erstellen' : 'Team bearbeiten';
};

type voidFn = () => void;
type doneFn = (a: voidFn) => void;

const filterFn = (val: string, update: doneFn) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = trainers.value.filter(
      (v) => v.first_name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const saveTeam = () => {
  saveApiTeam(team)
    .then((apiTeam) => {
      const tableTeam = apiTeamToTable(apiTeam, props.trainers);
      emit('onSaved', tableTeam);
    })
    .catch((e: string) => {
      error.value = e;
    });
};

/**
 * Team löschen über den Löschen Button
 */
const deleteTeam = () => {
  deleteApiTeam(team.teamId)
    .then(() => {
      emit('onDeleted');
      console.log('delete');
    })
    .catch((e: string) => {
      error.value = e;
    });
};

const cancelTeam = () => {
  emit('onCanceled');
};
</script>
