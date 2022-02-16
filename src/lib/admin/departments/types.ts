export interface apiTeams {
  id: number;
  name: string;
  user: number;
}

export interface apiAllTlandTrainer {
  id: number;
  salutation: '1' | '2' | '3';
  first_name: string;
  last_name: string;
  is_trainer: boolean;
  is_teamleader: boolean;
}

/**
 * Das Interface welches in den Adminsettings
 * für die Tabelle verwendet wird
 */
export interface TeamsTable {
  teamId: number;
  teamName: string;

  trainerId: number | null;
  trainerName: string;
}
