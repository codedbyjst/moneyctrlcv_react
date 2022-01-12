import NavbarComp from '../common/NavbarComp';
import { useParams } from 'react-router';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Container, OverlayTrigger } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import FinancialReportSalesChart from './FinancialReportSalesChart';
import FinancialReportSalesToast from './FinancialReportSalesToast';
import FinancialReportAssetsChart from './FinancialReportAssetsChart';
import FinancialReportAssetsToast from './FinancialReportAssetsToast';
import FinancialReportRoeChart from './FinancialReportRoeChart';
import FinancialReportRoeToast from './FinancialReportRoeToast';
import FinancialReportIndutySalesChart from './FinancialReportIndutySalesChart';
import FinancialReportIndutySalesToast from './FinancialReportIndutySalesToast';

const FinancialReportStock = () => {
  const stock_code = useParams().stock_code;
  const [corpData, setCorpData] = useState();
  const [financialState, setFinancialState] = useState([]);
  const [financialStateEtc, setFinancialStateEtc] = useState([]);

  /* Chart width 결정용(상위 container ref) */
  const ref = useRef(null);

  /* 공통 Chart parameter */
  /* Chart의 x축(label)은 2015~조회년도 직전년도까지 이여야 합니다. */
  const label_year_list = [...Array(new Date().getFullYear() - 2015).keys()].map((idx) => idx + 2015);
  const [chartWidth, setChartWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [showAxistitle, setShowAxistitle] = useState(true);

  /* 각 chart의 data */
  const [salesData, setSalesData] = useState();
  const [assetsData, setAssetsData] = useState();
  const [roeData, setRoeData] = useState();

  /* Chart들의 size를 정할때 render되는 특정 component(element)의 width를 이용할 것입니다. */
  /* 이때 width값은 render된 후에 알 수 있고, 해당 값을 저장할 수 있는 변수(chartWidth)가 필요하므로 */
  /* useEffect함수와 useState함수를 이용합니다. */
  const resizeCalc = () => {
    if (ref.current !== null) {
      const new_width = ref.current.clientWidth > 600 ? ref.current.clientWidth / 2 : ref.current.clientWidth;
      setChartWidth(new_width);
      setAspectRatio(new_width > 450 ? 2 : 1.3);
      setShowAxistitle(new_width > 450 ? true : false);
    }
  };
  useEffect(() => {
    /* resize 전 기초값 설정 */
    resizeCalc();
    /* 최초의 값 설정만을 위해선 위의 함수면 충분하지만, resize 이벤트가 발생했을때 dynamic하게 처리해주도록 합니다. */
    /* resize 이벤트에 대응해 기존 component들을 다시 render하기 위해, EventListner를 추가합니다.*/
    window.addEventListener('resize', resizeCalc);
    /* 메모리 누수를 방지하기 위해 component가 unmount된 후엔 EventListner를 삭제합니다. */
    return () => {
      window.removeEventListener('reszie', resizeCalc);
    };
  }, []);

  /* api서버에서 데이터를 가져옵니다. */
  const fetchData = async () => {
    /* corpdata(기본 정보) */
    let response = await axios.get(`https://api.moneyctrlcv.com/stock/corpdata/${stock_code}`);
    setCorpData(response.data);
    /* FinancialState(재무제표 정보) */
    response = await axios.get(`https://api.moneyctrlcv.com/stock/financial_state/${stock_code}`);
    setFinancialState(response.data);
    /* FinancialStateEtc(재무제표 부가정보) */
    response = await axios.get(`https://api.moneyctrlcv.com/stock/financial_state_etc/${stock_code}`);
    setFinancialStateEtc(response.data);
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  /* api 서버에서 받아온 데이터(json)을 list의 형태로 변환해줍니다. */
  const ItemsList = (dataList, key, dtype = 'BIGINT') => {
    /* 아래 함수를 통해 api상 비어있을 수 있는 공간들을 채운 list를 생성해야 합니다. */
    /* Chart.js는 데이터가 비어있는 곳에 NaN을 넣어주는 것으로 정상 작동합니다. */
    /* 어디가 비어있는지 알아내고, 해당 idx에 맞춰 NaN을 넣어주기 위해 연도 list를 생성합니다. */
    const db_year_list = dataList.map(({ bsns_year }) => bsns_year);
    let db_data_list;
    if (dtype === 'BIGINT') {
      db_data_list = dataList.map((data) => parseFloat((data[key] / 100000000).toFixed(0)));
    } else if (dtype === 'FLOAT') {
      db_data_list = dataList.map((data) => parseFloat((data[key] / 1).toFixed(2)));
    }
    /* 연도 list를 활용하여 데이터가 빈 년도를 알아내 해당 idx에 대입해줍니다. */
    for (const [index, label_year] of label_year_list.entries()) {
      if (db_year_list.includes(label_year) === false) {
        db_data_list.splice(index, 0, NaN);
      }
    }
    return db_data_list;
  };
  /* 단 1개년도의 데이터만 갖고 있는 경우, financialState의 길이는 1이지만 financialStateEtc의 길이는 0입니다. */
  /* 이를 처리하기 위해 score의 기본값은 0으로 하고, financialStateEtc의 길이가 1이상인 경우 해당 값을 넣도록 합니다.*/
  const linear_score = (key) => {
    let score = 0;
    if (financialStateEtc.length > 0) {
      score = parseFloat(financialStateEtc[0][key]);
    }
    return score;
  };
  useEffect(() => {
    if (financialState.length > 0) {
      const sales_list = ItemsList(financialState, 'sales', 'BIGINT');
      const sales_linear_list = ItemsList(financialStateEtc, 'sales_linear', 'BIGINT');
      const sales_linear_score = linear_score('sales_linear_score');
      const operating_profit_margin_list = ItemsList(financialState, 'operating_profit_margin', 'FLOAT');
      const operating_profit_margin_linear_list = ItemsList(financialStateEtc, 'operating_profit_margin_linear', 'FLOAT');
      const operating_profit_margin_linear_score = linear_score('operating_profit_margin_linear_score');
      const net_profit_margin_list = ItemsList(financialState, 'net_profit_margin', 'FLOAT');
      const net_profit_margin_linear_list = ItemsList(financialStateEtc, 'net_profit_margin_linear', 'FLOAT');
      const net_profit_margin_linear_score = linear_score('net_profit_margin_linear_score');
      setSalesData({
        stock_code: stock_code,
        label_year_list: label_year_list,
        sales_list: sales_list,
        sales_linear_list: sales_linear_list,
        sales_linear_score: sales_linear_score,
        operating_profit_margin_list: operating_profit_margin_list,
        operating_profit_margin_linear_list: operating_profit_margin_linear_list,
        operating_profit_margin_linear_score: operating_profit_margin_linear_score,
        net_profit_margin_list: net_profit_margin_list,
        net_profit_margin_linear_list: net_profit_margin_linear_list,
        net_profit_margin_linear_score: net_profit_margin_linear_score,
      });

      const total_equity_list = ItemsList(financialState, 'total_equity', 'BIGINT');
      const total_equity_linear_list = ItemsList(financialStateEtc, 'total_equity_linear', 'BIGINT');
      const total_equity_linear_score = linear_score('total_equity_linear_score');
      const total_liabilities_list = ItemsList(financialState, 'total_liabilities', 'BIGINT');
      const total_liabilities_linear_list = ItemsList(financialStateEtc, 'total_liabilities_linear', 'BIGINT');
      const total_liabilities_linear_score = linear_score('total_liabilities_linear_score');
      const total_assets_list = ItemsList(financialState, 'total_assets', 'BIGINT');
      const total_assets_linear_list = ItemsList(financialStateEtc, 'total_assets_linear', 'BIGINT');
      const total_assets_linear_score = linear_score('total_assets_linear_score');
      const debt_ratio_list = ItemsList(financialState, 'debt_ratio', 'FLOAT');
      const debt_ratio_linear_list = ItemsList(financialStateEtc, 'debt_ratio_linear', 'FLOAT');
      const debt_ratio_linear_score = linear_score('debt_ratio_linear_score');
      const capital_list = ItemsList(financialState, 'capital', 'BIGINT');
      setAssetsData({
        stock_code: stock_code,
        label_year_list: label_year_list,
        total_equity_list: total_equity_list,
        total_equity_linear_list: total_equity_linear_list,
        total_equity_linear_score: total_equity_linear_score,
        total_liabilities_list: total_liabilities_list,
        total_liabilities_linear_list: total_liabilities_linear_list,
        total_liabilities_linear_score: total_liabilities_linear_score,
        total_assets_list: total_assets_list,
        total_assets_linear_list: total_assets_linear_list,
        total_assets_linear_score: total_assets_linear_score,
        debt_ratio_list: debt_ratio_list,
        debt_ratio_linear_list: debt_ratio_linear_list,
        debt_ratio_linear_score: debt_ratio_linear_score,
        capital_list: capital_list,
      });

      const total_equity_control_list = ItemsList(financialState, 'total_equity_control', 'BIGINT');
      const total_equity_control_linear_list = ItemsList(financialStateEtc, 'total_equity_control_linear', 'BIGINT');
      const total_equity_control_linear_score = linear_score('total_equity_control_linear_score');
      const net_profit_control_list = ItemsList(financialState, 'net_profit_control', 'BIGINT');
      const net_profit_control_linear_list = ItemsList(financialStateEtc, 'net_profit_control_linear', 'BIGINT');
      const net_profit_control_linear_score = linear_score('net_profit_control_linear_score');
      const net_profit_list = ItemsList(financialState, 'net_profit', 'BIGINT');
      const net_profit_linear_list = ItemsList(financialStateEtc, 'net_profit_linear', 'BIGINT');
      const net_profit_linear_score = linear_score('net_profit_linear_score');
      const operating_profit_list = ItemsList(financialState, 'operating_profit', 'BIGINT');
      const operating_profit_linear_list = ItemsList(financialStateEtc, 'operating_profit_linear', 'BIGINT');
      const operating_profit_linear_score = linear_score('operating_profit_linear_score');
      const roe_list = ItemsList(financialState, 'roe', 'FLOAT');
      const roe_linear_list = ItemsList(financialStateEtc, 'roe_linear', 'FLOAT');
      const roe_linear_score = linear_score('roe_linear_score');
      setRoeData({
        stock_code: stock_code,
        label_year_list: label_year_list,
        total_equity_control_list: total_equity_control_list,
        total_equity_control_linear_list: total_equity_control_linear_list,
        total_equity_control_linear_score: total_equity_control_linear_score,
        net_profit_control_list: net_profit_control_list,
        net_profit_control_linear_list: net_profit_control_linear_list,
        net_profit_control_linear_score: net_profit_control_linear_score,
        net_profit_list: net_profit_list,
        net_profit_linear_list: net_profit_linear_list,
        net_profit_linear_score: net_profit_linear_score,
        operating_profit_list: operating_profit_list,
        operating_profit_linear_list: operating_profit_linear_list,
        operating_profit_linear_score: operating_profit_linear_score,
        roe_list: roe_list,
        roe_linear_list: roe_linear_list,
        roe_linear_score: roe_linear_score,
      });
    }
    // eslint-disable-next-line
  }, [financialState, financialStateEtc]);

  return (
    <div>
      {/*Navbar 컴포넌트를 세팅합니다.*/}
      <NavbarComp />

      {/*Main*/}
      <Container>
        <h1 className="mt-2 text-center">
          {corpData && corpData.stock_name}({corpData && corpData.stock_code}) 재무제표 분석
        </h1>
        <Alert className="mt-2 mb-3 text-center" variant="primary">
          법인명 : {corpData && corpData.corp_name}
          <br />
          법인명(영문) : {corpData && corpData.corp_name_eng}
          <br />
          상장 거래소 : {corpData && corpData.stock_market}
          <br />
          코드 : {corpData && corpData.stock_code}
          <br />
          {'업종분류 : '}
          <OverlayTrigger
            trigger={['hover', 'focus']}
            key="kisc_detail"
            placement="bottom"
            overlay={
              <Popover id="popover" className="text-center">
                <Popover.Header>
                  <strong>{corpData && corpData.induty_name}</strong>
                </Popover.Header>
                <Popover.Body>
                  {corpData && corpData.induty_desc}
                  <br />
                  <strong>KSIC 한국표준산업분류</strong>
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="secondary" size="sm">
              {corpData && corpData.induty_name}
            </Button>
          </OverlayTrigger>
          <br />
        </Alert>
        <Alert className="mt-2 mb-3 text-center" variant="info">
          🌟각 차트 위의 취소선을 클릭해보세요! 추가 정보(추세선)가 제공됩니다.🌟
          <br />
          추세선은 실제 값을 기반으로 머신 러닝(선형 회귀)을 통해 도출된 값으로서, 동향을 파악하는데에 참조 자료로서 제공됩니다.
        </Alert>

        {/* 분석 */}
        <Container ref={ref}>
          <div className="row">
            <div className="p-0 mb-3" id="chart_sales" style={{ width: `${chartWidth}px` }}>
              <FinancialReportSalesChart aspectRatio={aspectRatio} showAxistitle={showAxistitle} salesData={salesData} />
              <FinancialReportSalesToast salesData={salesData} />
            </div>
            <div className="p-0 mb-3" id="chart_assets" style={{ width: `${chartWidth}px` }}>
              <FinancialReportAssetsChart aspectRatio={aspectRatio} showAxistitle={showAxistitle} assetsData={assetsData} />
              <FinancialReportAssetsToast assetsData={assetsData} />
            </div>
            <div className="p-0 mb-3" id="chart_roe" style={{ width: `${chartWidth}px` }}>
              <FinancialReportRoeChart aspectRatio={aspectRatio} showAxistitle={showAxistitle} roeData={roeData} />
              <FinancialReportRoeToast roeData={roeData} />
            </div>
            <div className="p-0 mb-3" id="chart_indutycmp_sales" style={{ width: `${chartWidth}px` }}>
              <FinancialReportIndutySalesChart aspectRatio={aspectRatio} stock_code={stock_code} />
              <FinancialReportIndutySalesToast corpData={corpData} />
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default FinancialReportStock;
