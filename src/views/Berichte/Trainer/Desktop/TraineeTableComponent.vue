<template>
  <div style="position: relative">
    <div id="zui-scroller">
      <table class="zui-table">
        <!--  Jahr + Kw-->
        <thead>
          <tr>
            <th class="zui-sticky-col" style="border-top: 0">Suchfeld</th>
            <th v-for="ch in colHeads" :key="ch">{{ ch }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in supervisorReportsView" :key="row.user.id">
            <!-- Hier Stehen die Namen mit Badge -->
            <th
              class="zui-sticky-col text-body2 text-weight-medium"
              style="overflow: hidden"
            >
              {{ row.user.first_name }} {{ row.user.last_name }}
              <q-badge
                align="top"
                @click="
                  getUnreleased(row.reports)
                    ? scrollToCell(row.reports, row.user.id)
                    : null
                "
                :class="getUnreleased(row.reports) ? 'cursor-pointer' : ''"
                :color="getUnreleasedUi(getUnreleased(row.reports))"
              >
                {{ getUnreleased(row.reports) }}
              </q-badge>
            </th>
            <td v-for="(ch, c) in colHeads" :key="c">
              <span v-for="report in row.reports" :key="report.id">
                <span
                  v-if="ch == `${report.year}-${report.kw}`"
                  :id="`el-${row.user.id}-${c}`"
                >
                  <q-btn
                    @click="$emit('itemClicked', report.id)"
                    :icon="getStatusUi(report.status).icon"
                    :text-color="getStatusUi(report.status).color"
                    :disable="
                      !reportPermissionEdit(report.status).release ||
                      !reportPermissionEdit(report.status).reject
                    "
                    flat
                  >
                  </q-btn>
                </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { PropType, computed } from 'vue';

// LIB
import {
  getWeekCols,
  getUnreleased,
  getUnreleasedUi,
} from 'lib/reports/supervisor';
import { getStatusUi, reportPermissionEdit } from 'lib/reports/common';
import { KwReportAPI, SupervisorDesktopTableAPI } from 'lib/reports/types';

const props = defineProps({
  supervisorReportsView: {
    type: Object as PropType<SupervisorDesktopTableAPI[]>,
    required: true,
  },
});

const colHeads = computed(() => getWeekCols(props.supervisorReportsView));

/**
 * Scrollt zum ersten Bericht pro Reihe, den der Supervisor abarbeiten muss
 */
const scrollToCell = (reports: KwReportAPI[], uid: number) => {
  const firstUnreleasedReport = reports.filter((report) => {
    const perms = reportPermissionEdit(report.status);
    console.log(report.id, report.kw, perms);
    return perms.release || perms.reject;
  })[0];

  const colIndex = colHeads.value.findIndex(
    (col) => col == `${firstUnreleasedReport.year}-${firstUnreleasedReport.kw}`
  );

  document
    .getElementById(`el-${uid}-${colIndex}`)
    ?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
};
</script>

<style scoped lang="scss">
$fixedColWidth: 200px;
$headRowCol: #4b4b4b85;
$borderColor: #ddddef8e;

.zui-table {
  border-spacing: 0;
  table-layout: fixed;
}
thead th {
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
}
td {
  height: 50px;
  border-top: 1px solid $borderColor;
  text-align: center;
}

#zui-scroller {
  margin-left: $fixedColWidth;
  overflow-x: scroll;
  overflow-y: visible;
}

.zui-sticky-col {
  padding-top: 15px;
  padding-bottom: 15px;
  border-top: 1px solid $borderColor;
  left: 0;
  position: absolute;
  width: $fixedColWidth;
  height: 40px;
  text-align: right;
}
</style>
