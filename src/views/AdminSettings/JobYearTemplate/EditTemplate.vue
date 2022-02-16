<template>
  <q-card>
    <q-card-section class="row">
      <!-- Close Button - Dialog schließen -->
      <div class="col-2">
        <q-btn @click="cancelTemp()" icon="close" flat />
      </div>
      <!-- Title -->
      <div class="col-8 text-center">
        <div class="text-h6">{{ formTitle() }}</div>
      </div>
    </q-card-section>
    <q-card-section v-if="!loading">
      <q-form @submit="saveTemp">
        <q-input
          label="Template Name"
          v-model="editItem.name"
          :rules="[singleRules.stringRequired]"
        />
        <q-input
          label="Zusatz (optional)"
          v-model="editItem.zusatz"
          :rules="[]"
        />
        <q-select
          label="Ausbilder"
          v-model="editItem.trainer"
          :options="trainerOptions"
          option-value="id"
          option-label="first_name"
          map-options
          emit-value
          :rules="[singleRules.stringRequired]"
        ></q-select>

        <!-- Radio Toggles -->
        <div class="q-my-sm">
          <div class="row">
            <div class="col">
              <div>Berichtsheftart</div>
              <q-option-group
                v-model="editItem.daily"
                :options="[
                  { label: 'Wöchentlich', value: false },
                  { label: 'Täglich', value: true },
                ]"
              />
            </div>
            <div class="col">
              <div>Freigabeprozess</div>
              <q-option-group
                v-model="editItem.approval"
                :options="[
                  { label: 'TL + Ausbilder', value: true },
                  { label: 'Nur Ausbilder', value: false },
                ]"
              />
            </div>
          </div>
        </div>

        <!-- Mögliche Abteilungen -->
        <div class="q-my-sm">
          <q-select
            label="Mögliche Abteilungen"
            v-model="editItem.teams"
            :options="teamOptions"
            multiple
            option-value="id"
            option-label="name"
            map-options
            use-chips
            emit-value
            use-input
            @filter="filterTeams"
            input-debounce="0"
            :rules="[singleRules.stringRequired]"
          ></q-select>
        </div>

        <!-- Ausbildungszeitraum -->
        <div class="q-my-sm">
          <div>Ausbildungszeitraum:</div>
          <div class="row">
            <q-input label="Von" v-model="editItem.date_start"></q-input>
            <q-input label="Bis" v-model="editItem.date_end"></q-input>
            <q-input
              label="Dauer"
              type="number"
              min="1"
              max="5"
              v-model="editItem.years"
            ></q-input>
          </div>

          <div>{{ exampleAusbildungsdauer }}</div>
        </div>

        <!-- Buttons -->
        <div class="row justify-between">
          <div class="col" v-if="props.index !== -1">
            <q-btn @click="deleteTemp()">Delete</q-btn>
          </div>
          <div class="col row justify-end">
            <q-btn type="submit" label="Speichern" />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <!-- Error Handling -->
    <q-card-section v-if="!!error">
      <error-banner :error="error" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { PropType, reactive, ref, computed } from 'vue';

// LIB
import { singleRules } from 'lib/utils';
import { apiAllTlandTrainer, apiTeams } from 'lib/admin/departments/types';
import { apiJobTemplate, Template } from 'lib/admin/templates/types';
import {
  deleteTemplate,
  emptyTemplate,
  getTemplateDetails,
  saveTemplate,
} from 'lib/admin/templates/templates';

// props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  trainers: {
    type: Object as PropType<apiAllTlandTrainer[]>,
    required: true,
  },
  teams: {
    type: Object as PropType<apiTeams[]>,
    required: true,
  },
});

// emits
const emit = defineEmits(['save', 'delete', 'cancel']);

const loading = ref(false);
const error = ref('');

const teamOptions = ref(props.teams);
const trainerOptions = ref(props.trainers);

const editItem = reactive({ ...emptyTemplate } as Template);

if (props.id !== -1) {
  getTemplateDetails(props.id)
    .then((res) => {
      Object.assign(editItem, res);
      if (props.index === -1) {
        editItem.zusatz += ' copy';
      }
    })
    .catch((e: string) => {
      error.value = e;
    });
}

const saveTemp = () => {
  if (props.index === -1) {
    editItem.id = -1;
  }
  saveTemplate(editItem as apiJobTemplate)
    .then((res) => {
      editItem.id = res;

      emit('save', editItem);
    })
    .catch((e: string) => {
      error.value = e;
    });
};

const cancelTemp = () => {
  emit('cancel');
};

const deleteTemp = () => {
  deleteTemplate(props.id)
    .then(() => {
      emit('delete');
    })
    .catch((e: string) => {
      error.value = e;
    });
};

const formTitle = () => {
  if (props.id === -1 && props.index === -1) {
    return 'Neues Template erstellen';
  } else if (props.id !== -1 && props.index === -1) {
    return 'Template kopieren';
  } else {
    return 'Template bearbeiten';
  }
};

type voidFn = () => void;
type doneFn = (a: voidFn) => void;

const filterTeams = (val: string, update: doneFn) => {
  update(() => {
    const needle = val.toLowerCase();
    teamOptions.value = props.teams.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

/**
 * Damit man ein Beispiel sieht, von wann bis
 * wann der Ausbildungszeitraum ist.
 * z.B. von 1.9.2021 bis 30.6.2024
 */
const exampleAusbildungsdauer = computed(() => {
  const duration = parseInt(editItem.years as unknown as string);

  const [startMonth, startDay] = editItem.date_start.split('-');
  const [endMonth, endDay] = editItem.date_end.split('-');

  const currentYear = new Date().getFullYear();

  // -1 , da Januar=0 , December=11
  const startDate = new Date(
    currentYear,
    parseInt(startMonth) - 1,
    parseInt(startDay)
  ).toLocaleDateString('de');

  // -1 , da Januar=0 , December=11
  const endDate = new Date(
    currentYear + duration,
    parseInt(endMonth) - 1,
    parseInt(endDay)
  ).toLocaleDateString('de');

  return `z.B. von ${startDate} bis ${endDate}`;
});
</script>
