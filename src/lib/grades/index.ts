import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';

import { getSubjectsList } from 'lib/settings/settings';

interface TraineeGrade {
  id: number;
  subject: number;
  grade: number; // 1-6
  date: string;
  year: number;
  valuation: number;
  user: number; // Für Trainee irrelevant, da eigene ID
}

/**
 * Ein Azubi holt sich selbst die Daten für seine
 * eigenen Noten
 */
export const traineeGetGradesAPI = async () => {
  const { data }: AxiosResponse<TraineeGrade[]> = await $api.get(
    '/api/grades/grades_trainee/'
  );
  return data;
};

/**
 * Holt die Daten der gespeicherten Prüfungen und welches Fach welche ID hat
 */
export const initGrades = async () => {
  const [subjectYearly, traineeGrades] = await Promise.all([
    getSubjectsList(),
    traineeGetGradesAPI(),
  ]);

  return {
    subjectYearly,
    traineeGrades,
  };
};
