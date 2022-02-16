import { AuthStateInterface } from './types';

export const emptyUser = {
  salutation: 1,
  first_name: 'Vorname Test User',
  last_name: 'null',
  company: 'null',
  is_manager: false,
  is_trainer: false,
  is_teamleader: false,
  is_trainee: false,
  username: 'null',
};

function state(): AuthStateInterface {
  return {
    user: { ...emptyUser },
    trainee: {
      date_start: 'null',
      date_end: 'null',
      daily: false, //! loeschen, wenn es nicht mehr verwendet wird
      approval: true,
    },

    isAuthenticated: true,
    AccessToken: '',
  };
}

export default state;
