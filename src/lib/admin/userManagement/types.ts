export interface InitUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_trainee: boolean;
}

export type UserSalutations = '1' | '2' | '3';

export interface SingleUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  salutation: UserSalutations;

  // User Role
  is_trainee: boolean;
  is_manager: boolean;
  is_trainer: boolean;
  is_teamleader: boolean;

  // Azubi Only
  start_year: number | null;
  template: number | null;
}

export interface JobTemplate {
  id: number;
  name: string;
  active_users: number;
}
