import { AxiosError } from 'axios';
import { apiResponseError, errorMessages } from './errorTranslations';

// Ob bei Undefinierten Fehlermeldungen der Original Fehler sein soll,
// oder einfach "Es ist ein Fehler aufgetreten"
const debug = process.env.NODE_ENV == 'development';
// const debug = true

export interface KeyString {
  // Damit der key und value dynamisch sind
  [errorMessage: string]: string | RegExp;
}

export interface translateKeyArray {
  // Hier stehen meine Übersetzungen drin
  [errorKey: string]: KeyString[];
}

interface ApiKeyArray {
  // Das bekomm ich vom Backend an Fehlermeldungen
  [errorKey: string]: string[];
}

/**
 * Wandelt eine Fehlermeldung aus der API in eine
 * für den User verständliche Übersetzung um
 */
const translateMessage = (errorMessage: string) => {
  const translation = errorMessages[errorMessage];
  if (translation) {
    return translation;
  } else {
    return debug ? errorMessage : 'Es ist ein Fehler aufgetreten';
  }
};

/**
 * Schaut, ob es im apiResponseError Objekt
 * für 'key' und 'text' eine übersetzung gibt
 * => sonst wird der original Text zurückgegeben
 */
export const enToDe = (key: string, text: string) => {
  const arr = apiResponseError[key];
  // Wenn es im Dict kein Array mit dem Key gibt soll er den Text original im Englisch zurück geben
  if (!!arr) {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const trans = arr.find((x) => text.match(Object.values(x)[0]));
    if (trans) {
      return Object.keys(trans)[0];
    }
  }
  return text;
};

/**
 * Wandelt ein Object aus mehreren Fehlermeldungen
 * passend um
 */
export const translateKeyArray = (obj: ApiKeyArray) => {
  try {
    const returnArray: string[] = [];
    // Für jedes KeyArray
    for (const [key, value] of Object.entries(obj)) {
      // Das ist richtig bis Andre umgebaut hat
      if (typeof value == 'object')
        value.forEach((enText) => {
          returnArray.push(enToDe(key, enText));
        });
      // toDo: Temporär bis fix von andre. Dann entfernen
      else {
        returnArray.push(enToDe(key, value as unknown as string));
      }
    }
    return debug ? returnArray.join(' | ') : 'Es ist ein Fehler aufgetreten';
  } catch (e) {
    return debug ? JSON.stringify(obj) : 'Es ist ein Fehler aufgetreten';
  }
};

/**
 * Wenn von der API eine Fehlernachricht kommt wird diese übersetzt,
 * sonst der Standard Fehlercode
 */
export const handleApiError = (error: AxiosError<ApiKeyArray>) => {
  const errorData = error.response?.data as ApiKeyArray;
  if (typeof errorData == 'string') {
    return 'Kaputte Fehlermeldung';
  }
  let errorMessage = '';

  if (!!errorData) {
    errorMessage = translateKeyArray(errorData);
  } else if (!!error.message) {
    errorMessage = translateMessage(error.message) as string;
  }

  return errorMessage || 'Keine konkrete Fehlermeldung!!!';
};
