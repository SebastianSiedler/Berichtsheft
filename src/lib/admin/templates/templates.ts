import {
  apiJobTemplate,
  apiTemplatesOverview,
  Template,
  GetSubjectAPI,
} from './types';
import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';

import { getTrainersAPI, getDepartments } from '../departments/departments';

export const getTemplatesOverview = async () => {
  const { data }: AxiosResponse<apiTemplatesOverview[]> = await $api.get(
    '/api/admin/jobtemplatesoverview/'
  );
  return data;
};

/**
 * Holt alle Teams, Teamleiter und Templates Overview
 */
export const getTemplatesList = async () => {
  const [templatesOverview, trainers, teams] = await Promise.all([
    getTemplatesOverview(),
    getTrainersAPI(),
    getDepartments(),
  ]);

  return { templatesOverview, trainers, teams };
};

export const getTemplateDetails = async (id: number) => {
  const { data }: AxiosResponse<apiJobTemplate> = await $api.get(
    `/api/admin/jobtemplates/${id}/`
  );
  return data as Template;
};

export const saveTemplate = async (template: Template) => {
  if (template.id === -1) {
    const { data }: AxiosResponse<apiJobTemplate> = await $api.post(
      '/api/admin/jobtemplates/',
      template
    );
    return data.id;
  } else {
    const { data }: AxiosResponse<apiJobTemplate> = await $api.patch(
      `/api/admin/jobtemplates/${template.id}/`,
      template
    );
    return data.id;
  }
};

export const deleteTemplate = async (id: number) => {
  await $api.delete(`/api/admin/jobtemplates/${id}/`);
};

export const emptyTemplate: Template = {
  id: -1,
  name: '',
  zusatz: '',
  trainer: null,
  teams: [],
  daily: false,
  approval: false,
  date_start: '09-01',
  date_end: '06-30',
  years: 3,
};

export const getSubjects = async () => {
  const { data }: AxiosResponse<GetSubjectAPI> = await $api.get(
    '/api/admin/subject/'
  );
  return data;
};
