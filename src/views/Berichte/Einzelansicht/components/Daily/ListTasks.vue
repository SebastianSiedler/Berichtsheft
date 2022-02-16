<template>
  <error-banner v-if="!!error" :error="error" />
  <skeleton v-else-if="loading || loadingSubjects" />
  <template v-else>
    <div v-for="(day, n) in weekList" :key="n" class="q-my-xl">
      <p class="row space-between">
        <span class="col text-subtitle1 text-weight-medium">
          {{ germanDays[n + 1] }}
        </span>
        <span class="col row justify-end">{{ getDaysDuration(day) }}h</span>
      </p>
      <q-list v-if="day.length" separator bordered>
        <q-item
          v-for="(task, i) in day"
          :key="i"
          :clickable="perms.edit"
          @click="editItem(task)"
        >
          <q-item-section>
            <q-item-label v-html="task.text" lines="8"></q-item-label>
          </q-item-section>
          <q-item-section v-html="task.duration + 'h'" side />
        </q-item>
      </q-list>
    </div>

    <!-- FAB Floating Aciton Button - Add Task -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="perms.edit">
      <q-btn fab icon="add" color="primary" @click="editItem()" />
    </q-page-sticky>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" persistent :maximized="false">
      <edit-task
        :task="clickedItem"
        :subjects="subjects"
        @onClose="editDialog = false"
      />
    </q-dialog>
  </template>
</template>

<script lang="ts" setup>
// NPM
import { computed, ref, PropType } from 'vue';

// LIB
import { getSubjectsAPI } from 'lib/reports/apiCalls';
import {
  DailyTaskAPI,
  GetReportDetailAPI,
  GetRepSubjectAPI,
} from 'lib/reports/types';
import {
  reportPermissionEdit,
  formatTaskList,
  getDaysDuration,
  germanDays,
} from 'lib/reports/common';

// COMPONENTS
import EditTask from './EditTask.vue';
import Skeleton from './skeleton.vue';

const props = defineProps({
  report: {
    type: Object as PropType<GetReportDetailAPI>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
});

const loadingSubjects = ref(true);
const error = ref('');

const perms = computed(() => reportPermissionEdit(props.report.status));

const weekList = computed(() => formatTaskList(props.report.data_daily));

const subjects = ref([] as GetRepSubjectAPI[]);

getSubjectsAPI(props.report.id)
  .then((res) => (subjects.value = res))
  .catch((e: string) => (error.value = e))
  .finally(() => (loadingSubjects.value = false));

const emptyTask: DailyTaskAPI = {
  id: -1,
  subject: null,
  weekday: 1,
  duration: 0,
  text: '',
  report: -1,
};

const clickedItem = ref({ ...emptyTask });

const editDialog = ref(false);

const editItem = (task?: DailyTaskAPI) => {
  clickedItem.value = task || { ...emptyTask };
  editDialog.value = true;
};
</script>
