<template>
  <q-dialog
    v-model="dialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <einzelansicht
        :bare-report="bareRep"
        @close="closeDialog()"
        @reportDataChange="$emit('onReportDataChange', $event)"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
// NPM
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// COMPONENTS
import Einzelansicht from 'src/views/Berichte/Einzelansicht/einzelansicht.vue';

const route = useRoute();
const router = useRouter();

const reportId = ref(-1);
const dialog = ref(false);

/**
 * Muss ich so machen,
 * weil wenn ich einfach in :bare-report="{id: reportId}"
 * kommen beim child wechselnd 3 unterschiedliche Objekte mit gleichem
 * String inhalt an
 */
const bareRep = computed(() => {
  return {
    id: reportId.value,
  };
});

/**
 * Wenn sich in der Route die reportId ändert, öffnet sich der Dialog
 * und die reportId wird auf Route_reportId gesetzt
 */
watch(
  () => route.params.reportId,
  (repId) => {
    const id = repId as unknown as number;
    if (!!id) {
      reportId.value = id;
      dialog.value = true;
    } else {
      dialog.value = false;
    }
  }
);

const closeDialog = async () => {
  const uid = route.params.uid as string;
  await router.replace(`/reports/u/${uid}/`);
  dialog.value = false;
};
</script>
