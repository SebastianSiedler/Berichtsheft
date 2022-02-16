<template>
  <error-banner v-if="!!error" :error="error" />
  <skeleton v-else-if="loading" />

  <!-- Expansion Item mit Liste der Schulstunden -->
  <template v-else>
    <template v-for="subject in subjectWeek" :key="subject.id">
      <!-- Wenn Bericht abgeschickt und für ein Fach Lessons.length == 0 => wird nicht angezeigt -->
      <q-expansion-item
        v-if="perms.edit || subject.lessons.length"
        :label="subject.name"
        default-opened
        header-class="text-h6"
      >
        <q-list bordered separator>
          <!-- Bearbeiten -->
          <q-item
            v-for="lesson in subject.lessons"
            :clickable="perms.edit"
            :key="lesson.id"
            @click="editLesson(subject.id, lesson)"
          >
            <q-item-section v-html="lesson.text"></q-item-section>
          </q-item>
          <!-- Neu erstellen -->
          <q-item clickable @click="editLesson(subject.id)" v-if="perms.edit">
            <q-item-section>
              <q-icon name="add" size="sm"></q-icon>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </template>
  </template>
  <q-dialog v-model="editDialog">
    <EditLesson
      :lesson="clickedLesson"
      :report-id="reportStore.state.report.id"
      @close="editDialog = false"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
// NPM
import { PropType, computed, ref } from 'vue';

// LIB
import {
  GetReportDetailAPI,
  GetRepSubjectAPI,
  SchoolDataAPI,
} from 'lib/reports/types';
import { formatSchoolWeek, reportPermissionEdit } from 'lib/reports/common';
import { useReportStore } from 'lib/reports/einzelansicht';

// COMPONENTS
import EditLesson from './EditLesson.vue';
import Skeleton from '../../Skeleton/SubjectSkeleton.vue';

defineProps({
  report: {
    type: Object as PropType<GetReportDetailAPI>,
    required: true,
  },
  loading: {
    type: Boolean,
  },
});
const reportStore = useReportStore();
const loading = ref(true);
const error = ref('');

const perms = computed(() =>
  reportPermissionEdit(reportStore.state.report.status)
);

const emptyLesson: SchoolDataAPI = {
  id: -1,
  subject: -1,
  text: '',
};

const clickedLesson = ref({ ...emptyLesson });
const editDialog = ref(false);

const editLesson = (subjectId: number, lesson?: SchoolDataAPI) => {
  //  TODO: eins von beiden
  //clickedLesson.value = { ...lesson } || emptyLesson;
  Object.assign(clickedLesson.value, lesson || emptyLesson);
  clickedLesson.value.subject = subjectId;

  editDialog.value = true;
};

// Eine Liste aller Fächer
const subjectList = ref<GetRepSubjectAPI[]>([]);

reportStore
  .getSubjects()
  .then((res) => {
    subjectList.value = res;
  })
  .catch((e: string) => (error.value = e))
  .finally(() => (loading.value = false));

// Die Liste der Fächer inkl. der Tasks/Lessons, die der Bericht beinhaltet
const subjectWeek = computed(() =>
  formatSchoolWeek(
    subjectList.value,
    reportStore.state.report.data_weekly.school as SchoolDataAPI[]
  )
);
</script>
