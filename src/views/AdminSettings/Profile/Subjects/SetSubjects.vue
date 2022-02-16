<template>
  <div>
    <span class="text-h6">Fächer</span>

    <!-- Loading -->
    <p v-if="loadingSubjects">Loading Subjects ...</p>

    <!-- Subject List -->
    <div v-else>
      <!-- List with all Subjects -->
      <q-list>
        <q-item v-for="sub in subjects" :key="sub.id">
          <q-item-section> {{ sub.name }} </q-item-section>
          <q-item-section side>
            <div class="row">
              <!-- Edit Subject -->
              <q-btn
                icon="edit"
                flat
                @click="
                  renameItem = sub;
                  renameDialog = true;
                "
              />

              <!-- Delete Subject -->
              <q-btn icon="delete" @click="deleteSubject(sub.id)" flat />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Add Subject -->
      <q-form @submit="addSubject" ref="form">
        <q-item>
          <q-item-section>
            <q-input
              label="Fach hinzufügen"
              :rules="[singleRules.stringRequired, singleRules.subjectMaxLen]"
              lazy-rules
              v-model="newSubjectName"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn icon="add" flat type="submit" />
          </q-item-section>
        </q-item>
      </q-form>
    </div>

    <q-dialog v-model="renameDialog">
      <SubjectLine
        :subject="renameItem"
        @renameSuccess="onRenameSuccess"
        @close="renameDialog = false"
      />
    </q-dialog>

    <!-- Error -->
    <error-banner v-if="!!error" :error="error" />
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import { singleRules } from 'lib/utils/rules';
import {
  getSubjectListAPI,
  SubjectAPI,
  deleteSubjectAPI,
  addSubjectAPI,
} from 'lib/admin/profile/subjects';

// COMPONENTS
import SubjectLine from './RenameSubject.vue';

const loadingSubjects = ref(true);
const error = ref('');

const subjects = ref<SubjectAPI[]>([]);

/**
 * Liste aller Fächer
 */
const getSubjectList = () => {
  loadingSubjects.value = true;
  error.value = '';
  getSubjectListAPI()
    .then((res) => (subjects.value = res))
    .catch((e: string) => {
      error.value = e;
    })
    .finally(() => (loadingSubjects.value = false));
};
getSubjectList();

/**
 * Fach löschen
 */
const deleteSubject = (subjectId: number) => {
  if (window.confirm('Möchtest du das Fach wirklich löschen?')) {
    deleteSubjectAPI(subjectId).then(() => {
      const index = subjects.value.findIndex(
        (subject) => subject.id == subjectId
      );
      subjects.value.splice(index, 1);
    });
  }
};

/**
 * Fach hinzufügen
 */
const form = ref();
const newSubjectName = ref('');
const addSubject = () => {
  addSubjectAPI(newSubjectName.value)
    .then((sub) => {
      subjects.value.push(sub);
      newSubjectName.value = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      form.value.reset();
    })
    .catch((e: string) => {
      error.value = e;
    });
};

/**
 * Rename a Subject
 */
const renameDialog = ref(false);

const renameItem = ref<SubjectAPI>({ id: -1, name: '', active: false });

const onRenameSuccess = (subjectEvent: SubjectAPI) => {
  const index = subjects.value.findIndex((el) => el.id == subjectEvent.id);

  if (index >= 0) {
    Object.assign(subjects.value[index], subjectEvent);
  }
};
</script>
