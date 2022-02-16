import { ChartConfiguration } from 'chart.js';
const history = [
  {
    date: '2020-01-01',
    quantity: 4,
  },
  {
    date: '2020-02-01',
    quantity: 5,
  },
  {
    date: '2020-03-01',
    quantity: 4,
  },
  {
    date: '2020-04-01',
    quantity: 6,
  },
  {
    date: '2020-05-01',
    quantity: 8,
  },
  {
    date: '2020-06-01',
    quantity: 9,
  },
  {
    date: '2020-07-01',
    quantity: 4,
  },
];

const setHistoryData = () => {
  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'amount',
          data: [],
          backgroundColor: 'rgba(54,73,93,.5)',
          borderColor: '#36495d',
          borderWidth: 3,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Custom Chart Title',
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {},
    },
  };

  history.forEach((item) => {
    const formatDate = new Date(item.date).toLocaleString('de-DE', {
      month: 'short',
      year: 'numeric',
    });
    config.data.labels?.push(formatDate);
    config.data.datasets[0].data.push(item.quantity);
  });

  return config;
};

export const historyData = setHistoryData();
