import { useState, useEffect } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);

const FinancialReportRoeChart = ({ aspectRatio, showAxistitle, roeData }) => {
  const [chartdata_roe, setChartData_roe] = useState();
  const [showChart_roe, setShowChart_roe] = useState(false);

  useEffect(() => {
    if (roeData !== undefined) {
      setChartData_roe({
        labels: roeData.label_year_list,
        datasets: [
          {
            label: '자본총계(지배)',
            data: roeData.total_equity_control_list,
            backgroundColor: '#82CDFF',
            type: 'bar',
            order: 2,
            yAxisID: 'y',
          },
          {
            label: '당기순이익(지배)',
            data: roeData.net_profit_control_list,
            backgroundColor: '#FF9FB4',
            type: 'bar',
            order: 2,
            yAxisID: 'y',
          },
          {
            label: '영업이익',
            data: roeData.operating_profit_list,
            backgroundColor: '#FEC8D8',
            type: 'bar',
            order: 2,
            yAxisID: 'y',
          },
          {
            label: 'ROE',
            data: roeData.roe_list,
            borderColor: '#8A2BE2',
            backgroundColor: '#F0FFFF',
            type: 'line',
            order: 1,
            yAxisID: 'y1',
          },
          {
            label: 'ROE(추세)',
            data: roeData.roe_linear_list,
            borderColor: '#8A2BE2',
            backgroundColor: '#192841',
            type: 'line',
            order: 0,
            yAxisID: 'y1',
            hidden: true,
          },
        ],
      });
    }
  }, [roeData]);
  /* Chart를 위한 모든 data가 준비된 후에 Chart를 그립니다. */
  /* 주의! 준비되기 전(초기값 상태, undefined상태 등)에서 Chart를 그리려고 하면 */
  /* block되어 모든 procedure가 실행되지 않습니다. */
  useEffect(() => {
    if (chartdata_roe !== undefined) {
      setShowChart_roe(true);
    }
  }, [chartdata_roe]);

  /* Chart에 대한 options를 설정합니다. */
  const chartoption_roe = {
    responsive: true,
    aspectRatio: aspectRatio,
    plugins: {
      title: {
        display: true,
        text: 'ROE 분석',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return context.dataset.label + ': ' + context.formattedValue + '억원';
            } else if (context.datasetIndex === 1) {
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
          text: '단위[%]',
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
  return <>{showChart_roe ? <Chart type="bar" data={chartdata_roe} options={chartoption_roe}></Chart> : <></>}</>;
};

export default FinancialReportRoeChart;
