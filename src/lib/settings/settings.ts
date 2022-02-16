import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { GetSubjectAPI } from 'lib/admin/templates/types';
import { GetSubjectsYearlyAPI } from './types';
import { useFetch } from 'lib/utils';

/**
 * Falls etwas im local Storage steht das Theme nehmen, sonst auto
 */
export const getSystemTheme = () => {
  let locStorageTheme = localStorage.getItem('darkMode');
  locStorageTheme = !!locStorageTheme ? locStorageTheme : 'auto';

  if (locStorageTheme === 'auto') {
    return 'auto';
  } else {
    return locStorageTheme === 'true';
  }
};

/**
 * Um nicht Quasar Komponenten für Dark mode und Light Mode
 * zu CSS Stylen
 */
export const isDarkMode = () => {
  const ls = getSystemTheme();

  if (ls == 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return ls;
};

/**
 * Feature Request
 */
export const postFeatureRequest = async (anonymous: boolean, text: string) => {
  await $api.post('/api/communication/feature_request/', {
    anonymous,
    text,
  });
};

/**
 * Bug Report
 */
export const postBugReport = async (anonymous: boolean, text: string) => {
  await $api.post('/api/communication/bug_report/', {
    anonymous,
    text,
  });
};

/**
 * security Vulnerabilities Incidents
 */
export const postSecurityLeak = async (anonymous: boolean, text: string) => {
  await $api.post('/api/communication/security_vulnerabilities/', {
    anonymous,
    text,
  });
};

const getSubjectsYearly = async () => {
  const { data }: AxiosResponse<GetSubjectsYearlyAPI[]> = await $api.get(
    '/api/trainee/subjects_yearly/'
  );

  return data;
};

const getActiveSubjectList = async (onlyactive = true) => {
  const { data }: AxiosResponse<GetSubjectAPI[]> = await $api.get(
    `/api/trainee/get_subjects/${onlyactive ? '?active=true' : ''}`
  );

  return data;
};

/**
 * Um die Fächer pro Lehrjahr zu verwalten
 */
export const getSubjectsList = async () => {
  const [subjectYearly, subjectList] = await Promise.all([
    getSubjectsYearly(),
    getActiveSubjectList(),
  ]);

  return {
    subjectYearly,
    subjectList,
  };
};

/**
 * Ein Einzelnes Lehrjahr die Fächer komplett updaten
 */
export const updateSubjectYear = (item: GetSubjectsYearlyAPI) => {
  return useFetch<GetSubjectsYearlyAPI>(
    `/api/trainee/subjects_yearly/${item.id}/`,
    {
      method: 'PATCH',
      data: item,
    }
  );
};
