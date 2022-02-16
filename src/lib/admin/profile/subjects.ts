import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';

export interface SubjectAPI {
  id: number;
  name: string;
  active: boolean;
}

/**
 * List aller Fächer
 */
export const getSubjectListAPI = async () => {
  const { data }: AxiosResponse<SubjectAPI[]> = await $api.get(
    '/api/admin/subject/?active=true'
  );

  return data;
};

/**
 * Ein Fach hinzufügen
 */
export const addSubjectAPI = async (name: string) => {
  const { data }: AxiosResponse<SubjectAPI> = await $api.post(
    '/api/admin/subject/',
    {
      name,
    }
  );

  return data;
};

/**
 * Ein Fach löschen
 */
export const deleteSubjectAPI = async (subjectId: number) => {
  await $api.delete(`/api/admin/subject/${subjectId}`);
};

/**
 * Ein Fach umbenennen
 */
export const renameSubjectAPI = async (subjectId: number, newName: string) => {
  await $api.patch(`/api/admin/subject/${subjectId}/`, { name: newName });
};
