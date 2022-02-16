<template>
  <div>
    <!-- Error -->
    <error-banner :error="error" />

    <!-- Loading -->
    <div v-if="loading">Loading ...</div>

    <!-- Component -->
    <template v-else>
      <div v-for="year in subjectsYearly" :key="year.id" class="q-mb-lg">
        <div class="text-h6">{{ year.nr }}. Lehrjahr</div>
        <div class="row">
          <div
            class="col-sm-6 col-md-4 col-lg-3 col-xl-2"
            v-for="subject in subjects[year.nr - 1].subjects"
            :key="subject.id"
          >
            <q-checkbox
              v-model="year.subjects"
              :val="subject.id"
              :label="subject.name"
            />
          </div>
        </div>
      </div>

      <div class="row justify-between">
        <q-btn @click="submit" :disable="!changed">
          Änderungen speichern
        </q-btn>

        <q-btn
          @click="subjectsYearly = yearlyBackup.map((x) => ({ ...x }))"
          :disable="!changed"
          >Änderungen verwerfen</q-btn
        >
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref, computed } from 'vue';

// LIB
import { getSubjectsList, updateSubjectYear } from 'lib/settings/settings';
import { GetSubjectsYearlyAPI } from 'lib/settings/types';
import { isDifferent } from 'lib/utils';
import { GetSubjectAPI } from 'lib/admin/templates/types';

const loading = ref(true);
const error = ref('');

const subjectsYearly = ref<GetSubjectsYearlyAPI[]>([]);
const yearlyBackup = ref<GetSubjectsYearlyAPI[]>([]);
const subjectslist = ref<GetSubjectAPI[]>([]);

const subjects = ref();

/**
 * Da es sein kann, dass ein Fach gelöscht wurde aber weiterhin vom
 * Azubi in Verwendung ist, muss es für dieses eine Jahr noch angezeigt werden.
 * Sobald der Haken bei einem gelöschte Fach einmal weg ist und gespeichert wurde,
 * soll das Fach für dieses Jahr verschwinden
 */
const filterDeletedSubjects = () => {
  const subsYearly = subjectsYearly.value;
  const subsList = subjectslist.value;

  subjects.value = subsYearly.map((year) => {
    // Alle Fächer die noch nicht gelöscht wurden vom Admin
    const activeSubjects = subsList.filter((sub) => sub.active == true);

    // Alle Fächer die bereits gelöscht wurden, aber weiterhin vom Azubi in verwendung sind
    const remainingSubjects = subsList.filter((sub) =>
      year.subjects.includes(sub.id)
    );

    const availableSubjects = [...activeSubjects, ...remainingSubjects];

    /* Sort by Name */
    availableSubjects.sort((a, b) => a.name.localeCompare(b.name));

    /* Remove dublicates */
    const uniqSubjects = [...new Set(availableSubjects)];

    return {
      id: year.id,
      nr: year.nr,
      subjects: uniqSubjects,
    };
  });
};

/* Set Subjects and subjectsYearly */
const fetchSubjects = async () => {
  try {
    const { subjectYearly, subjectList } = await getSubjectsList();

    subjectsYearly.value = subjectYearly.map((x) => ({ ...x })); // Copy Array of objects without reference
    yearlyBackup.value = subjectYearly.map((x) => ({ ...x })); // Copy Array of objects without reference

    subjectslist.value = subjectList;

    filterDeletedSubjects();
  } catch (e) {
    error.value = e as string;
  }
  loading.value = false;
};
fetchSubjects();

/* Speichern Button deaktivieren, wenn keine Änderungen vorgenommen wurden */
const changed = computed(() =>
  isDifferent(yearlyBackup.value, subjectsYearly.value)
);

/**
 * Speicht die jeweils geänderten Lehrjahre ab
 */
const submit = async () => {
  // Ein Array mit den Lehrjahren, in denen sich etwas geändert hat
  const changedYears = subjectsYearly.value.filter((year, i) => {
    return isDifferent(yearlyBackup.value[i], year);
  });

  for (const year of changedYears) {
    const {
      error: submitError,
      data: savedYear,
      fetch,
    } = updateSubjectYear(year);

    try {
      await fetch();
      const index = yearlyBackup.value.findIndex(
        (y) => y.id == savedYear.value.id
      );
      yearlyBackup.value[index] = savedYear.value;

      // Remove unchecked deleted Subjects
      filterDeletedSubjects();
    } catch (e) {
      error.value =
        submitError.value ||
        `Fehler beim Aktualisieren des ${year.nr}. Lehrjahres`;
    }
  }
};
</script>
