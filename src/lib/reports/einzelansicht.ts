import { reactive, readonly, InjectionKey, provide } from 'vue';
import { injectStrict } from 'lib/utils';
import { sleep } from 'lib/utils';

import {
  GetReportsOverviewAPI,
  GetReportDetailAPI,
  SchoolDataAPI,
  SaveTaskAPI,
} from './types';
import {
  getReportDetails,
  createReportAPI,
  saveLessonAPI,
  deleteLessonAPI,
  saveTaskAPI,
  getTeamsAPI,
  deleteTaskAPI,
  getSubjectsAPI,
  ReportChageStatusAPI,
  saveDataWeeklyAPI,
  saveTypeChangesAPI,
} from './apiCalls';

export const empty: GetReportDetailAPI = {
  id: -1,
  nr: -1,
  status: 0,
  date_start: '1970-01-01',
  date_end: '1970-01-01',
  rtype: 'B',
  is_daily: false,
  teamleader: {
    id: -1,
    first_name: '',
    last_name: '',
  },
  trainer: {
    id: -1,
    first_name: '',
    last_name: '',
  },
  team: {
    id: -1,
    name: '',
  },
  data_daily: [],
  data_weekly: {
    school: [],
    company: '',
    instruction: '',
  },
};

const useReport = () => {
  interface State {
    report: GetReportDetailAPI;
  }

  const state: State = reactive({
    report: { ...empty },
  });

  const resetActive = () => {
    state.report = { ...empty };
  };

  const setActive = async (bareRep: GetReportsOverviewAPI) => {
    resetActive();
    Object.assign(state.report, bareRep);

    // Wenn der Bericht existiert soll er sich die Daten dazu holen
    if (bareRep?.id != -1) {
      const [details] = await Promise.all([
        getReportDetails(state.report.id),
        sleep(500),
      ]);
      state.report = details;
    }
  };

  const patchReportMeta = async (rtype: string, teamId?: number) => {
    const repDetails = await saveTypeChangesAPI(state.report.id, rtype, teamId);
    Object.assign(state.report, repDetails);
  };

  /**
   * Ab hier nur für Weekly
   */
  const saveLesson = async (lesson: SchoolDataAPI) => {
    const returnLesson = await saveLessonAPI(state.report.id, lesson);
    if (lesson.id == -1) {
      state.report.data_weekly.school.push(returnLesson);
    } else {
      Object.assign(
        state.report.data_weekly.school.filter((v) => v.id == lesson.id)[0],
        returnLesson
      );
    }
  };

  const deleteLesson = async (lessonId: number) => {
    await deleteLessonAPI(lessonId);

    const index = state.report.data_weekly.school.findIndex(
      (lesson) => lesson.id == lessonId
    );

    if (index == -1) {
      throw `Bericht mit der ID ${lessonId} existiert nicht!`;
    }

    state.report.data_weekly.school.splice(index, 1);
  };

  const getTeams = async () => {
    return await getTeamsAPI(state.report.nr);
  };

  const getSubjects = async () => {
    return await getSubjectsAPI(state.report.id);
  };

  const create = async (rtype?: string, teamId?: number) => {
    const returnDetails = await createReportAPI(state.report.nr, teamId, rtype);
    state.report = returnDetails;
    // Wird zurückgegeben um mit Emit's die Liste/Tabelle anzupassen
    return returnDetails;
  };

  /**
   * Bericht freigeben oder ablehnen
   */
  const release = async (release: boolean, comment?: string) => {
    const data = await ReportChageStatusAPI(state.report.id, release, comment);

    Object.assign(state.report, data);
    // Wird zurückgegeben um mit Emit's die Liste/Tabelle anzupassen
    return data;
  };

  const saveTask = async (task: SaveTaskAPI) => {
    const returnTask = await saveTaskAPI({
      ...task,
      report: state.report.id,
    });

    if (task.id == -1) {
      state.report.data_daily.push(returnTask);
    } else {
      Object.assign(
        state.report.data_daily.find((v) => v.id == task.id),
        returnTask
      );
    }
    return returnTask;
  };

  const deleteTask = async (taskId: number) => {
    await deleteTaskAPI(taskId);

    const index = state.report.data_daily.findIndex(
      (task) => task.id == taskId
    );

    if (index == -1) {
      throw `Bericht mit der ID ${taskId} existiert nicht!`;
    }

    state.report.data_daily.splice(index, 1);
  };

  const saveCompanyText = async (text: string) => {
    await saveDataWeeklyAPI(state.report.id, text);
  };

  const saveInstructionText = async (text: string) => {
    await saveDataWeeklyAPI(state.report.id, undefined, text);
  };

  return {
    state: readonly(state),

    create,

    setActive,
    patchReportMeta,

    saveLesson,
    deleteLesson,

    saveTask,
    deleteTask,

    release,

    saveCompanyText,
    saveInstructionText,

    getTeams,
    getSubjects,
  };
};

/**
 * Generierte TypeSafety für den Store
 */
export const ReportsKey: InjectionKey<ReturnType<typeof useReport>> =
  Symbol('einzelansichtKey');

/**
 * Um den Store in den Children nutzen
 */
export const useReportStore = () => {
  return injectStrict(ReportsKey);
};

/**
 * Gibt eine Funktion zurück, welche den Tatsächlichen Store zurückgibt,
 * und eine Methode um den Store für die Children bereitszustellen (provide)
 */
export const providereportStore = () => {
  const store = useReport();

  return {
    provideStore: () => provide(ReportsKey, store),
    reportStore: store,
  };
};
