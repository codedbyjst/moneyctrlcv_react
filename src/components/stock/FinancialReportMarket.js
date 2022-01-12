import NavbarComp from '../common/NavbarComp';
import LogoComp from '../common/LogoComp';
import NoticeAlert from '../common/NoticeAlert';
import { Container, Alert } from 'react-bootstrap';
import FinancialReportTable from './FinancialReportTable';
import { useParams } from 'react-router-dom';

const FinancialReportMarket = ({ marketname }) => {
  let marketname_kor = '';
  if (marketname === 'kospi') {
    marketname_kor = '코스피';
  } else if (marketname === 'kosdaq') {
    marketname_kor = '코스닥';
  }
  const pagenum = useParams().pagenum;
  return (
    <div>
      {/*Navbar 컴포넌트를 세팅합니다.*/}
      <NavbarComp />

      {/*Logo 컴포넌트를 세팅합니다. */}
      <LogoComp />

      {/*NoticeAlert 컴포넌트를 세팅합니다. */}
      <NoticeAlert />

      {/*MAIN*/}
      <Container>
        <h1 className="mt-2 text-center">{marketname_kor} 재무제표 분석</h1>
        <Alert className="mt-2 mb-3 text-center" variant="primary">
          각 기업의 재무제표 분석을 제공합니다.
          <br />
          🌟각 회사의 이름을 클릭해주세요!🌟
        </Alert>
        <FinancialReportTable marketname={marketname} pagenum={pagenum} />
      </Container>
    </div>
  );
};

export default FinancialReportMarket;
