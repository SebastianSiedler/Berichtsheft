<template>
  <div>
    <q-table
      title="Abteilungen"
      :rows="departments"
      :columns="columns"
      row-key="id"
      @row-click="onRowClicked"
      :loading="loading"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="100"
          v-model="filter"
          placeholder="Suchen"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn icon="refresh" flat round @click="getDepList()"></q-btn>
        <q-btn @click="addNewTeam()" icon="add" flat round></q-btn>
      </template>
    </q-table>

    <!-- Edit Item dialog -->
    <q-dialog v-model="dialog" persistent>
      <edit-team
        :item="clickedItem"
        :trainers="users"
        @onSaved="onSavedTeam"
        @onDeleted="onDeletedTeam"
        @onCanceled="onCanceledTeam"
      />
    </q-dialog>
    <error-banner v-if="!!error" :error="error" />
  </div>
</template>

<script lang="ts" setup>
// NPM
import { reactive, ref } from 'vue';

// LIB
import { getDepartmentsList } from 'lib/admin/departments/departments';
import { apiAllTlandTrainer, TeamsTable } from 'lib/admin/departments/types';

// COMPONENTS
import EditTeam from './EditTeam.vue';

const columns = [
  {
    name: 'name',
    label: 'Team Name',
    field: 'teamName',
  },
  {
    name: 'user',
    label: 'user',
    field: 'trainerName',
  },
];

const error = ref('');
const loading = ref(false);

let departments = reactive([] as TeamsTable[]);
let users = reactive([] as apiAllTlandTrainer[]);

const dialog = ref(false);
const emptyItem = {
  teamId: -1,
  teamName: '',
  trainerId: null,
  trainerName: '',
};
const clickedItem: TeamsTable = reactive({ ...emptyItem });
let activeIndex = -1;

const resetItem = () => {
  Object.assign(clickedItem, emptyItem);
};

/**
 * Läd die Daten aus der API für Teams
 * und alle Teamleiter / Ausbilder
 */
const getDepList = () => {
  loading.value = true;
  getDepartmentsList()
    .then((res) => {
      Object.assign(departments, res.departments);
      Object.assign(users, res.trainers);
    })
    .catch((e: string) => {
      error.value = e;
    })
    .finally(() => {
      loading.value = false;
    });
};
getDepList();

/**
 * Wenn in eine Reihe geklickt wird, öffnet sich edit Fenster
 * Zum bearbeiten oder löschen
 */
const onRowClicked = (evt: unknown, row: TeamsTable, index: number): void => {
  resetItem();
  Object.assign(clickedItem, row);
  activeIndex = index;
  dialog.value = true;
};

/**
 * Ein neues Team hinzufügen
 */
const addNewTeam = () => {
  resetItem();
  dialog.value = true;
};

/**
 * Wenn EditTeam gespeichert wurde emitet es
 * Team wird dem departments array hinzugefügt bzw. überschrieben
 */
const onSavedTeam = (savedTeam: TeamsTable) => {
  const vorhanden = departments.find(
    (team) => team.teamId === savedTeam.teamId
  );
  if (!!vorhanden) {
    Object.assign(vorhanden, savedTeam);
  } else {
    departments.push(savedTeam);
  }
  dialog.value = false;
  resetItem();
};

/**
 * Wenn im EditTeam der LÖschen Knopf emitet wurde
 */
const onDeletedTeam = () => {
  departments.splice(activeIndex, 1);
  dialog.value = false;
  resetItem();
};

/**
 * Wenn im EditTeam der Knopf Cancel emitet wurde
 */
const onCanceledTeam = () => {
  dialog.value = false;
  resetItem();
};

const filter = ref('');
</script>
