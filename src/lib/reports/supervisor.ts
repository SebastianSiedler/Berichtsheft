import { KwReportAPI, SupervisorDesktopTableAPI } from './types';
import { reportPermissionEdit } from './common';
import { getWeek } from 'lib/utils';

const compare = (a: number | string, b: number | string) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/**
 * Gibt ein Array bis zur letzten Kalenderwoche zurück
 */
export const getWeekCols = (data: SupervisorDesktopTableAPI[]) => {
  const weeks: string[] = [];

  data.forEach((userRow) => {
    userRow.reports.forEach((item) => {
      weeks.push(`${item.year}${item.kw}`);
    });
  });

  weeks.sort(compare);

  const last = weeks[0];

  if (!last) throw 'Noch keine Berichte vorhanden';

  const lastYear = parseInt(last.substring(0, 4));
  const lastKw = parseInt(last.substring(4, 6));
  const currKw = getWeek();

  const returnArray = [];

  // Ein Array mit Kw von 1-53 des Berichtes mit dem ältesten Datum
  for (let year = lastYear; year <= new Date().getFullYear(); year++) {
    for (let kw = 1; kw <= 53; kw++) {
      returnArray.push({
        kw,
        year,
      });
    }
  }

  // Alles entfernen vor der letzten Kalenderwoche
  returnArray.splice(0, lastKw - 1);

  returnArray.reverse().splice(0, 53 - currKw);

  return returnArray.reverse().map((el) => {
    const date = `${el.year}-${el.kw}`;
    return date;
  });
};

/**
 * Berechnet, wie viele Berichte vom Supervisor freigegeben werden müssen
 */
export const getUnreleased = (reports: KwReportAPI[]) => {
  let unreleased = 0;

  reports.forEach((report) => {
    const perms = reportPermissionEdit(report.status);

    if (perms.reject || perms.release) {
      unreleased += 1;
    }
  });

  return unreleased;
};

/**
 * Je nach dem wie viele Berichte unreleased sind, bekommt
 * das Badge eine andere Farbe
 */
export const getUnreleasedUi = (unreleased: number) => {
  if (unreleased > 10) {
    return 'negative';
  } else if (unreleased > 5) {
    return 'warning';
  }
  return 'primary';
};
