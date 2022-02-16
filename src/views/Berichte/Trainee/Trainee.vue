<template>
  <div>
    <!-- Desktop View -->
    <div class="row" style="height: var(--app-height)" v-if="$q.screen.gt.sm">
      <!-- Linke Liste -->
      <div
        class="col-4 column"
        style="min-width: 315px; max-width: 350px; height: 100%"
      >
        <div class="col">
          <p>Berichte</p>
        </div>
        <div class="col">
          <filter-chips />
        </div>
        <div class="col-11" style="overflow: auto">
          <reports-list :loading="loadingList" :reports="reports" />
          <error-banner v-if="!!error" :error="error" />
        </div>
      </div>
      <!-- Einzelansicht -->
      <div class="col">
        <einzelansicht
          class="q-pa-md"
          style="overflow: auto; height: var(--app-height)"
          :loading="loadingList"
          :bare-report="bareRep"
          @reportDataChange="onReportDataChange"
          noclose
        />
      </div>
    </div>
    <!-- Mobile View -->
    <div v-else>
      <reports-list :loading="loadingList" :reports="reports" />
      <q-dialog
        v-model="mobileDialog"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-card-section>
            <einzelansicht
              :loading="loadingList"
              :bare-report="bareRep"
              @reportDataChange="onReportDataChange"
              @close="$router.replace('/reports/nr')"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// LIB
import { getReportsOverview } from 'lib/reports/apiCalls';
import { GetReportDetailAPI, GetReportsOverviewAPI } from 'lib/reports/types';

// COMPONENTS
import ReportsList from '../List/List.vue';
import Einzelansicht from '../Einzelansicht/einzelansicht.vue';
import FilterChips from 'src/views/Berichte/Einzelansicht/components/Common/FilterChips.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const mobileDialog = ref(false);

const error = ref('');
const loadingList = ref(true);

const reports = ref<GetReportsOverviewAPI[]>([]);

const bareRep = ref<GetReportsOverviewAPI>({
  id: -1,
  nr: -1,
  status: -1,
  rtype: 'K',
  date_start: '',
  date_end: '',
  is_daily: false,
});

/**
 * Navigiert zu aktuellstem Bericht
 * z.B. /reports/nr/123
 */
const openLatestReport = () => {
  const routeNr = route.params.id as unknown as number;

  const list = reports.value;

  // Wenn die Route Params Id nicht gültig ist
  if (!(1 <= routeNr && routeNr <= list.length)) {
    router.replace(`/reports/nr/${list.length}`);
  }
};

/**
 * Läd die Liste der Bericht Übersicht
 */
const loadReportsList = async () => {
  loadingList.value = true;
  try {
    reports.value = await getReportsOverview();
    /* Navigate to Latest Report in Einzeansicht, nur wenn Desktop Viewport */
    if ($q.screen.gt.sm) {
      openLatestReport();
    }
  } catch (e) {
    error.value = e as string;
  }
  loadingList.value = false;
};
loadReportsList();

/**
 * Wenn sich der Viewport von Mobile nach Desktop ändert,
 * muss auf einen Bericht navigiert werden, da sonst
 * "Bericht -1" geladen wird -> Error
 */
watch(
  () => !$q.screen.gt.sm,
  (isMobile) => {
    if (!isMobile) {
      openLatestReport();
    }
  }
);

/**
 * Bei änderungen der Route den BareRep anpassen
 * -> Einzelansicht bemerkt Änderung und holt neue Daten
 */
watch(
  () => route.params.id,
  (routeNr) => {
    if (!!routeNr && reports.value.length) {
      const nr = routeNr as unknown as number;
      const findReport = reports.value.find((item) => item.nr == nr);

      mobileDialog.value = true;

      if (!!findReport) {
        bareRep.value = findReport;
      } else {
        error.value = 'Fehler: kann Bericht nicht finden!';
      }
    } else {
      mobileDialog.value = false;
    }
  },
  {
    immediate: true, // Damit onmounted gleich das erste mal ausgeführt wird, falls man eine URL wie /reports/123 hat
  }
);

/**
 * Wenn sich durch Freigeben, Create usw. Daten am Einzelbericht ändern, muss
 * auch die Liste/Tabele angepasst werden
 */
const onReportDataChange = (report: GetReportDetailAPI) => {
  Object.assign(
    reports.value.find((item) => item.nr == report.nr),
    report
  );
};
</script>
