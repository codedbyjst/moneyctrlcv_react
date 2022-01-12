import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const FinancialReportIndutySalesChart = ({ aspectRatio, stock_code }) => {
  const [chartdata_indutysales, setChartdata_indutysales] = useState();
  const [showchart_indutysales, setShowchart_indutysales] = useState(false);

  const [indutySalesData, setIndutySalesData] = useState();

  const fetchData = async () => {
    /* 업종별 정보 */
    const response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=sales`);
    const induty_stock_code_list = response.data.map((data) => data.stock_code);
    const induty_stock_name_list = response.data.map((data) => data.stock_name);
    const induty_sales_list = response.data.map((data) => data.sales);
    setIndutySalesData({
      induty_stock_code_list: induty_stock_code_list,
      induty_stock_name_list: induty_stock_name_list,
      induty_sales_list: induty_sales_list,
    });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [stock_code]);

  useEffect(() => {
    /* api서버에서 데이터를 받아온 후 Chart 데이터를 생성합니다. */
    if (stock_code !== undefined && indutySalesData !== undefined) {
      let induty_stock_code_list = indutySalesData.induty_stock_code_list;
      let induty_stock_name_list = indutySalesData.induty_stock_name_list;
      let induty_sales_list = indutySalesData.induty_sales_list;
      /* api서버에서 데이터를 받아온 직후인 현재 list는 sales를 기준으로 정렬되어 있습니다. */
      /* Chart.js에서 해당 데이터를 표시할때 직관성을 높이기 위해, stock_code에 대한 data가 가장 앞에 놓이도록 정렬되어야 합니다. */
      /* 우선 해당하는 데이터의 index를 구하고, 데이터의 값들을 변수에 저장해 둡니다. */
      const stock_index = induty_stock_code_list.findIndex((element) => element === stock_code);
      const stock_name = induty_stock_name_list[stock_index];
      const stock_sales = induty_sales_list[stock_index];
      /* 이제 해당 index의 값을 제거한 list를 만듭니다. */
      induty_stock_name_list = induty_stock_name_list.filter((item) => item !== stock_name);
      induty_sales_list = induty_sales_list.filter((item) => item !== stock_sales);
      /* 마지막으로, 위의 list의 0번째 index에 값을 대입합니다. */
      induty_stock_name_list.splice(0, 0, stock_name);
      induty_sales_list.splice(0, 0, stock_sales);

      /* 추가 작업 1. 동일 업종 회사가 너무 많으면 의미가 없으니 최대 7개 회사로 제한합니다. */
      induty_stock_name_list = induty_stock_name_list.slice(0, 7);
      induty_sales_list = induty_sales_list.slice(0, 7);
      /* 추가 작업 2. 단위가 원이므로 억원으로 바꿉니다. */
      induty_sales_list = induty_sales_list.map((data) => parseInt((data / 100000000).toFixed(0)));

      setChartdata_indutysales({
        labels: induty_stock_name_list,
        datasets: [
          {
            data: induty_sales_list,
            backgroundColor: ['#059BFF', '#8142FF', '#FF4069', '#FF9020', '#FFC234', '#22CFCF', '#B2B6BE'],
          },
        ],
      });
    }
    // eslint-disable-next-line
  }, [indutySalesData]);
  useEffect(() => {
    if (chartdata_indutysales !== undefined) {
      setShowchart_indutysales(true);
    }
  }, [chartdata_indutysales]);

  const chartoptions_indutysales = {
    aspectRatio: aspectRatio,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '최근년도 동일업종 매출액 비교',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return context.label + ': ' + context.formattedValue + '억원';
            }
          },
        },
      },
    },
  };

  return <>{showchart_indutysales ? <Doughnut data={chartdata_indutysales} options={chartoptions_indutysales}></Doughnut> : <></>}</>;
};

export default FinancialReportIndutySalesChart;
