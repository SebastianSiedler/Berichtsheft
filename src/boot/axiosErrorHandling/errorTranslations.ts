import { KeyString, translateKeyArray } from './apiErrorMessages';

/**
 * Wenn aus der API keine passende Fehlermeldung, sondern nur
 * ein Error Code kommt
 */
export const errorMessages: KeyString = {
  'Request failed with status code 401': 'Username oder Password falsch',
  'Network Error': 'Netzwerkfehler: Server nicht erreichbar',
};

/**
 * Übersetzungen für passende Fehlermeldungen
 */
export const apiResponseError: translateKeyArray = {
  // Fehler in der Authentifizierung
  token: [
    {
      'Token konnte nicht erkannt werden. Bitte rufe den Link aus der E-Mail noch einmal auf.':
        'This field is required.',
    },
    {
      'Der Token ist leider abgelaufen. Die 72 Stunden Grenze wurden überschritten.':
        'token not valid or timed out.',
    },
    { 'Sitzung ist abgelaufen': 'token_not_valid' },
  ],

  detail: [
    {
      'Benutzername oder Passwort falsch!':
        'No active account found with the given credentials',
    },
    {
      'User konnte nicht gelöscht werden, da dieser der letzte Administrator ist.':
        'User could not be deleted because this user is the last manager in your company. Please delete the whole company or assign another user as manager',
    },
    {
      'Sitzung ist abgelaufen': 'Token is invalid or expired',
    },
  ],
  name: [
    { 'Teamname bereits vergeben.': 'teams with this name already exists.' },
    { 'Name existiert bereits': 'must be unique' },
  ],
  nr: [
    {
      'Der Bericht liegt in der Zukunft!':
        'the report with the given number is in the future.',
    },
    {
      'Der Bericht existiert bereits. Versuche die Seite neu zu laden':
        'report exists already',
    },
  ],
  active_users: [
    {
      'Template kann nicht gelöscht werden, da es noch in Benutzung ist.':
        'Cannot be deleted, because it is still used by active users.',
    },
  ],
  date_start: [
    { 'Start-Datum ungültig': 'Not a valid date format.' },
    { 'Start-Datum darf nicht leer sein!': 'This field may not be blank.' },
  ],
  date_end: [
    { 'End-Datum ungültig': 'Not a valid date format.' },
    { 'End-Datum darf nicht leer sein!': 'This field may not be blank.' },
  ],
  trainer: [
    {
      'Ausbilder existiert nicht': /Invalid pk "\d+" - object does not exist./,
    },
  ],
  text: [
    {
      'Text darf nicht länger als 200 Zeichen lang sein':
        'Ensure this field has no more than 200 characters.',
    },
  ],
  teams: [
    {
      'Team existiert nicht!': /Invalid pk "\d+" - object does not exist./,
    },
  ],
};
