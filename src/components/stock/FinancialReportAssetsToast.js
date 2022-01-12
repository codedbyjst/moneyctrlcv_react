import { ToastContainer, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { MdOutlineThumbUp, MdOutlineThumbDown, MdOutlineThumbsUpDown } from 'react-icons/md';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TotalEquityToast = ({ total_equity_list, total_equity_linear_score, capital_list }) => {
  /* 아래 변수에 출력할 jsx element를 저장합니다. */
  let toast_main = <div key="TotalEquityToast_main"></div>;
  let toast_captial_impairment = <div key="TotalEquityToast_capital_impariment"></div>;

  /* total_equity_list가 set된 이후에 실행합니다. */
  if (total_equity_list !== undefined) {
    /* Data가 부족해 표시 불가능한 경우엔 예측이 불가능하다고 표시합니다. */
    if (total_equity_linear_score === 0) {
      toast_main = (
        <div className="d-flex" key="TotalEquityToast_main">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* toast_main */
      /* 성장률을 연산합니다.*/
      let exnan_total_equity_list = total_equity_list.filter((value) => !isNaN(value));
      const growthrate = parseFloat(
        ((Math.pow(exnan_total_equity_list.at(-1) / exnan_total_equity_list.at(0), 1 / (exnan_total_equity_list.length - 1)) - 1) * 100).toFixed(2),
      );
      if (growthrate >= 0) {
        toast_main = (
          <div className="mb-2" key="TotalEquityToast_main">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 성장이 기대돼요. 최소한 남는 장사를 하고 있다는건 확실하네요!
          </div>
        );
      } else if (growthrate < 0) {
        toast_main = (
          <div className="mb-2" key="TotalEquityToast_main">
            <MdOutlineThumbDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 하락이 예상돼요. 밑천을 깎아먹고 있어요! 기업의 가치가 떨어지고 있는 것 같아요...
            <OverlayTrigger
              key="capital_impairment_popover"
              placement="top"
              overlay={
                <Tooltip id="captial_impairment_tooltip">
                  기존 투자금액마저 소멸되는 상태.
                  <br />
                  <strong>[관리종목 지정 및 상장폐지 사유]</strong>
                </Tooltip>
              }
            >
              <i>자본잠식</i>
            </OverlayTrigger>
            이 일어나진 않을지 확인해보세요.
          </div>
        );
      }
      /* toast_capital_impairment */
      let exnan_capital_list = capital_list.filter((value) => !isNaN(value));
      const capital_impairment_rate = parseFloat(((1 - exnan_total_equity_list.at(-1) / exnan_capital_list.at(-1)) * 100).toFixed(2));
      if (capital_impairment_rate >= 0) {
        toast_captial_impairment = (
          <div className="mb-2" key="TotalEquityToast_capital_impariment">
            <MdOutlineThumbDown size={20} className="me-2" />
            <OverlayTrigger
              key="capital_impairment_popover"
              placement="top"
              overlay={
                <Tooltip id="captial_impairment_tooltip">
                  기존 투자금액마저 소멸되는 상태.
                  <br />
                  <strong>[관리종목 지정 및 상장폐지 사유]</strong>
                </Tooltip>
              }
            >
              <i>자본잠식</i>
            </OverlayTrigger>
            이 발생하고 있어요! 현재
            <OverlayTrigger
              key="capital_impairment_popover"
              placement="top"
              overlay={
                <Tooltip id="captial_impairment_tooltip">
                  <strong>
                    50%이상시 관리종목 지정,
                    <br /> 2년 연속시 상장폐지
                  </strong>
                </Tooltip>
              }
            >
              <i>자본잠식률</i>
            </OverlayTrigger>
            은 <strong>{capital_impairment_rate}%</strong>에요. 대표적인 상장폐지 요건이니 극히 조심하세요.
          </div>
        );
      }
    }
  }
  return [toast_main, toast_captial_impairment];
};

const DebtRatioToast = ({ indutyCompareData, debt_ratio_list, debt_ratio_linear_list, debt_ratio_linear_score }) => {
  /* 아래 변수들에 출력할 jsx element를 저장합니다. */
  let toast_main_first = <div key="DebtRatioToast_main_first"></div>;
  let toast_main_second = <div key="DebtRatioToast_main_second"></div>;
  let toast_main_third = <div key="DebtRatioToast_main_third"></div>;
  let toast_score = <div key="DebtRatioToast_score"></div>;

  /* debt_ratio_linear_list, debt_ratio_linear_score가 set된 이후에 실행합니다. */
  if (debt_ratio_linear_list !== undefined && debt_ratio_linear_score !== undefined) {
    /* Data가 부족해 표시 불가능한 경우엔 예측이 불가능하다고 표시합니다. */
    if (debt_ratio_linear_score === 0) {
      toast_main_first = (
        <div className="d-flex" key="DebtRatioToast_main_first">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* array average function */
      const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

      /* toast_main_first */
      let exnan_debt_ratio_list = debt_ratio_list.filter((value) => !isNaN(value));
      const average_debt_ratio = parseFloat(average(exnan_debt_ratio_list).toFixed(2));
      if (average_debt_ratio >= 200) {
        toast_main_first = (
          <div className="mb-2" key="DebtRatioToast_main_first">
            <MdOutlineThumbDown size={20} className="me-2" />
            평균 부채비율이 <strong>{`${average_debt_ratio}%`}</strong>에요. 부채비율이 매우 높아 재무건전성을 크게 의심해 봐야 해요. 다만, 업종 특성상 그런
            걸수도 있으니까 아래 있는 업종 평균도 참조하세요.
          </div>
        );
      } else if (average_debt_ratio >= 100) {
        toast_main_first = (
          <div className="mb-2" key="DebtRatioToast_main_first">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            평균 부채비율이 <strong>{`${average_debt_ratio}%`}</strong>에요. 부채비율이 좀 높네요. 빚 지는 것도 능력이라지만, 무리하고 있는 걸수도 있으니...
            어디다 쓰려고 그리 빌린건지 유심히 확인해야겠어요.
          </div>
        );
      } else if (average_debt_ratio >= 50) {
        toast_main_first = (
          <div className="mb-2" key="DebtRatioToast_main_first">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            평균 부채비율이 <strong>{`${average_debt_ratio}%`}</strong>에요. 평이한 수준이에요. 재무적으로 보자면, 건전하다고 할 수 있겠어요!
          </div>
        );
      } else if (average_debt_ratio >= 0) {
        toast_main_first = (
          <div className="mb-2" key="DebtRatioToast_main_first">
            <MdOutlineThumbDown size={20} className="me-2" />
            평균 부채비율이 <strong>{`${average_debt_ratio}%`}</strong>에요. 어, 뭐지? 낮으면 좋은거 아닌가? 할 수도 있겠지만, 다르게 보자면 회사가
            <OverlayTrigger
              key="leverage_popover"
              placement="top"
              overlay={<Tooltip id="leverage_tooltip">수익 증대를 위해 적절한 수준의 부채를 동원하여 지렛대 효과를 노리는 투자방식</Tooltip>}
            >
              <i>{' 레버리지'}</i>
            </OverlayTrigger>
            를 충분히 활용하지 못하고 있다고 볼 수도 있어요. 이렇게 되면 안전성 측면에선 좋아 보일지 몰라도, 성장성 측면에선 되려 위험한 걸 수도 있거든요.
          </div>
        );
      }

      /* toast_main_second */
      if (indutyCompareData.induty_debt_ratio_list.length === 1) {
        toast_main_second = (
          <div className="mb-2" key="DebtRatioToast_main_second">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            윽, 비교대상이 없네요. 적절한 부채비율인지 알려면 해당 산업을 잘 조사해야겠어요.
          </div>
        );
      } else if (indutyCompareData.induty_debt_ratio_list.length > 1) {
        const induty_average_debt_ratio = parseFloat(average(indutyCompareData.induty_debt_ratio_list.slice(0, 5)).toFixed(2));
        if (average_debt_ratio > induty_average_debt_ratio * 1.2) {
          toast_main_second = (
            <div className="mb-2" key="DebtRatioToast_main_second">
              <MdOutlineThumbDown size={20} className="me-2" />
              업종 평균 부채비율은 <strong>{induty_average_debt_ratio}%</strong>에요. 부채비율이 상대적으로 너무 높아요! 과도하게 재정을 불안정하게 운영중일
              가능성이 커요. 와르르 맨션이 되기 싫다면 조심해야 할 거에요.
            </div>
          );
        } else if (average_debt_ratio > induty_average_debt_ratio * 0.8) {
          toast_main_second = (
            <div className="mb-2" key="DebtRatioToast_main_second">
              <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
              업종 평균 부채비율은 <strong>{induty_average_debt_ratio}%</strong>에요. 평균과 비슷한 부채비율이라면, 산업 자체가 위험한 게 아니라면 적절한 재정
              운영이 이뤄지고 있다고 볼 수 있어요.
            </div>
          );
        } else if (average_debt_ratio <= induty_average_debt_ratio * 0.8) {
          toast_main_second = (
            <div className="mb-2" key="DebtRatioToast_main_second">
              <MdOutlineThumbsUpDown size={20} className="me-2" />
              업종 평균 부채비율은 <strong>{induty_average_debt_ratio}%</strong>에요. 다른 동일 업종 기업들에 비해 부채비율이 좀 낮네요. 부채비율은 낮다고 꼭
              좋은건 아니에요.
              <OverlayTrigger
                key="leverage_popover"
                placement="top"
                overlay={<Tooltip id="leverage_tooltip">수익 증대를 위해 적절한 수준의 부채를 동원하여 지렛대 효과를 노리는 투자방식</Tooltip>}
              >
                <i>{' 레버리지'}</i>
              </OverlayTrigger>
              를 충분히 활용하지 못하고 과도하게 안정성을 중심으로 운영하는 상태일 수 있어요.
            </div>
          );
        }
      }

      /* toast_main_third */
      const growthrate = parseFloat((debt_ratio_linear_list[1] - debt_ratio_linear_list[0]).toFixed(2));
      if (growthrate > 20 || growthrate < -20) {
        toast_main_third = (
          <div className="mb-2" key="DebtRatioToast_main_third">
            <MdOutlineThumbDown className="me-2" size={20} />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 변화가 너무 심해요! 이렇게 지속적으로 큰 변화가 있는 경우, 회사의 재무구조 및 전략
            자체가 변경되었을 가능성이 높아요. 또는.. 망해가고 있던가요.
          </div>
        );
      } else if (-20 < growthrate && growthrate < 20) {
        toast_main_third = (
          <div className="mb-2" key="DebtRatioToast_main_third">
            <MdOutlineThumbDown className="me-2" size={20} />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 지속적인 큰 변화는 보이지 않네요. 재무구조는 거의 그대로라고 볼 수 있을 것 같아요.
          </div>
        );
      }

      /* toast_score */
      if (debt_ratio_linear_score < 0.16) {
        toast_score = (
          <div className="mb-2" key="DebtRatioToast_score">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            {'부채비율의 '}
            <OverlayTrigger
              key="linear_score_popover"
              placement="top"
              overlay={
                <Tooltip id="tooltip_linear_score">
                  추세선과 얼마나 차이가 있는지를 나타내는 지수에요.
                  <br />
                  높을수록 추세선과는 차이가 커요.
                </Tooltip>
              }
            >
              <i>불안정성 지수</i>
            </OverlayTrigger>
            가 {debt_ratio_linear_score}이에요. 투자/운영전략이 변하지 않고 꾸준히 한 길로 나아가고 있는 것 같아요.
          </div>
        );
      } else if (debt_ratio_linear_score < 0.2) {
        toast_score = (
          <div className="mb-2" key="DebtRatioToast_score">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            {'부채비율의 '}
            <OverlayTrigger
              key="linear_score_popover"
              placement="top"
              overlay={
                <Tooltip id="tooltip_linear_score">
                  추세선과 얼마나 차이가 있는지를 나타내는 지수에요.
                  <br />
                  높을수록 추세선과는 차이가 커요.
                </Tooltip>
              }
            >
              <i>불안정성 지수</i>
            </OverlayTrigger>
            가 {debt_ratio_linear_score}이에요. 동향을 살피기엔 변동성이 좀 크네요. 기업이 최근 어떤 사업들을 진행중이여서 이런지 눈여겨볼 필요성이 있겠어요.
          </div>
        );
      } else if (debt_ratio_linear_score >= 0.2) {
        toast_score = (
          <div className="mb-2" key="DebtRatioToast_score">
            <MdOutlineThumbDown size={20} className="me-2" />
            {'부채비율의 '}
            <OverlayTrigger
              key="linear_score_popover"
              placement="top"
              overlay={
                <Tooltip id="tooltip_linear_score">
                  추세선과 얼마나 차이가 있는지를 나타내는 지수에요.
                  <br />
                  높을수록 추세선과는 차이가 커요.
                </Tooltip>
              }
            >
              <i>불안정성 지수</i>
            </OverlayTrigger>
            가 {debt_ratio_linear_score}이에요. 변동폭이 너무 커요! 회사가 갈 길을 못 찾아 해메고 있을 수 있어요. 부채비율의 불안정성은 재무신뢰도를 망가트릴 수
            있으니, 회사가 어느 방향으로 나아가고 있는지 확인이 필요해요.
          </div>
        );
      }
    }
  }
  return [toast_main_first, toast_main_second, toast_main_third, toast_score];
};

const FinancialReportAssetsToast = ({ assetsData }) => {
  const stock_code = assetsData && assetsData.stock_code;

  const [indutyCompareData, setIndutyCompareData] = useState({
    induty_debt_ratio_list: [],
  });
  const fetchData = async () => {
    let induty_debt_ratio_list = [];
    if (stock_code !== undefined) {
      const response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=debt_ratio`);
      if (response.data.length > 0) {
        induty_debt_ratio_list = response.data.map((data) => data.debt_ratio);
        induty_debt_ratio_list = induty_debt_ratio_list.filter((x) => x);
        induty_debt_ratio_list = induty_debt_ratio_list.map((data) => parseFloat(data.toFixed(2)));
      }
    }
    setIndutyCompareData({
      induty_debt_ratio_list: induty_debt_ratio_list,
    });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [stock_code]);

  return (
    <ToastContainer style={{ width: '100%' }}>
      {/* TotalEquityTast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">자본총계</strong>
          <OverlayTrigger
            key="sales_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_sales">
                기업의 밑천을 의미해요.
                <br />즉 빚진 돈이 아니라, 온전한 기업의 돈이라는 의미에요!
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <TotalEquityToast
            total_equity_list={assetsData && assetsData.total_equity_list}
            total_equity_linear_score={assetsData && assetsData.total_equity_linear_score}
            capital_list={assetsData && assetsData.capital_list}
          />
        </Toast.Body>
      </Toast>

      {/* DebtRatioToast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">부채비율</strong>
          <OverlayTrigger
            key="operating_margin_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_operating_margin">
                매출액에 대한 영업이익 비율을 의미해요.
                <br />
                기업의 주된 판매(영업)으로 인한 수익성을 나타내는 지표에요!
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <DebtRatioToast
            indutyCompareData={indutyCompareData}
            debt_ratio_list={assetsData && assetsData.debt_ratio_list}
            debt_ratio_linear_list={assetsData && assetsData.debt_ratio_linear_list}
            debt_ratio_linear_score={assetsData && assetsData.debt_ratio_linear_score}
          />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default FinancialReportAssetsToast;
