import { ToastContainer, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { MdOutlineThumbUp, MdOutlineThumbDown } from 'react-icons/md';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';

const IndutySalesToast = ({ stock_code, stock_market, indutySalesData }) => {
  let toast_main = <></>;
  if (indutySalesData !== undefined) {
    let induty_stock_code_list = indutySalesData.induty_stock_code_list;
    let induty_bsns_year_list = indutySalesData.induty_bsns_year_list;
    let induty_sales_list = indutySalesData.induty_sales_list;
    /* 이 컴포넌트는 현재 본인의 자료만을 필요로 합니다. 따라서 해당 idx에 해당하는 data만 찾으면 됩니다. */
    const stock_index = induty_stock_code_list.findIndex((element) => element === stock_code);
    const stock_bsns_year = induty_bsns_year_list[stock_index];
    const stock_sales = parseInt((induty_sales_list[stock_index] / 100000000).toFixed(0)); // 계산 편의를 위해 억으로 단위를 나눕니다.

    /* Data가 부족해 표시 불가능한 경우엔 예측이 불가능하다고 표시합니다. */
    if (indutySalesData.induty_sales_list.length === 0) {
      toast_main = (
        <div className="d-flex">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      if (stock_market === 'KOSPI') {
        if (stock_sales >= 100) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 관리종목 지정 기준이 50억원이니까...
              적어도 매출액때문에 그런 걸 걱정한 필요는 없겠네요!
            </div>
          );
        } else if (stock_sales >= 60) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 관리종목 지정 기준이 50억원이니까...
              지금은 큰 문제가 보이진 않네요.
            </div>
          );
        } else if (stock_sales >= 50) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbDown size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 위험해요! 간신히 50억을 넘겼다고
              좋아할 게 아니라 억지로 넘겼을 가능성이 매우 높아요. 정말 고수라면 괜찮을 지 모르겠지만, 저라면 당장 던지겠어요.
            </div>
          );
        } else if (stock_sales < 50) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbDown size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 유감이지만 이 글이 보인다는건 이미
              관리종목에 들어갔거나 상장폐지 대상이 되었을 가능성이 커요... 혹시 아직 아닌 상태라면 당장 던지고 도망치세요!
            </div>
          );
        }
      } else if (stock_market === 'KOSDAQ') {
        if (stock_sales >= 60) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 관리종목 지정 기준이 30억원이니까...
              적어도 매출액때문에 그런 걸 걱정한 필요는 없겠네요!
            </div>
          );
        } else if (stock_sales >= 40) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbUp color="#3DFE7D" size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 관리종목 지정 기준이 30억원이니까...
              지금은 큰 문제가 보이진 않네요.
            </div>
          );
        } else if (stock_sales >= 30) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbDown size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 위험해요! 간신히 30억을 넘겼다고
              좋아할 게 아니라 억지로 넘겼을 가능성이 매우 높아요. 정말 고수라면 괜찮을 지 모르겠지만, 저라면 당장 던지겠어요.
            </div>
          );
        } else if (stock_sales < 30) {
          toast_main = (
            <div className="mb-2">
              <MdOutlineThumbDown size={20} className="me-2" />
              최근년도({stock_bsns_year}) 매출액이 <strong>{stock_sales.toLocaleString(undefined, {})}억원</strong>이에요. 유감이지만 이 글이 보인다는건 이미
              관리종목에 들어갔거나 상장폐지 대상이 되었을 가능성이 커요... 혹시 아직 아닌 상태라면 당장 던지고 도망치세요!
            </div>
          );
        }
      }
    }
  }
  return toast_main;
};

const FinancialReportIndutySalesToast = ({ corpData }) => {
  const stock_code = corpData && corpData.stock_code;
  const stock_market = corpData && corpData.stock_market;
  const [indutySalesData, setIndutySalesData] = useState();

  const fetchData = async () => {
    /* 업종별 정보 */
    if (stock_code !== undefined) {
      const response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=sales`);
      const induty_stock_code_list = response.data.map((data) => data.stock_code);
      const induty_bsns_year_list = response.data.map((data) => data.bsns_year);
      const induty_sales_list = response.data.map((data) => data.sales);
      setIndutySalesData({
        induty_stock_code_list: induty_stock_code_list,
        induty_bsns_year_list: induty_bsns_year_list,
        induty_sales_list: induty_sales_list,
      });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [stock_code]);

  return (
    <ToastContainer style={{ width: '100%' }}>
      {/* SalesToast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">최근년도 매출액</strong>
          <OverlayTrigger
            key="induty_sales_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_induty_sales">
                {stock_market === 'KOSPI' ? (
                  <strong>
                    KOSPI
                    <br />
                    직전년도 매출액 50억 미만시 관리종목 지정,
                    <br />
                    2년 연속시 상장폐지.
                  </strong>
                ) : stock_market === 'KOSDAQ' ? (
                  <strong>
                    KOSDAQ
                    <br />
                    직전년도 매출액 30억 미만시 관리종목 지정,
                    <br />
                    2년 연속시 상장폐지.
                  </strong>
                ) : (
                  <></>
                )}
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <IndutySalesToast stock_code={stock_code} stock_market={stock_market} indutySalesData={indutySalesData} />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default FinancialReportIndutySalesToast;
