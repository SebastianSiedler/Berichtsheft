import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { apiTeams, apiAllTlandTrainer, TeamsTable } from './types';
/**
 * Holt alle Teams aus der API
 */
export const getDepartments = async () => {
  const { data }: AxiosResponse<apiTeams[]> = await $api.get(
    '/api/admin/teams/'
  );
  return data;
};

/**
 * Holt die Daten der User, welche Teamleiter
 * oder Ausbilder sind
 */
export const getAllTLandTrainer = async () => {
  const { data }: AxiosResponse<apiAllTlandTrainer[]> = await $api.get(
    '/api/admin/get_all_tl_and_trainers_info/?is_teamleader=true'
  );
  return data;
};

export const getTrainersAPI = async () => {
  const { data }: AxiosResponse<apiAllTlandTrainer[]> = await $api.get(
    '/api/admin/get_all_tl_and_trainers_info/?is_trainer=true'
  );
  return data;
};

/**
 * Weißt einem User über die ID den passenden
 * Vor- und Nachnamen zu und wandelt das Object in ein passendes
 * für die Tabelle um
 */
export const apiTeamToTable = (team: apiTeams, users: apiAllTlandTrainer[]) => {
  const TL = users.filter((user) => user.id == team.user)[0];
  const TL_Name = TL ? `${TL.first_name} ${TL.last_name}` : '';
  return {
    teamId: team.id,
    teamName: team.name,
    trainerName: TL_Name,
    trainerId: team.user,
  };
};

/**
 * Holt gleichzeitig Daten der Teams
 * und Ausbilder/TL
 */
export const getDepartmentsList = async () => {
  try {
    const [teams, trainers] = await Promise.all([
      getDepartments(),
      getAllTLandTrainer(),
    ]);

    const departments: TeamsTable[] = teams.map((team) => {
      return apiTeamToTable(team, trainers);
    });

    return { departments, trainers };
  } catch (e) {
    throw e;
  }
};

export const deleteApiTeam = async (id: number) => {
  await $api.delete(`/api/admin/teams/${id}/`);
};

export const saveApiTeam = async (team: TeamsTable) => {
  console.log(team);
  team.trainerId = team.trainerId == -1 ? null : team.trainerId;

  if (team.teamId === -1) {
    const { data }: AxiosResponse<apiTeams> = await $api.post(
      '/api/admin/teams/',
      {
        name: team.teamName,
        user: team.trainerId,
      }
    );
    return data;
  } else {
    const { data }: AxiosResponse<apiTeams> = await $api.patch(
      `/api/admin/teams/${team.teamId}/`,
      {
        name: team.teamName,
        user: team.trainerId,
      }
    );
    return data;
  }
};
