import { Store as $store } from 'src/store/index';
import {
  SchoolDataAPI,
  GetRepSubjectAPI,
  Subject,
  DailyTaskAPI,
} from './types';

export const rtypes = [
  {
    icon: 'business',
    name: 'Betrieb',
    id: 'B',
  },
  {
    icon: 'school',
    name: 'Schule',
    id: 'S',
  },
  {
    icon: 'maps_home_work',
    name: 'Kombiniert',
    id: 'K',
  },
];

export const getRTypeUi = (id: string | null) => {
  const errorType = {
    icon: 'cancel',
    name: 'Fehler',
    id: 'X',
  };
  if (id == null) {
    return {
      icon: 'help_outline',
      name: 'Neu',
      id: 'N',
    };
  } else if (['K', 'B', 'S'].indexOf(id) > -1) {
    return rtypes.find((type) => type.id == id) || errorType;
  }
  return errorType;
};

const reportStati = [
  {
    // Noch nicht angelegt == 0
    status: 0,
    color: 'primary',
    title: 'Neu',
    icon: 'add',
  },
  {
    // In Bearbeitung == 1
    status: 1,
    color: 'primary',
    title: 'in Bearbeitung',
    icon: 'edit',
  },
  {
    // Beim Teamleiter == 2
    status: 2,
    color: 'amber',
    title: 'beim Teamleiter',
    icon: 'av_timer',
  },
  {
    // Beim Ausbildungsleiter == 3
    status: 3,
    color: 'amber-9',
    title: 'beim Ausbildungsleiter',
    icon: 'av_timer',
  },
  {
    // freigegeben == 4
    status: 4,
    color: 'positive',
    title: 'freigegeben',
    icon: 'done',
  },
  {
    // Abgelehnt von TL == 5
    status: 5,
    color: 'negative',
    title: 'von Ausbilder abgelehnt',
    icon: 'cancel',
  },
  {
    // Abgelehnt von Ausbildungsleiter == 6
    status: 6,
    color: 'negative',
    title: 'von Ausbildungsleiter abgelehnt',
    icon: 'cancel',
  },
];

export const getStatusUi = (status: number) => {
  const errorUi = {
    color: 'negative',
    title: 'error',
    icon: 'cancel',
  };

  const res = reportStati.filter((st) => st.status == status)[0];

  return !!res ? res : errorUi;
};

const compare = (a: { id: number }, b: { id: number }) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

/**
 * Aus den Daten von /report und den /getSubjects ein Array erstellen
 */
export const formatSchoolWeek = (
  subjectList: GetRepSubjectAPI[],
  schoolData: SchoolDataAPI[]
) => {
  return subjectList.map((subject) => {
    const lessons = schoolData.filter((lesson) => lesson.subject == subject.id);
    lessons.sort(compare);

    const sub: Subject = {
      id: subject.id,
      name: subject.name,
      lessons: lessons,
    };
    return sub;
  });
};

/**
 * Ob der aktuelle User für den Bericht bearbeiten darf oder nur Read-Only
 */
export const reportPermissionEdit = (status: number) => {
  /**
   * Berechtigungen:
   * - editPerm -> Bericht bearbeiten
   * - releasePerm -> bericht freigeben
   * - rejectPerm -> Bericht ablehnen/zurückholen
   */
  const isTrainee = $store.state.auth.user.is_trainee;
  const isTeamleader = $store.state.auth.user.is_teamleader;
  const isTrainer = $store.state.auth.user.is_trainer;

  const permissions = {
    edit: false,
    release: false,
    reject: false,
  };

  // Azubi - In Bearbeitung oder Abgelehnt
  if (isTrainee && [0, 1, 5, 6].includes(status)) {
    permissions.edit = true;
  }
  // Azubi - In Bearbeitung doer Abgelehnt
  if (isTrainee && [1, 5, 6].includes(status)) {
    permissions.release = true;
  }

  // Azubi - Versehentlich freigegeben
  if (isTrainee && [2, 3].includes(status)) {
    permissions.reject = true;
  }

  // Teamleiter - beim Teamleiter
  if (isTeamleader && [2].includes(status)) {
    permissions.release = true;
    permissions.reject = true;
  }

  // Ausbilder - beim Ausbilder
  if (isTrainer && [3].includes(status)) {
    permissions.release = true;
    permissions.reject = true;
  }

  return permissions;
};

/**
 * Alle Tasks auf die 7 Wochentage aufteilen
 */
export const formatTaskList = (tasks: DailyTaskAPI[]) => {
  const week: DailyTaskAPI[][] = [];

  for (let i = 0; i < 7; i++) {
    week.push([] as DailyTaskAPI[]);
  }

  tasks.forEach((task) => {
    week[task.weekday - 1].push(task);
  });

  week.forEach((day) => day.sort(compare));
  return week;
};

/**
 * Zählt die Dauer der Verschiedenen Tasks zusammen
 */
export const getDaysDuration = (tasks: DailyTaskAPI[]) => {
  return tasks.reduce((sum, { duration }) => sum + duration, 0);
};

export const germanDays = {
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  7: 'Sonntag',
};

export const daysArray = [
  {
    id: 1,
    label: 'Montag',
  },
  {
    id: 2,
    label: 'Dienstag',
  },
  {
    id: 3,
    label: 'Mittwoch',
  },
  {
    id: 4,
    label: 'Donnerstag',
  },
  {
    id: 5,
    label: 'Freitag',
  },
  {
    id: 6,
    label: 'Samstag',
  },
  {
    id: 7,
    label: 'Sonntag',
  },
];

/**
 * Gibt die Label's zurück, wie die Buttons zum Freigeben/Ablehnen heißen sollen
 */
export const getChangeStatusLabel = (status: number) => {
  const labels = {
    release: 'Freigeben',
    reject: 'Zurückweisen',
  };

  const isTrainee = $store.state.auth.user.is_trainee;
  const asManager = $store.state.settings.asManager;

  // Wenn der Azubi den Bericht freigegeben hat und in wieder zurückholen will
  if ([2, 3].includes(status) && isTrainee) {
    labels.reject = 'Zurückziehen';
  }
  // Bericht höngt bei Teamleiter -> Als Admin freigeben
  else if (status == 2 && asManager) {
    labels.release = 'Teamleiter überspringen';
  }
  // Bericht höngt bei Ausbilder -> Als Admin freigeben
  else if (status == 3 && asManager) {
    labels.release = 'Ausbilder überspringen';
  }

  return labels;
};

/**
 * Für die History/Verlauf das passende Icon, Beschreibung, Color
 */
export const getHistoryStatusUi = (status: number, fullname: string) => {
  switch (status) {
    case 1: {
      return {
        icon: 'create_new_folder',
        desc: 'Bericht erstellt',
        color: 'primary',
      };
    }
    case 2: {
      return {
        icon: 'av_timer',
        desc: 'Zur Freigabe Teamleiter',
        color: 'amber',
      };
    }
    case 3: {
      return {
        icon: 'av_timer',
        desc: 'Zur Freigabe Ausbilder',
        color: 'amber-9',
      };
    }
    case 4: {
      return {
        icon: 'done',
        desc: `Freigegeben durch Ausbilder ${fullname}`,
        color: 'positive',
      };
    }
    case 5: {
      return {
        icon: 'cancel',
        desc: `Abgelehnt durch Teamleiter ${fullname}`,
        color: 'negative',
      };
    }
    case 6: {
      return {
        icon: 'cancel',
        desc: `Abgelehnt durch Ausbilder ${fullname}`,
        color: 'negative',
      };
    }
    case 7: {
      return {
        icon: 'switch_access_shortcut',
        desc: `Durch Teamleiter ${fullname} auf Wunsch auf 1 zurückgesetzt`,
        color: 'primary',
      };
    }
    case 8: {
      return {
        icon: 'switch_access_shortcut',
        desc: `Durch Ausbilder ${fullname} auf Wunsch auf 1 zurückgesetzt`,
        color: 'primary',
      };
    }
    case 9: {
      return {
        icon: 'switch_access_shortcut',
        desc: `Durch Manager ${fullname} auf Wunsch auf 1 zurückgesetzt`,
        color: 'primary',
      };
    }
    case 10: {
      return {
        icon: 'switch_access_shortcut',
        desc: `Durch Manager ${fullname} den Teamleiter übersprungen`,
        color: 'primary',
      };
    }
    case 20: {
      return {
        icon: 'arrow_back',
        desc: 'Azubi Bericht zurückgeholt',
        color: 'primary',
      };
    }
    case 21: {
      return {
        icon: 'edit',
        desc: 'Bericht bearbeitet',
        color: 'primary',
      };
    }

    default: {
      return {
        icon: 'error_outline',
        desc: 'Fehler!',
        color: 'error',
      };
    }
  }
};
