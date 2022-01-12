import { ToastContainer, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { MdOutlineThumbUp, MdOutlineThumbDown, MdOutlineThumbsUpDown } from 'react-icons/md';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RoeToast = ({ indutyCompareData, roe_list, roe_linear_list, roe_linear_score }) => {
  /* 아래 변수들에 출력할 jsx element를 저장합니다. */
  let toast_main_first = <div key="RoeToast_main_first"></div>;
  let toast_main_second = <div key="RoeToast_main_second"></div>;
  let toast_main_third = <div key="RoeToast_main_third"></div>;
  let toast_score = <div key="RoeToast_score"></div>;

  /* roe_linear_list, roe_linear_score가 set된 이후에 실행합니다 */
  if (roe_linear_list !== undefined && roe_linear_score !== undefined) {
    if (roe_linear_score === 0) {
      toast_main_first = (
        <div className="d-flex" key="RoeToast_main_first">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* array average function */
      const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
      /* taost_main_first */
      let exnan_roe_list = roe_list.filter((value) => !isNaN(value));
      const average_roe = parseFloat(average(exnan_roe_list).toFixed(2));
      if (average_roe >= 12) {
        toast_main_first = (
          <div className="mb-2" key="RoeToast_main_first">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            평균 ROE가 <strong>{`${average_roe}%`}</strong>에요. 워렌 버핏이 12~15%정도 나오면 좋은 회사라 했다 하니까, 이정도면 좋은 회사라고 해도 되겠죠!
          </div>
        );
      } else if (average_roe >= 0) {
        toast_main_first = (
          <div className="mb-2" key="RoeToast_main_first">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            평균 ROE가 <strong>{`${average_roe}%`}</strong>에요. 평이한 수준이네요. 덩치가 충분히 크다면(자본이 충분하다면) 이정도로도 충분하지만, 아니라면 좀
            더 효율적으로 순이익을 챙겨야 할 필요성이 있겠어요.
          </div>
        );
      } else if (average_roe < 0) {
        toast_main_first = (
          <div className="mb-2" key="RoeToast_main_first">
            <MdOutlineThumbDown size={20} className="me-2" />
            평균 ROE가 <strong>{`${average_roe}%`}</strong>에요. 적자가 발생하고 있어요... 이대로면 적자가 밑천마저 갉아먹을거에요.
          </div>
        );
      }

      /* toast_main_second */
      const induty_average_roe = parseFloat(average(indutyCompareData.induty_roe_list.slice(0, 5)).toFixed(2));
      if ((induty_average_roe > 0 && average_roe > induty_average_roe * 1.4) || (induty_average_roe < 0 && average_roe > induty_average_roe * 0.6)) {
        toast_main_second = (
          <div className="mb-2" key="RoeToast_main_second">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            업종 평균 ROE는 <strong>{induty_average_roe}%</strong>에요. 아주 훌륭해요! 타 기업보다 월등히 효율적으로 자본을 사용하고 있어요.
          </div>
        );
      } else if ((induty_average_roe > 0 && average_roe > induty_average_roe * 1.1) || (induty_average_roe < 0 && average_roe > induty_average_roe * 0.9)) {
        toast_main_second = (
          <div className="mb-2" key="RoeToast_main_second">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            업종 평균 ROE는 <strong>{induty_average_roe}%</strong>에요. 좋아요! 어디가서 이 회사는 수익성이 부족해서... 같은 소리는 안 듣겠네요.
          </div>
        );
      } else if ((induty_average_roe > 0 && average_roe > induty_average_roe * 0.9) || (induty_average_roe < 0 && average_roe > induty_average_roe * 1.1)) {
        toast_main_second = (
          <div className="mb-2" key="RoeToast_main_second">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            업종 평균 ROE는 <strong>{induty_average_roe}%</strong>에요. 남들 하는 만큼은 하네요. 사실 그게 얼마나 어려운 건지 알면, 어떻게 보면 대단할 걸 수도
            있어요.
          </div>
        );
      } else if ((induty_average_roe > 0 && average_roe > induty_average_roe * 0.6) || (induty_average_roe < 0 && average_roe > induty_average_roe * 1.4)) {
        toast_main_second = (
          <div className="mb-2" key="RoeToast_main_second">
            <MdOutlineThumbDown size={20} className="me-2" />
            업종 평균 ROE는 <strong>{induty_average_roe}%</strong>에요. 수익성이 좀 부족하네요. 수익 모델등에 좀 더 보완이 필요할 것 같아요.
          </div>
        );
      } else if ((induty_average_roe > 0 && average_roe < induty_average_roe * 0.6) || (induty_average_roe < 0 && average_roe < induty_average_roe * 1.4)) {
        toast_main_second = (
          <div className="mb-2" key="RoeToast_main_second">
            <MdOutlineThumbDown size={20} className="me-2" />
            업종 평균 ROE는 <strong>{induty_average_roe}%</strong>에요. 뭔가 사업 자체에 문제가 있어요. 상대적으로 너무 비효율적이에요. 수익 모델의 대대적인
            개편이나, 수익 창출 방식에 큰 변화가 필요할 것 같아요.
          </div>
        );
      }

      /* toast_main_third */
      let growthrate = parseFloat((roe_linear_list[1] - roe_linear_list[0]).toFixed(2));
      /* 최초값과 최근값의 부호가 다른 경우, growthrate가 제대로 구해지지 않습니다. */
      /* 이 경우엔 가장 최근 년도 두개의 차이로 구합니다. */
      if (isNaN(growthrate)) {
        growthrate = exnan_roe_list.at(-1) - exnan_roe_list.at(-2);
      }
      if (growthrate >= 3) {
        toast_main_third = (
          <div className="mb-2" key="RoeToast_main_third">
            <MdOutlineThumbUp size={20} className="me-2" />
            매년 약 <strong>{`${growthrate.toFixed(2)}%`}</strong>의 상승이 예상돼요. 더더욱 효율적으로 돈을 쓰도록 발전해가고 있네요! 기업이 더욱 성숙해지고
            있어요.
          </div>
        );
      } else if (growthrate >= -1) {
        toast_main_third = (
          <div className="mb-2" key="RoeToast_main_third">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate.toFixed(2)}%`}</strong>의 변동이 예상돼요. 큰 변화는 없네요. 충분한 수익 모델을 갖춰서 유지하고 있는 거라면 충분히
            좋은 상태이고, 그렇지 않다면... 되려 큰 변화가 필요해요.
          </div>
        );
      } else if (growthrate < -1) {
        toast_main_third = (
          <div className="mb-2" key="RoeToast_main_third">
            <MdOutlineThumbDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate.toFixed(2)}%`}</strong>의 하락이 예상돼요. 점점 수익성이 떨어지고 있어요! 수익 모델에 어느정도 변화가 필요할 것
            같아요.
          </div>
        );
      }

      /* toast_score */
      if (roe_linear_score < 0.16) {
        toast_score = (
          <div className="mb-2" key="RoeToast_score">
            <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
            {'ROE의 '}
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
            가 {roe_linear_score}이에요. 아주 안정적이네요! 미래에 어느 정도 수익을 창출할지 쉽게 예측할 수 있겠어요.
          </div>
        );
      } else if (roe_linear_score < 0.2) {
        toast_score = (
          <div className="mb-2" key="RoeToast_score">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            {'ROE의 '}
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
            가 {roe_linear_score}이에요. 어느정도 변동성이 있어요. 여러번 수익 모델등을 바꾸면 이와 같을 가능성이 높은데, 더 높은 수익을 향해 가고 있으면
            다행이지만, 아니라면 주의가 필요해요.
          </div>
        );
      } else if (roe_linear_score > 0.2) {
        toast_score = (
          <div className="mb-2" key="RoeToast_score">
            <MdOutlineThumbDown size={20} className="me-2" />
            {'ROE의 '}
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
            가 {roe_linear_score}이에요. 변동성이 너무 커요! 수익 모델등 주요 수익성 관련 계획들이 방향을 못 잡고 이리저리 흔들리고 있는 상태일 가능성이 높아요.
            회사의 수익창출능력에 대한 확인이 필요해요.
          </div>
        );
      }
    }
  }
  return [toast_main_first, toast_main_second, toast_main_third, toast_score];
};

const FinancialReportRoeToast = ({ roeData }) => {
  const stock_code = roeData && roeData.stock_code;

  const [indutyCompareData, setIndutyCompareData] = useState({
    induty_roe_list: [],
  });
  const fetchData = async () => {
    if (stock_code !== undefined) {
      let induty_roe_list = [];
      const response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=roe`);
      if (response.data.length > 0) {
        induty_roe_list = response.data.map((data) => data.roe);
        induty_roe_list = induty_roe_list.filter((x) => x);
        induty_roe_list = induty_roe_list.map((data) => parseFloat(data.toFixed(2)));
      }
      setIndutyCompareData({
        induty_roe_list: induty_roe_list,
      });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [stock_code]);

  return (
    <ToastContainer style={{ width: '100%' }}>
      {/* RoeToast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">ROE</strong>
          <OverlayTrigger
            key="sales_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_sales">
                자본총계(지배)에 대한 당기순이익(지배) 비율을 의미해요.
                <br />
                기업이 밑천인 자본을 갖고 얼마나 많은 수익을 냈는지를 표현하는 수익성 지표에요!
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <RoeToast
            indutyCompareData={indutyCompareData}
            roe_list={roeData && roeData.roe_list}
            roe_linear_list={roeData && roeData.roe_linear_list}
            roe_linear_score={roeData && roeData.roe_linear_score}
          />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default FinancialReportRoeToast;
