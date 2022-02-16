export interface apiTemplatesOverview {
  id: number;
  name: string;
  active_users: number;
}

export interface apiJobTemplate {
  id: number;
  name: string;
  zusatz: string;
  trainer: number;
  teams: number[]; // [2,5,12]
  daily: boolean;
  approval: boolean;
  date_start: string; //'09-01'
  date_end: string; //'06-31'
  years: number; // 3
}

export interface Template {
  id: number;
  name: string;
  zusatz: string;
  trainer: number | null;
  teams: number[]; // [2,5,12]
  daily: boolean;
  approval: boolean;
  date_start: string; //'09-01'
  date_end: string; //'06-31'
  years: number; // 3
}

export interface GetSubjectAPI {
  id: number;
  name: string;
  active: boolean;
}
