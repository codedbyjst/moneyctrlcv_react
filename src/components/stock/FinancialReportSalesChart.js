import { useState, useEffect } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);

const FinancialReportSalesChart = ({ aspectRatio, showAxistitle, salesData }) => {
  const [chartdata_sales, setChartdata_sales] = useState();
  const [showChart_sales, setShowChart_sales] = useState(false);

  useEffect(() => {
    /* 두 데이터 모두 초기값이 아닐 경우(api서버에서 데이터를 받아온 후) Chart 데이터를 생성합니다. */
    if (salesData !== undefined) {
      setChartdata_sales({
        labels: salesData.label_year_list,
        datasets: [
          {
            label: '영업이익률',
            data: salesData.operating_profit_margin_list,
            borderColor: '#36A2EB',
            backgroundColor: '#F0FFFF',
            type: 'line',
            order: 1,
            yAxisID: 'y1',
          },
          {
            label: '영업이익률(추세)',
            data: salesData.operating_profit_margin_linear_list,
            borderColor: '#36A2EB',
            backgroundColor: '#192841',
            type: 'line',
            order: 0,
            yAxisID: 'y1',
            hidden: true,
          },
          {
            label: '순이익률',
            data: salesData.net_profit_margin_list,
            borderColor: '#8A2BE2',
            backgroundColor: '#F0FFFF',
            type: 'line',
            order: 3,
            yAxisID: 'y1',
          },
          {
            label: '순이익률(추세)',
            data: salesData.net_profit_margin_linear_list,
            borderColor: '#8A2BE2',
            backgroundColor: '#192841',
            type: 'line',
            order: 2,
            yAxisID: 'y1',
            hidden: true,
          },
          {
            label: '매출액',
            data: salesData.sales_list,
            backgroundColor: '#FFDC7F',
            type: 'bar',
            order: 5,
            yAxisID: 'y',
          },
          {
            label: '매출액(추세)',
            data: salesData.sales_linear_list,
            borderColor: '#FFDE59',
            backgroundColor: '#192841',
            type: 'line',
            order: 4,
            yAxisID: 'y',
            hidden: true,
          },
        ],
      });
    }
    // eslint-disable-next-line
  }, [salesData]);
  /* Chart를 위한 모든 data가 준비된 후에 Chart를 그립니다. */
  /* 주의! 준비되기 전(초기값 상태, undefined상태 등)에서 Chart를 그리려고 하면 */
  /* block되어 모든 procedure가 실행되지 않습니다. */
  useEffect(() => {
    if (chartdata_sales !== undefined) {
      setShowChart_sales(true);
    }
  }, [chartdata_sales]);

  /* Chart에 대한 options를 설정합니다. */
  const chartoption_sales = {
    responsive: true,
    aspectRatio: aspectRatio,
    plugins: {
      title: {
        display: true,
        text: '매출액 추이',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 4) {
              return context.dataset.label + ': ' + context.formattedValue + '억원';
            } else if (context.datasetIndex === 0) {
              return context.dataset.label + ': ' + context.formattedValue + '%';
            } else if (context.datasetIndex === 2) {
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

  return <>{showChart_sales ? <Chart type="bar" data={chartdata_sales} options={chartoption_sales}></Chart> : <></>}</>;
};

export default FinancialReportSalesChart;
