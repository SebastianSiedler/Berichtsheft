import { Store as $store } from 'src/store/index';
import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import {
  GetReportsOverviewAPI,
  GetReportDetailAPI,
  GetTraineeTeam,
  SaveTaskAPI,
  SchoolDataAPI,
  GetRepSubjectAPI,
  PostChangeStatusAPIReturns,
  SupervisorDesktopTableAPI,
  MobileTraineeListAPI,
  ReportHistoryAPI,
} from './types';

export const getReportsOverview = async () => {
  const { data }: AxiosResponse<GetReportsOverviewAPI[]> = await $api.get(
    '/api/reports/trainee_overview/'
  );

  return data;
};

export const getReportDetails = async (id: number, asManager?: boolean) => {
  const { data }: AxiosResponse<GetReportDetailAPI> =
    // Wenn der User Trainee ist holt er sich die Daten von /reports/reports
    // Sonst von /supervisor_reports/
    $store.state.auth.user.is_trainee
      ? await $api.get(`/api/reports/trainee_report/${id}/`)
      : await $api.post('/api/reports/supervisor_report/', {
          report: id,
          as_manager: asManager,
        });

  return data;
};

export const getTeamsAPI = async (nr: number) => {
  const { data }: AxiosResponse<GetTraineeTeam[]> = await $api.post(
    '/api/trainee/teams/',
    {
      nr,
    }
  );
  return data;
};

export const createReportAPI = async (
  nr: number,
  team_id?: number,
  rtype?: string
) => {
  const { data }: AxiosResponse<GetReportDetailAPI> = await $api.post(
    '/api/reports/trainee_report/',
    {
      nr,
      rtype,
      team: rtype == 'S' ? undefined : team_id,
    }
  );

  return data;
};

/**
 * Berichte Tätigkeiten ändern Daily
 */
export const saveTaskAPI = async (task: SaveTaskAPI) => {
  const payload = {
    subject: task.subject,
    report: task.report,
    weekday: task.weekday,
    duration: task.duration,
    text: task.text,
  };

  let res: AxiosResponse<SaveTaskAPI>;

  if (task.id >= 1) {
    res = await $api.patch(
      `/api/reports/trainee_report_data_daily/${task.id}/`,
      payload
    );
  } else {
    res = await $api.post('/api/reports/trainee_report_data_daily/', payload);
  }
  return res.data;
};

/**
 * Task löschen
 */
export const deleteTaskAPI = async (task_id: number) => {
  await $api.delete(`/api/reports/trainee_report_data_daily/${task_id}/`);
};

/**
 * Daten bei Typ Betrieb speichern (Weekly)
 */
export const saveDataWeeklyAPI = async (
  id: number,
  company?: string,
  instruction?: string
) => {
  await $api.patch(`/api/reports/trainee_report_data_weekly/${id}/`, {
    company,
    instruction,
  });
};

/**
 * Daten bei Typ Schule speichern (Weekly)
 */
export const saveLessonAPI = async (
  report_id: number,
  lesson: SchoolDataAPI
) => {
  const payload = {
    subject: lesson.subject,
    reportdata: report_id,
    text: lesson.text,
  };

  let res: AxiosResponse<SchoolDataAPI>;

  if (lesson.id >= 1) {
    res = await $api.patch(
      `/api/reports/trainee_report_school_data/${lesson.id}/`,
      payload
    );
  } else {
    res = await $api.post('/api/reports/trainee_report_school_data/', payload);
  }

  return res.data;
};

/**
 * Schuleintrag bei Typ Schule Weekly löschen
 */
export const deleteLessonAPI = async (lesson_id: number) => {
  await $api.delete(`/api/reports/trainee_report_school_data/${lesson_id}/`);
};

/**
 * Alle Fächer die ein Bericht enthalten kann
 */
export const getSubjectsAPI = async (report_id: number) => {
  const { data }: AxiosResponse<GetRepSubjectAPI[]> = await $api.post(
    '/api/reports/get_subjects/',
    {
      id: report_id,
    }
  );

  return data;
};

export const ReportChageStatusAPI = async (
  id: number,
  release: boolean,
  text?: string
) => {
  const { data }: AxiosResponse<PostChangeStatusAPIReturns> = await $api.post(
    '/api/reports/change_status/',
    {
      id,
      release,
      text,
    }
  );
  return data;
};

/**
 * Supervisor
 */

export const getDesktopTraineeTable = async (asManager = false) => {
  const { data }: AxiosResponse<SupervisorDesktopTableAPI[]> = await $api.post(
    '/api/reports/supervisor_desktop_trainee_table/',
    {
      as_manager: asManager,
    }
  );
  return data;
};

export const getMobileTraineeList = async (asManager = false) => {
  const { data }: AxiosResponse<MobileTraineeListAPI[]> = await $api.post(
    '/api/reports/supervisor_mobile_trainee_list/',
    {
      as_manager: asManager,
    }
  );
  return data;
};

/**
 * Eine Übersicht Liste mit den Berichten die der aktuell angemeldete
 * Supervisor vom ausgewählten Trainee sehen darf
 */
export const getTraineeReporsList = async (uid: number, asManager = false) => {
  const { data }: AxiosResponse<GetReportsOverviewAPI[]> = await $api.post(
    '/api/reports/supervisor_mobile_trainee_reports/',
    {
      user: uid,
      as_manager: asManager,
    }
  );
  return data;
};

/**
 * Wenn nach dem erstellen des Berichtes Typ oder Team geändert werden
 */
export const saveTypeChangesAPI = async (
  reportId: number,
  rtype: string,
  teamId?: number
) => {
  const { data }: AxiosResponse<GetReportDetailAPI> = await $api.patch(
    `/api/reports/trainee_report/${reportId}/`,
    {
      rtype: rtype,
      team: rtype == 'S' ? undefined : teamId,
    }
  );
  return data;
};

export const getReportHistoryAPI = async (reportId: number) => {
  const { data }: AxiosResponse<ReportHistoryAPI[]> = await $api.get(
    `/api/reports/history/?report=${reportId}`
  );

  return data;
};

/**
 * Download der Berichte als PDF
 * TODO: Bei iOS funktioniert das wiedermal nicht so
 */
export const downloadReportPDFAPI = async () => {
  // Download RAW Data
  const { data }: AxiosResponse<Blob> = await $api.get(
    '/api/reports/trainee_get_report_pdf/',
    { responseType: 'blob' }
  );

  // Erstellt das File als PDF
  const blob = new Blob([data], { type: 'application/pdf' });

  // Erstellt quasi ein HTML Downloadlink der durch anklicken zum Download navigiert
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Berichtsheft'; // Document Title
  link.click();
  URL.revokeObjectURL(link.href);
};
