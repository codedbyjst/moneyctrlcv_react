import { ToastContainer, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { MdOutlineThumbUp, MdOutlineThumbDown, MdOutlineThumbsUpDown } from 'react-icons/md';
import { FcDeleteDatabase } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SalesToast = ({ sales_linear_list, sales_linear_score }) => {
  /* 아래 두 변수에 출력할 jsx element를 저장합니다. */
  let toast_main = <div key="SalesToast_main_first"></div>;
  let toast_score = <div key="SalesToast_score"></div>;

  /* sales_linear_list, sales_linear_score가 set된 이후에 실행합니다 */
  if (sales_linear_list !== undefined && sales_linear_score !== undefined) {
    /* Data가 부족해 표시 불가능한 경우엔 예측이 불가능하다고 표시합니다. */
    if (sales_linear_score === 0) {
      toast_main = (
        <div className="d-flex" key="SalesToast_main_first">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* toast_main */
      /* 성장률을 연산합니다.*/
      let exnan_sales_linear_list = sales_linear_list.filter((value) => !isNaN(value));
      const growthrate = parseFloat(
        (Math.pow(exnan_sales_linear_list[exnan_sales_linear_list.length - 1] / exnan_sales_linear_list[0], 1 / (exnan_sales_linear_list.length - 1)) - 1) *
          100,
      ).toFixed(2);
      if (growthrate >= 3) {
        toast_main = (
          <div className="mb-2" key="SalesToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 성장이 기대돼요. 더 덩치가 커지겠어요!
          </div>
        );
      } else if (growthrate >= -1) {
        toast_main = (
          <div className="mb-2" key="SalesToast_main_first">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 매출액에 큰 변화는 없겠네요.
          </div>
        );
      } else if (growthrate < -1) {
        toast_main = (
          <div className="mb-2" key="SalesToast_main_first">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            매년 약 <strong>{growthrate}%</strong>의 하락이 예상돼요. 위험! 업종에서 파이를 뺏기고 있거나, 업종 자체가 사양산업이 되어가고 있을 수 있어요.
            자세한 분석이 필요해요.
          </div>
        );
      }
      /* toast_score */
      if (sales_linear_score < 0.16) {
        toast_score = (
          <div className="mb-2" key="SalesToast_score">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            {'매출액의 '}
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
            가 {sales_linear_score}이에요. 예측한대로 나온다고 보면 될 것 같아요.
          </div>
        );
      } else if (sales_linear_score < 0.2) {
        toast_score = (
          <div className="mb-2" key="SalesToast_score">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            {'매출액의 '}
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
            가 {sales_linear_score}이에요. 어느 정도 변동폭이 있는 경우니까, 미래를 예측하기엔 쉽지 않네요. 위의 예측된 매출액의 신뢰도는 높지 않아요.
          </div>
        );
      } else if (sales_linear_score >= 0.2) {
        toast_score = (
          <div className="mb-2" key="SalesToast_score">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            {'매출액의 '}
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
            가 {sales_linear_score}이에요. 변동폭이 너무 커요! 매출액의 변동률이 큰건 회사가 잘될때랑 안 될때랑 차이가 크다는 거라, 유의가 필요해요. 위의 예측된
            매출액은 현실과 다를 확률이 크니까, 조심하세요.
          </div>
        );
      }
    }
  }
  return [toast_main, toast_score];
};

const OperatingMarginToast = ({
  indutyCompareData,
  operating_profit_margin_list,
  operating_profit_margin_linear_list,
  operating_profit_margin_linear_score,
}) => {
  /* 아래 변수들에 출력할 jsx element를 저장합니다. */
  let toast_main_first = <div key="OperatingMarginToast_main_first"></div>;
  let toast_main_second = <div key="OperatingMarginToast_main_second"></div>;
  let toast_main_third = <div key="OperatingMarginToast_main_third"></div>;
  let toast_score = <div key="OperatingMarginToast_score"></div>;

  /* operating_profit_margin_linear_list, operating_profit_margin_linear_score가 set된 이후에 실행합니다 */
  if (operating_profit_margin_linear_list !== undefined && operating_profit_margin_linear_score !== undefined) {
    /* Data가 부족해 표시 불가능한 경우엔 예측이 불가능하다고 표시합니다. */
    if (operating_profit_margin_linear_score === 0) {
      toast_main_first = (
        <div className="d-flex" key="OperatingMarginToast_main_first">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* array average function */
      const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

      /* taost_main_first */
      let exnan_operating_profit_margin_list = operating_profit_margin_list.filter((value) => !isNaN(value));
      const average_operating_profit_margin = parseFloat(average(exnan_operating_profit_margin_list).toFixed(2));
      if (average_operating_profit_margin >= 15) {
        toast_main_first = (
          <div className="mb-2" key="OperatingMarginToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            평균 영업이익률이 <strong>{`${average_operating_profit_margin}%`}</strong>에요. 이정도면 거의 고객이 신봉하는 수준이에요.
          </div>
        );
      } else if (average_operating_profit_margin >= 10) {
        toast_main_first = (
          <div className="mb-2" key="OperatingMarginToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            평균 영업이익률이 <strong>{`${average_operating_profit_margin}%`}</strong>에요. 상당한 돈이 되는 사업을 하고 있네요!
          </div>
        );
      } else if (average_operating_profit_margin >= 5) {
        toast_main_first = (
          <div className="mb-2" key="OperatingMarginToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            평균 영업이익률이 <strong>{`${average_operating_profit_margin}%`}</strong>에요. 이정도면 훌륭한 사업이죠.
          </div>
        );
      } else if (average_operating_profit_margin >= 0) {
        toast_main_first = (
          <div className="mb-2" key="OperatingMarginToast_main_first">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            평균 영업이익률이 <strong>{`${average_operating_profit_margin}%`}</strong>에요. 음, 솔직히 높진 않은데, 그래도 매출액이 충분하다면 나쁘진 않아요.
          </div>
        );
      } else if (average_operating_profit_margin < 0) {
        toast_main_first = (
          <div className="mb-2" key="OperatingMarginToast_main_first">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            평균 영업이익률이 <strong>{`${average_operating_profit_margin}%`}</strong>에요. 업종 특수로 인한 것일수도 있으니 비교해봐야 알겠지만, 일반적인
            경우엔 심각한 수치에요. 정말 투자할거라면, 신중하게 판단하세요.
          </div>
        );
      }

      /* toast_main_second */
      if (indutyCompareData.induty_operating_profit_margin_list.length === 1) {
        toast_main_second = (
          <div className="mb-2" key="OperatingMarginToast_main_second">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />이 회사 외엔 동일 업종의 회사가 없어요! 매우 특정한 일을 다루거나, 독점이라는 강력한
            무기를 갖고 있다는 의미죠!
          </div>
        );
      } else if (indutyCompareData.induty_operating_profit_margin_list.length > 1) {
        const induty_average_operating_profit_margin = parseFloat(average(indutyCompareData.induty_operating_profit_margin_list.slice(0, 5)).toFixed(2));
        if (
          (induty_average_operating_profit_margin > 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 1.4) ||
          (induty_average_operating_profit_margin < 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 0.6)
        ) {
          toast_main_second = (
            <div className="mb-2" key="OperatingMarginToast_main_second">
              <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
              업종 평균 영업이익률은 <strong>{induty_average_operating_profit_margin}%</strong>에요. 세상에... 어떻게 이렇게 잘 팔았죠?
            </div>
          );
        } else if (
          (induty_average_operating_profit_margin > 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 1.1) ||
          (induty_average_operating_profit_margin < 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 0.9)
        ) {
          toast_main_second = (
            <div className="mb-2" key="OperatingMarginToast_main_second">
              <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
              업종 평균 영업이익률은 <strong>{induty_average_operating_profit_margin}%</strong>에요. 이 집 장사 잘 하네!
            </div>
          );
        } else if (
          (induty_average_operating_profit_margin > 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 0.9) ||
          (induty_average_operating_profit_margin < 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 1.1)
        ) {
          toast_main_second = (
            <div className="mb-2" key="OperatingMarginToast_main_second">
              <MdOutlineThumbsUpDown size={20} className="me-2" />
              업종 평균 영업이익률은 <strong>{induty_average_operating_profit_margin}%</strong>에요. 중간은 가네요.
            </div>
          );
        } else if (
          (induty_average_operating_profit_margin > 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 0.6) ||
          (induty_average_operating_profit_margin < 0 && average_operating_profit_margin > induty_average_operating_profit_margin * 1.4)
        ) {
          toast_main_second = (
            <div className="mb-2" key="OperatingMarginToast_main_second">
              <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
              업종 평균 영업이익률은 <strong>{induty_average_operating_profit_margin}%</strong>에요. 좀 더 분발해야겠어요. 남들 버는만큼은 벌어야죠.
            </div>
          );
        } else if (
          (induty_average_operating_profit_margin > 0 && average_operating_profit_margin < induty_average_operating_profit_margin * 0.6) ||
          (induty_average_operating_profit_margin < 0 && average_operating_profit_margin < induty_average_operating_profit_margin * 1.4)
        ) {
          toast_main_second = (
            <div className="mb-2" key="OperatingMarginToast_main_second">
              <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
              업종 평균 영업이익률은 <strong>{induty_average_operating_profit_margin}%</strong>에요. 위험해요! 영업 활동에 더 집중해야만 해요.
            </div>
          );
        }
      }
      /* toast_main_third */
      const growthrate = parseFloat((operating_profit_margin_linear_list[1] - operating_profit_margin_linear_list[0]).toFixed(2));
      if (growthrate >= 3) {
        toast_main_third = (
          <div className="mb-2" key="OperatingMarginToast_main_third">
            <MdOutlineThumbUp size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 폭발적인 성장이 기대돼네요!
          </div>
        );
      } else if (growthrate >= -1) {
        toast_main_third = (
          <div className="mb-2" key="OperatingMarginToast_main_third">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 큰 변화는 없을 것 같아요.
          </div>
        );
      } else if (growthrate < -1) {
        toast_main_third = (
          <div className="mb-2" key="OperatingMarginToast_main_third">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 어어... 이거 무너지는거 아닌가...?
          </div>
        );
      }

      /* toast_score */
      if (operating_profit_margin_linear_score < 0.16) {
        toast_score = (
          <div className="mb-2" key="OperatingMarginToast_score">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            {'영업이익률의 '}
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
            가 {operating_profit_margin_linear_score}이에요. 예측한대로 나온다고 보면 될 것 같아요.
          </div>
        );
      } else if (operating_profit_margin_linear_score < 0.2) {
        toast_score = (
          <div className="mb-2" key="OperatingMarginToast_score">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            {'영업이익률의 '}
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
            가 {operating_profit_margin_linear_score}이에요. 어느 정도 변동폭이 있는 경우니까, 미래를 예측하기엔 쉽지 않네요. 위의 예측된 영업이익률의 신뢰도는
            높지 않아요.
          </div>
        );
      } else if (operating_profit_margin_linear_score > 0.2) {
        toast_score = (
          <div className="mb-2" key="OperatingMarginToast_score">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            {'영업이익률의 '}
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
            가 {operating_profit_margin_linear_score}이에요. 변동폭이 너무 커요! 영업이익률의 변동률이 큰건 회사가 잘될때랑 안 될때랑 차이가 크다는 거라, 유의가
            필요해요. 위의 예측된 영업이익률은 현실과 다를 확률이 크니까, 조심하세요.
          </div>
        );
      }
    }
  }
  return [toast_main_first, toast_main_second, toast_main_third, toast_score];
};

const NetProfitMarginToast = ({ indutyCompareData, net_profit_margin_list, net_profit_margin_linear_list, net_profit_margin_linear_score }) => {
  /* 아래 변수들에 출력할 jsx element를 저장합니다. */
  let toast_main_first = <div key="NetProfitMarginToast_main_first"></div>;
  let toast_main_second = <div key="NetProfitMarginToast_main_second"></div>;
  let toast_main_third = <div key="NetProfitMarginToast_main_third"></div>;
  let toast_score = <div key="NetProfitMarginToast_score"></div>;

  /* net_profit_margin_linear_list, net_profit_margin_linear_score가 set된 이후에 실행합니다 */
  if (net_profit_margin_linear_list !== undefined && net_profit_margin_linear_score !== undefined) {
    if (net_profit_margin_linear_score === 0) {
      toast_main_first = (
        <div className="d-flex" key="NetProfitMarginToast_main_first">
          <FcDeleteDatabase size={20} className="me-2" />
          관련 데이터가 부족하여 예측하기 어렵네요...
        </div>
      );
    } else {
      /* array average function */
      const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

      /* taost_main_first */
      let exnan_net_profit_margin_list = net_profit_margin_list.filter((value) => !isNaN(value));
      const average_net_profit_margin = parseFloat(average(exnan_net_profit_margin_list).toFixed(2));
      if (average_net_profit_margin >= 10) {
        toast_main_first = (
          <div className="mb-2" key="NetProfitMarginToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            평균 순이익률이 <strong>{`${average_net_profit_margin}%`}</strong>에요. 엄청나네요... 거의 날강도 수준인데요?
          </div>
        );
      } else if (average_net_profit_margin >= 3) {
        toast_main_first = (
          <div className="mb-2" key="NetProfitMarginToast_main_first">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            평균 순이익률이 <strong>{`${average_net_profit_margin}%`}</strong>에요. 좋아요! 판매한만큼은 버는것 같네요.
          </div>
        );
      } else if (average_net_profit_margin >= 0) {
        toast_main_first = (
          <div className="mb-2" key="NetProfitMarginToast_main_first">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            평균 순이익률이 <strong>{`${average_net_profit_margin}%`}</strong>에요. 정말 많이 판매하는게 아니라면, 사실 좋다고 보긴 어려운 정도네요.
          </div>
        );
      } else if (average_net_profit_margin < 0) {
        toast_main_first = (
          <div className="mb-2" key="NetProfitMarginToast_main_first">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            평균 순이익률이 <strong>{`${average_net_profit_margin}%`}</strong>에요. 오, 맙소사... 회사 돈이 갈리고 있어요!
          </div>
        );
      }

      /* toast_main_second */
      if (indutyCompareData.induty_net_profit_margin_list.length === 1) {
        toast_main_second = (
          <div className="mb-2" key="NetProfitMarginToast_main_second">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />이 회사 외엔 동일 업종의 회사가 없어요! 이 기업이 업계 그 자체네요.
          </div>
        );
      } else if (indutyCompareData.induty_net_profit_margin_list.length > 1) {
        const induty_average_net_profit_margin = parseFloat(average(indutyCompareData.induty_net_profit_margin_list.slice(0, 5)).toFixed(2));
        if (
          (induty_average_net_profit_margin > 0 && average_net_profit_margin > induty_average_net_profit_margin * 1.4) ||
          (induty_average_net_profit_margin < 0 && average_net_profit_margin > induty_average_net_profit_margin * 0.6)
        ) {
          toast_main_second = (
            <div className="mb-2" key="NetProfitMarginToast_main_second">
              <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
              업종 평균 순이익률은 <strong>{induty_average_net_profit_margin}%</strong>에요. 한 몫 챙기는 능력 하나는 끝내주네요.
            </div>
          );
        } else if (
          (induty_average_net_profit_margin > 0 && average_net_profit_margin > induty_average_net_profit_margin * 1.1) ||
          (induty_average_net_profit_margin < 0 && average_net_profit_margin > induty_average_net_profit_margin * 0.9)
        ) {
          toast_main_second = (
            <div className="mb-2" key="NetProfitMarginToast_main_second">
              <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
              업종 평균 순이익률은 <strong>{induty_average_net_profit_margin}%</strong>에요. 회사 재정에 큰 걱정은 없겠어요.
            </div>
          );
        } else if (
          (induty_average_net_profit_margin > 0 && average_net_profit_margin > induty_average_net_profit_margin * 0.9) ||
          (induty_average_net_profit_margin < 0 && average_net_profit_margin > induty_average_net_profit_margin * 1.1)
        ) {
          toast_main_second = (
            <div className="mb-2" key="NetProfitMarginToast_main_second">
              <MdOutlineThumbsUpDown size={20} className="me-2" />
              업종 평균 순이익률은 <strong>{induty_average_net_profit_margin}%</strong>에요. 남들 버는만큼은 버네요.
            </div>
          );
        } else if (
          (induty_average_net_profit_margin > 0 && average_net_profit_margin > induty_average_net_profit_margin * 0.6) ||
          (induty_average_net_profit_margin < 0 && average_net_profit_margin > induty_average_net_profit_margin * 1.4)
        ) {
          toast_main_second = (
            <div className="mb-2" key="NetProfitMarginToast_main_second">
              <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
              업종 평균 순이익률은 <strong>{induty_average_net_profit_margin}%</strong>에요. 회사라면... 돈을 좀 더 벌어야 하지 않을까요?
            </div>
          );
        } else if (
          (induty_average_net_profit_margin > 0 && average_net_profit_margin < induty_average_net_profit_margin * 0.6) ||
          (induty_average_net_profit_margin < 0 && average_net_profit_margin < induty_average_net_profit_margin * 1.4)
        ) {
          toast_main_second = (
            <div className="mb-2" key="NetProfitMarginToast_main_second">
              <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
              업종 평균 순이익률은 <strong>{induty_average_net_profit_margin}%</strong>에요. 안 좋아요! 경영능력을 확인해 볼 필요성이 있어요.
            </div>
          );
        }
      }

      /* toast_main_third */
      const growthrate = parseFloat((net_profit_margin_linear_list[1] - net_profit_margin_linear_list[0]).toFixed(2));
      if (growthrate >= 3) {
        toast_main_third = (
          <div className="mb-2" key="NetProfitMarginToast_main_third">
            <MdOutlineThumbUp size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 내년엔 더 잘 벌수 있겠어요!
          </div>
        );
      } else if (growthrate >= -1) {
        toast_main_third = (
          <div className="mb-2" key="NetProfitMarginToast_main_third">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 최근 번 것처럼 벌 것 같아요.
          </div>
        );
      } else if (growthrate < -1) {
        toast_main_third = (
          <div className="mb-2" key="NetProfitMarginToast_main_third">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            매년 약 <strong>{`${growthrate}%`}</strong>의 변동이 예상돼요. 성장하지 않는 기업은 도태되기 마련이죠...
          </div>
        );
      }

      /* toast_score */
      if (net_profit_margin_linear_score < 0.16) {
        toast_score = (
          <div className="mb-2" key="NetProfitMarginToast_score">
            <MdOutlineThumbUp color="#4FB443" size={20} className="me-2" />
            {'순이익률의 '}
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
            가 {net_profit_margin_linear_score}이에요. 예측한대로 나온다고 보면 될 것 같아요.
          </div>
        );
      } else if (net_profit_margin_linear_score < 0.2) {
        toast_score = (
          <div className="mb-2" key="NetProfitMarginToast_score">
            <MdOutlineThumbsUpDown size={20} className="me-2" />
            {'순이익률의 '}
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
            가 {net_profit_margin_linear_score}이에요. 어느 정도 변동폭이 있는 경우니까, 미래를 예측하기엔 쉽지 않네요. 위의 예측된 순이익률의 신뢰도는 높지
            않아요.
          </div>
        );
      } else if (net_profit_margin_linear_score > 0.2) {
        toast_score = (
          <div className="mb-2" key="NetProfitMarginToast_score">
            <MdOutlineThumbDown color="#DE061A" size={20} className="me-2" />
            {'순이익률의 '}
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
            가 {net_profit_margin_linear_score}이에요. 변동폭이 너무 커요! 순이익률의 변동률이 큰건 회사가 잘될때랑 안 될때랑 차이가 크다는 거라, 유의가
            필요해요. 위의 예측된 순이익률은 현실과 다를 확률이 크니까, 조심하세요.
          </div>
        );
      }
    }
  }
  return [toast_main_first, toast_main_second, toast_main_third, toast_score];
};

const FinancialReportSalesToast = ({ salesData }) => {
  const stock_code = salesData && salesData.stock_code;

  const [indutyCompareData, setIndutyCompareData] = useState({
    induty_operating_profit_margin_list: [],
    induty_net_profit_margin_list: [],
  });
  const fetchData = async () => {
    if (stock_code !== undefined) {
      let response;
      let induty_operating_profit_margin_list = [];
      let induty_net_profit_margin_list = [];
      response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=operating_profit_margin`);
      if (response.data.length > 0) {
        induty_operating_profit_margin_list = response.data.map((data) => data.operating_profit_margin);
        induty_operating_profit_margin_list = induty_operating_profit_margin_list.filter((x) => x);
        induty_operating_profit_margin_list = induty_operating_profit_margin_list.map((data) => parseFloat(data.toFixed(2)));
      }
      response = await axios.get(`https://api.moneyctrlcv.com/stock/induty_compare?stock_code=${stock_code}&key=net_profit_margin`);
      if (response.data.length > 0) {
        induty_net_profit_margin_list = response.data.map((data) => data.net_profit_margin);
        induty_net_profit_margin_list = induty_net_profit_margin_list.filter((x) => x);
        induty_net_profit_margin_list = induty_net_profit_margin_list.map((data) => parseFloat(data.toFixed(2)));
      }
      setIndutyCompareData({
        induty_operating_profit_margin_list: induty_operating_profit_margin_list,
        induty_net_profit_margin_list: induty_net_profit_margin_list,
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
          <strong className="me-auto">매출액</strong>
          <OverlayTrigger
            key="sales_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_sales">
                상품의 매출이나 서비스의 제공에 대한 수입금액을 의미해요.
                <br />이 회사가 사회에 어느 정도의 가치를 제공했는지를 화폐단위로 표현하는 최상위 지표에요!
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <SalesToast sales_linear_list={salesData && salesData.sales_linear_list} sales_linear_score={salesData && salesData.sales_linear_score} />
        </Toast.Body>
      </Toast>

      {/* OperatingMarginToast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">영업이익률</strong>
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
          <OperatingMarginToast
            indutyCompareData={indutyCompareData}
            operating_profit_margin_list={salesData && salesData.operating_profit_margin_list}
            operating_profit_margin_linear_list={salesData && salesData.operating_profit_margin_linear_list}
            operating_profit_margin_linear_score={salesData && salesData.operating_profit_margin_linear_score}
          />
        </Toast.Body>
      </Toast>

      {/* NetProfitMarginToast */}
      <Toast style={{ margin: '0 auto', width: '90%' }}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">순이익률</strong>
          <OverlayTrigger
            key="operating_margin_detail"
            placement="top"
            overlay={
              <Tooltip id="tooltip_operating_margin">
                매출액에 대한 (당기)순이익 비율을 의미해요.
                <br />
                매출액에서 모든 비용과 세금을 빼고 소유주에게 남은 부분을 의미하고, 회사의 경영 능력을 나타내는 지표에요!
              </Tooltip>
            }
          >
            <span>
              <BsFillQuestionCircleFill size={20} />
            </span>
          </OverlayTrigger>
        </Toast.Header>
        <Toast.Body>
          <NetProfitMarginToast
            indutyCompareData={indutyCompareData}
            net_profit_margin_list={salesData && salesData.net_profit_margin_list}
            net_profit_margin_linear_list={salesData && salesData.net_profit_margin_linear_list}
            net_profit_margin_linear_score={salesData && salesData.net_profit_margin_linear_score}
          />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
export default FinancialReportSalesToast;
