import { inject, InjectionKey } from 'vue';
import { singleRules, rules } from './rules';
/**
 * Wie lange await sleep in Milisekunden
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Schaut, ob zwei Variablen Unterschiedlich sind
 */
export const isDifferent = (a: unknown, b: unknown) => {
  let va = a;
  let vb = b;

  if (va == '') va = null;
  if (vb == '') vb = null;

  if (typeof va == 'string') {
    return va != vb;
  }
  return JSON.stringify(va) != JSON.stringify(vb);
};

/**
 * Um einen inject in Vue componenten Typesafe durchzuführen
 */
function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.toString()}`);
  }

  return resolved;
}

export { injectStrict, rules, singleRules };

/**
 * Die Kalenderwoche eines Tages oder halt von heute
 */
export const getWeek = (paraDate?: Date) => {
  const date = paraDate || new Date();
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

import { useAxios } from './useAxios';

export { useAxios as useFetch };
