import { GetUserInfoAPI } from 'lib/personal/types';

interface TraineeInterface {
  date_start: string;
  date_end: string;
  daily: boolean; //! loeschen, wenn es nicht mehr verwendet wird
  approval: boolean;
}

export interface AuthStateInterface {
  user: GetUserInfoAPI;
  trainee: TraineeInterface;

  isAuthenticated: boolean;
  AccessToken: string;
}
