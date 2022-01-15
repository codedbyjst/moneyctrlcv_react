import { useState, useEffect } from 'react';

import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(...registerables);

const FinancialReportAssetsChart = ({ aspectRatio, showAxistitle, assetsData }) => {
  const [chartdata_assets, setChartdata_assets] = useState();
  const [showchart_assets, setShowchart_assets] = useState(false);

  useEffect(() => {
    /* 두 데이터 모두 초기값이 아닐 경우(api서버에서 데이터를 받아온 후) Chart 데이터를 생성합니다. */
    if (assetsData !== undefined) {
      setChartdata_assets({
        labels: assetsData.label_year_list,
        datasets: [
          {
            label: '자본총계',
            data: assetsData.total_equity_list,
            backgroundColor: '#1C4587',
            order: 3,
            yAxisID: 'y',
            stack: 'stack 0',
          },
          {
            label: '자본총계(추세)',
            data: assetsData.total_equity_linear_list,
            borderColor: '#1C4587',
            backgroundColor: '#192841',
            type: 'line',
            order: 2,
            yAxisID: 'y',
            hidden: true,
          },
          {
            label: '부채총계',
            data: assetsData.total_liabilities_list,
            backgroundColor: '#E06666',
            order: 4,
            yAxisID: 'y',
            stack: 'stack 0',
          },
          {
            label: '부채비율',
            data: assetsData.debt_ratio_list,
            borderColor: '#36A2EB',
            backgroundColor: '#F0FFFF',
            type: 'line',
            order: 1,
            yAxisID: 'y1',
          },
          {
            label: '부채비율(추세)',
            data: assetsData.debt_ratio_linear_list,
            borderColor: '#36A2EB',
            backgroundColor: '#192841',
            type: 'line',
            order: 0,
            yAxisID: 'y1',
            hidden: true,
          },
        ],
      });
    }
  }, [assetsData]);
  /* Chart를 위한 모든 data가 준비된 후에 Chart를 그립니다. */
  /* 주의! 준비되기 전(초기값 상태, undefined상태 등)에서 Chart를 그리려고 하면 */
  /* block되어 모든 procedure가 실행되지 않습니다. */
  useEffect(() => {
    if (chartdata_assets !== undefined) {
      setShowchart_assets(true);
    }
  }, [chartdata_assets]);

  /* Chart에 대한 options를 설정합니다. */
  const chartoption_assets = {
    responsive: true,
    aspectRatio: aspectRatio,
    plugins: {
      title: {
        display: true,
        text: '자산(=자본+부채) 분산',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return context.dataset.label + ': ' + context.formattedValue + '억원';
            } else if (context.datasetIndex === 2) {
              return context.dataset.label + ': ' + context.formattedValue + '억원';
            } else if (context.datasetIndex === 3) {
              return context.dataset.label + ': ' + context.formattedValue + '%';
            }
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        title: {
          display: showAxistitle,
          text: '단위:[억원]',
        },
        position: 'left',
      },
      y1: {
        title: {
          display: showAxistitle,
          text: '단위:[%]',
        },
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  return <>{showchart_assets ? <Chart type="bar" data={chartdata_assets} options={chartoption_assets}></Chart> : <></>}</>;
};

export default FinancialReportAssetsChart;
