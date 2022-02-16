<template>
  <div>
    <q-table
      title="Nutzer"
      :rows="users"
      :columns="columns"
      :loading="loading"
      row-key="id"
      selection="multiple"
      v-model:selected="selected"
      :filter="filter"
      @row-click="onRowClicked"
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
        <q-btn icon="refresh" flat round @click="loadUsersList()"></q-btn>
        <q-btn
          icon="add"
          @click="addUser()"
          flat
          round
          v-if="!selected.length"
        />
        <q-btn icon="delete" @click="deleteMultiUser()" flat round v-else />
      </template>

      <!-- isTrainee, wenn Azubi grünes Häckchen -->
      <template v-slot:body-cell-isTrainee="props">
        <q-td :props="props">
          <div>
            <q-icon name="done" v-if="props.value" color="green" size="sm" />
          </div>
          <div>
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
    </q-table>
    <!-- Edit Item dialog -->
    <q-dialog v-model="dialog" persistent>
      <EditUser
        :id="activeId"
        :index="activeIndex"
        :templates="templates"
        @onSaved="onSaved"
        @onCanceled="onCanceled"
      />
    </q-dialog>
    <error-banner v-if="!!error" :error="error"></error-banner>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { apiTemplatesOverview } from 'lib/admin/templates/types';
import { SingleUser, InitUser } from 'lib/admin/userManagement/types';
import {
  deleteUserApi,
  initUsersApi,
} from 'lib/admin/userManagement/userManagement';

// COMPONENTS
import EditUser from './EditUser.vue';

const columns = [
  {
    name: 'lastName',
    label: 'Nachname',
    field: 'last_name',
  },
  {
    name: 'firstName',
    label: 'Vorname',
    field: 'first_name',
  },
  {
    name: 'isTrainee',
    label: 'Azubi',
    field: 'is_trainee',
  },
];

const loading = ref(true);
const error = ref('');

const dialog = ref(false);

const users = ref<InitUser[]>([]);
const templates = ref<apiTemplatesOverview[]>([]);

const loadUsersList = () => {
  loading.value = true;
  initUsersApi()
    .then((res) => {
      users.value = res.users;
      templates.value = res.templates;
    })
    .catch((e: string) => (error.value = e))
    .finally(() => (loading.value = false));
};
loadUsersList();

/**
 * Wenn:
 * aktiveId = 3 && activeIndex = -1 => kopieren
 * aktiveId = -1 && activeIndex = -1 => neu anlegen
 * aktiveId = 3 && activeIndex = 4 => öffnen/bearbeiten
 */

const activeId = ref(-1);
const activeIndex = ref(-1);

const onRowClicked = (evt: unknown, row: InitUser, index: number): void => {
  activeIndex.value = index;
  activeId.value = row.id;
  dialog.value = true;
};

const addUser = () => {
  activeIndex.value = -1;
  activeId.value = -1;
  dialog.value = true;
};

const selected = ref<InitUser[]>([]);
/**
 * TODO: copyUser integrieren
 
const copyUser = () => {
  activeIndex.value = -1;
  activeId.value = selected.value[0].id;
  dialog.value = true;
};
*/

const onSaved = (item: SingleUser) => {
  // neuen user in Tabelle an erste Stelle
  if (activeIndex.value === -1) {
    users.value.unshift(item);
  } else {
    users.value[activeIndex.value] = item;
  }
  dialog.value = false;
};

const onCanceled = () => {
  dialog.value = false;
};

const deleteMultiUser = async () => {
  for (const item of selected.value) {
    try {
      await deleteUserApi(item.id);
      const index = users.value.indexOf(item);
      users.value.splice(index, 1);
    } catch (e) {
      error.value = `User ${item.first_name} ${
        item.last_name
      } löschen fehlgeschlagen! (${JSON.stringify(e)})`;
    }
  }
};

const filter = ref('');
</script>
