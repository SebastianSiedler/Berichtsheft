export interface KwReportAPI {
  id: number;
  nr: number;
  status: number;
  kw: number;
  year: number;
}

export interface SupervisorDesktopTableAPI {
  user: UserAPI;
  reports: KwReportAPI[];
  unreleased: number;
}

export interface GetReportsOverviewAPI {
  nr: number;
  id: number;
  status: number;
  date_start: string;
  date_end: string;
  rtype: string | null;
  is_daily: boolean;
}

export interface GetTraineeTeam {
  id: number;
  name: string;
  user: UserAPI;
}

export interface SchoolDataAPI {
  id: number;
  subject: number;
  text: string;
}

export interface DataWeeklyAPI {
  company: string;
  instruction: string;
  school: SchoolDataAPI[];
}

export interface DailyTaskAPI {
  id: number;
  subject: null | number;
  report: number;
  weekday: number;
  duration: number;
  text: string;
}

export interface UserAPI {
  id: number;
  first_name: string;
  last_name: string;
}

export interface TeamAPI {
  id: number;
  name: string;
}

export interface GetReportDetailAPI {
  id: number;
  nr: number;
  status: number;
  date_start: string;
  date_end: string;
  rtype: string;
  is_daily: boolean;
  teamleader: null | UserAPI;
  trainer: UserAPI;
  team: TeamAPI | null;
  data_daily: DailyTaskAPI[];
  data_weekly: DataWeeklyAPI;
}

export interface SaveTaskAPI {
  id: number;
  subject: number | null;
  report: number;
  weekday: number;
  duration: number;
  text: string;
}

export interface GetRepSubjectAPI {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
  lessons: SchoolDataAPI[];
}

export interface PostChangeStatusAPIReturns {
  status: number;
}

export interface MobileTraineeListAPI {
  user: UserAPI;
  unreleased: number;
}

export interface ReportHistoryAPI {
  id: number;
  first_name: string;
  last_name: string;
  timestamp: string;
  status: number;
  text: string;
  report: number;
}
