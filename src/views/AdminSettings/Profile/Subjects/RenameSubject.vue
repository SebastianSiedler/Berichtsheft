<template>
  <q-card style="width: 400px">
    <q-form @submit="save">
      <q-card-section class="row cols-12">
        <!-- Close Button -->
        <div class="col-2">
          <q-btn icon="close" flat @click="$emit('close')" />
        </div>

        <!-- Headline -->
        <div class="col-8 text-center">
          <div class="text-h6">Fach umbenennen</div>
        </div>
      </q-card-section>

      <!-- Rename Subject -->
      <q-card-section>
        <q-input
          :label="subject.name + ' umbenennen'"
          v-model="newName"
          :rules="[singleRules.subjectMaxLen, singleRules.stringRequired]"
        />
      </q-card-section>

      <!-- Error -->
      <q-card-section v-if="error">
        <error-banner :error="error" />
      </q-card-section>

      <!-- Save Button -->
      <q-card-section>
        <div class="row justify-end">
          <q-btn type="submit" :loading="loading">Speichern</q-btn>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
// NPM
import { PropType, ref } from 'vue';

// LIB
import { SubjectAPI, renameSubjectAPI } from 'lib/admin/profile/subjects';
import { singleRules } from 'lib/utils/rules';

// props
const props = defineProps({
  subject: {
    required: true,
    type: Object as PropType<SubjectAPI>,
  },
});

// emits
const emit = defineEmits(['renameSuccess', 'close']);

const newName = ref(props.subject.name);

const loading = ref(false);
const error = ref('');

const save = async () => {
  loading.value = true;
  error.value = '';
  try {
    await renameSubjectAPI(props.subject.id, newName.value);
    emit('renameSuccess', { ...props.subject, name: newName.value });
    emit('close');
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};
</script>
