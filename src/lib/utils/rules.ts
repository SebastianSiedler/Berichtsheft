/**
 * Eizelne Regeln:
 * Müssen dann in Rules mit
 * :rules=[] als Array mitgegeben werden
 */
export const singleRules = {
  // Required | Pflichtfeld
  stringRequired: (v: string) => !!v || 'Pflichtfeld',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrayRequired: (arr: Array<any>) => !!arr.length || 'Pflichtfeld',
  //bool required
  boolRequired: (v: boolean) => !!v || 'Pflichtfeld',

  // Password
  passwordMaxLen: (v: string) => v.length >= 8 || 'Passwort min. 8 Zeichen',
  passwordMinLen: (v: string) => v.length <= 512 || 'Passwort zu lang',
  passwordMatch: (v: string, r: string) =>
    v === r || 'Passwörter nicht identisch',

  // Mail
  mailMaxLen: (v: string) => v.length <= 60 || 'Max 60 Zeichen',
  mailValid: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Ungültige E-Mail';
  },

  // Name zum User Anlegen
  firstNameMaxLen: (v: string) => v.length <= 50 || 'Max 50 Zeichen',
  lastNameMaxLen: (v: string) => v.length <= 25 || 'Max 25 Zeichen',

  // Job Year Group Template
  templateMaxLen: (v: string) => v.length <= 60 || 'Max 60 Zeichen',

  // Release Report
  releaseRepMaxLen: (v: string) =>
    v.length <= 200 || 'Max. 200 Zeichen möglich',

  // Ausbildungszeitraum
  ausbildungs_dauer: (v: string) => {
    return v.length == 2 || 'Es werden 2 Daten benötigt';
  },

  // TeamName
  teamNameMaxLen: (v: string) => v.length <= 25,

  // SignUp
  postCodeValid: (v: string) => {
    const pattern = /^[0-9]{5}$/;
    return pattern.test(v) || 'PLZ ungültig';
  },

  // Add Subject max length
  subjectMaxLen: (v: string) => {
    return v.length <= 100 || 'Max. 100 Zeichen möglich';
  },
};

export const rules = {
  // Für Passwort eingabe Felder
  passwordRules: [
    singleRules.passwordMinLen,
    singleRules.passwordMaxLen,
    singleRules.stringRequired,
  ],

  // Für Email Felder
  mailRules: [
    singleRules.stringRequired,
    singleRules.mailMaxLen,
    singleRules.mailValid,
  ],

  /**
   * Admin Settings
   */
  teamName: [singleRules.teamNameMaxLen, singleRules.stringRequired],

  userFirstName: [singleRules.stringRequired, singleRules.firstNameMaxLen],
  userLastName: [singleRules.stringRequired, singleRules.lastNameMaxLen],
};
