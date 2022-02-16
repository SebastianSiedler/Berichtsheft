<template>
  <div>
    <q-card>
      <q-card-section class="row">
        <!-- Close Button - Dialog schließen -->
        <div class="col-2">
          <q-btn @click="cancelUser()" icon="close" flat />
        </div>
        <!-- Title -->
        <div class="col-8 text-center">
          <span class="text-h6">{{ formTitle() }}</span>
        </div>
      </q-card-section>

      <p v-if="loading">Loading...</p>

      <q-card-section v-else>
        <q-form @submit="saveUser">
          <q-input
            label="Mail"
            v-model="editItem.username"
            :rules="rules.mailRules"
            lazy-rules
          />
          <q-select
            label="Geschlecht"
            :options="genders"
            v-model="editItem.salutation"
            map-options
            emit-value
            option-label="text"
            option-value="value"
            :rules="[singleRules.stringRequired]"
            lazy-rules
          />
          <q-input
            label="Vorname"
            v-model="editItem.first_name"
            :rules="rules.userFirstName"
            lazy-rules
          />
          <q-input
            label="Nachname"
            v-model="editItem.last_name"
            :rules="rules.userLastName"
            lazy-rules
          />

          <p>
            Ein User kann
            <b>entweder</b> Azubi <b>oder</b> Teamleiter, Ausbilder, Admin sein!
          </p>

          <q-checkbox
            label="Azubi"
            v-model="editItem.is_trainee"
            :disable="
              editItem.is_teamleader ||
              editItem.is_trainer ||
              editItem.is_manager
            "
            :rules="[
              editItem.is_trainee ||
                editItem.is_manager ||
                editItem.is_trainer ||
                editItem.is_teamleader ||
                'Mindestens eins',
            ]"
          />
          <q-checkbox
            label="Teamleiter"
            v-model="editItem.is_teamleader"
            :disable="editItem.is_trainee"
            color="primary"
            :rules="[
              editItem.is_trainee ||
                editItem.is_manager ||
                editItem.is_trainer ||
                editItem.is_teamleader ||
                'Mindestens eins',
            ]"
          />

          <q-checkbox
            label="Ausbilder"
            v-model="editItem.is_trainer"
            :disable="editItem.is_trainee"
            color="primary"
            :rules="[
              editItem.is_trainee ||
                editItem.is_manager ||
                editItem.is_trainer ||
                editItem.is_teamleader ||
                'Mindestens eins',
            ]"
          />
          <q-checkbox
            label="Admin"
            v-model="editItem.is_manager"
            :disable="editItem.is_trainee"
            color="primary"
            :rules="[
              editItem.is_trainee ||
                editItem.is_manager ||
                editItem.is_trainer ||
                editItem.is_teamleader ||
                'Mindestens eins',
            ]"
          />
          <!-- Azubi/Trainee Only Settings -->
          <div v-if="editItem.is_trainee">
            <q-select
              label="Template"
              v-model="editItem.template"
              :options="options"
              use-input
              fill-input
              hide-selected
              option-value="id"
              option-label="name"
              map-options
              emit-value
              @filter="filterFn"
              input-debounce="0"
              :rules="[singleRules.stringRequired]"
              lazy-rules
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              v-model="editItem.start_year"
              label="Startjahr"
              type="number"
              :min="currentYear - 4"
              :max="currentYear + 2"
              :rules="[singleRules.stringRequired]"
              lazy-rules
            />
          </div>

          <!-- Buttons -->
          <div class="row justify-end">
            <q-btn type="submit" label="Speichern" :disable="!changed" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="!!error">
        <error-banner :error="error" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { PropType, ref, computed } from 'vue';

// LIB
import { isDifferent, rules, singleRules } from 'lib/utils';
import { SingleUser } from 'lib/admin/userManagement/types';
import { apiTemplatesOverview } from 'lib/admin/templates/types';
import {
  emptyUser,
  getUserDetailsAPI,
  saveUserApi,
} from 'lib/admin/userManagement/userManagement';

const genders = [
  { text: 'männlich', value: '1' },
  { text: 'weiblich', value: '2' },
  { text: 'divers', value: '3' },
];

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  templates: {
    type: Object as PropType<apiTemplatesOverview[]>,
    required: true,
  },
});

const emit = defineEmits(['onSaved', 'onCanceled']);

const loading = ref(true);
const error = ref('');

const editItem = ref({ ...emptyUser } as SingleUser);
const savedItem = ref({ ...emptyUser } as SingleUser);

if (props.id !== -1) {
  getUserDetailsAPI(props.id)
    .then((res) => {
      Object.assign(editItem.value, res);
      Object.assign(savedItem.value, res);
      // Falls User kopiert wird
      if (props.index == -1) {
        Object.assign(editItem.value, {
          first_name: '',
          last_name: '',
          username: '',
        });
      }
    })
    .catch((e: string) => {
      error.value = e;
    })
    .finally(() => (loading.value = false));
} else {
  loading.value = false;
}

const saveUser = () => {
  if (props.index === -1) {
    editItem.value.id = -1;
  }
  saveUserApi(editItem.value)
    .then((id) => {
      editItem.value.id = id;
      emit('onSaved', editItem.value);
    })
    .catch((e: string) => {
      error.value = e;
    });
};

const cancelUser = () => {
  emit('onCanceled');
};

const formTitle = () => {
  if (props.id === -1 && props.index === -1) {
    return 'Neuen User erstellen';
  } else if (props.id !== -1 && props.index === -1) {
    return 'User kopieren';
  } else {
    return 'User bearbeiten';
  }
};

/**
 * Überprüft, ob sich seit dem öffnen am
 * Objekt etwas geändert hat
 */
const changed = computed(() => isDifferent(savedItem.value, editItem.value));

// Für Template Select
const options = ref(props.templates);

type voidFn = () => void;
type doneFn = (a: voidFn) => void;

const filterFn = (val: string, update: doneFn) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = props.templates.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const currentYear = new Date().getFullYear();
</script>
