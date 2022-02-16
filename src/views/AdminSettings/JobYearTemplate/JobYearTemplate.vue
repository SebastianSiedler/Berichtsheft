<template>
  <div>
    <q-table
      title="Templates"
      :rows="templates"
      :columns="columns"
      row-key="id"
      @row-click="onRowClicked"
      :loading="loading"
      :filter="filter"
      v-model:selected="selected"
      selection="single"
      virtual-scroll
      :rows-per-page-options="[0]"
      style="height: 100%"
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
        <q-btn @click="loadTemplateList()" icon="refresh" flat round></q-btn>
        <q-btn
          @click="copyTemplate()"
          icon="file_copy"
          flat
          round
          v-if="selected.length"
        />
        <q-btn @click="addTemplate()" icon="add" flat round></q-btn>
      </template>
    </q-table>
    <!-- Edit Item dialog -->
    <q-dialog v-model="dialog" persistent>
      <edit-template
        :id="activeId"
        :index="activeIndex"
        :trainers="users"
        :teams="teams"
        @save="onSaved"
        @delete="onDeleted"
        @cancel="dialog = false"
      />
    </q-dialog>
    <error-banner v-if="!!error" :error="error"> </error-banner>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { getTemplatesList } from 'lib/admin/templates/templates';
import { apiTemplatesOverview, Template } from 'lib/admin/templates/types';
import { TeamsTable } from 'lib/admin/departments/types';
import { apiAllTlandTrainer } from 'lib/admin/departments/types';
import EditTemplate from './EditTemplate.vue';

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
  },
  {
    name: 'aktiv',
    label: 'aktiv',
    field: 'active_users',
  },
];

const loading = ref(true);
const error = ref('');

let teams = reactive<TeamsTable[]>([]);
let users = reactive<apiAllTlandTrainer[]>([]);
let templates = reactive<apiTemplatesOverview[]>([]);

/**
 * alle Daten laden
 */
const loadTemplateList = async () => {
  loading.value = true;

  try {
    const res = await getTemplatesList();

    Object.assign(teams, res.teams);
    Object.assign(users, res.trainers);
    Object.assign(templates, res.templatesOverview);
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};
loadTemplateList();

const dialog = ref(false);

/**
 * Wenn:
 * aktiveId = 3 && activeIndex = -1 => kopieren
 * aktiveId = -1 && activeIndex = -1 => neu anlegen
 * aktiveId = 3 && activeIndex = 4 => öffnen/bearbeiten
 */
const activeId = ref(-1);
const activeIndex = ref(-1);

/**
 * Wenn in eine Reihe geklickt wird, öffnet sich edit Fenster
 * Zum bearbeiten oder löschen
 */
const onRowClicked = (
  evt: unknown,
  row: apiTemplatesOverview,
  index: number
): void => {
  activeIndex.value = index;
  activeId.value = row.id;
  dialog.value = true;
};

const addTemplate = () => {
  activeIndex.value = -1;
  activeId.value = -1;
  dialog.value = true;
};

const selected = ref([] as apiTemplatesOverview[]);

const copyTemplate = () => {
  activeIndex.value = -1;
  activeId.value = selected.value[0].id;
  dialog.value = true;
};

const onSaved = (item: Template) => {
  if (activeIndex.value === -1) {
    templates.unshift({
      id: item.id,
      name: !!item.zusatz ? `${item.name} - ${item.zusatz}` : item.name,
      active_users: 0,
    });
  } else {
    Object.assign(templates[activeIndex.value], {
      name: !!item.zusatz ? `${item.name} - ${item.zusatz}` : item.name,
    });
  }
  dialog.value = false;
};

const onDeleted = () => {
  templates.splice(activeIndex.value, 1);
  dialog.value = false;
};

const filter = ref('');
</script>
