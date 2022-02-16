import { isDarkMode } from 'lib/settings/settings';

interface Style {
  style: {
    base: {
      [key: string]: string;
    };
    invalid: {
      [key: string]: string;
    };
  };
}

const mergeStyle = (s1: Style, s2: Style): Style => {
  const base = Object.assign(s1.style.base, s2.style.base);
  const invalid = Object.assign(s1.style.invalid, s2.style.invalid);

  return {
    style: {
      base,
      invalid,
    },
  };
};

export const cardStyle = () => {
  const themeStyle: Style = isDarkMode()
    ? {
        style: {
          base: {
            iconColor: '#FFF',
            color: '#FFF',
          },
          invalid: {
            iconColor: '#FFC7EE',
            color: 'red',
          },
        },
      }
    : {
        style: {
          base: {
            iconColor: '#000',
            color: '#000',
          },
          invalid: {
            iconColor: '#FFC7EE',
            color: 'red',
          },
        },
      };

  const baseStyle: Style = {
    style: {
      base: {},
      invalid: {},
    },
  };

  const style = mergeStyle(baseStyle, themeStyle);
  return style as unknown as Style;
};
