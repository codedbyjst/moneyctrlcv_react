import { useParams } from 'react-router';
import { Container, Alert } from 'react-bootstrap';
import NavbarComp from '../common/NavbarComp';
import MarketLogoComp from './MarketLogoComp';
import NoticeAlert from '../common/NoticeAlert';
import TransactionfeeTable from './TransactionfeeTable';
import { useState } from 'react';

const Transactionfee = () => {
  let marketname = useParams().marketname;
  marketname = marketname[0].toUpperCase() + marketname.substring(1);

  const [updatetime, setUpdatetime] = useState('Updating...');
  return (
    <div>
      {/*Navbar 컴포넌트를 세팅합니다.*/}
      <NavbarComp />

      {/*Logo 컴포넌트를 세팅합니다. */}
      <MarketLogoComp marketname={marketname} />

      {/*NoticeAlert 컴포넌트를 세팅합니다. */}
      <NoticeAlert />

      {/*Main*/}
      <Container>
        <h1 className="mt-2 text-center">{marketname} 출금 수수료</h1>

        <Alert className="mt-2 mb-3 text-center" variant="primary">
          아래의 시세는 {marketname}의 최근 거래가
          <br />
          (UPDATE : {updatetime})
          <br />를 바탕으로 합니다!
        </Alert>

        {/*Transactionfee 테이블을 가져옵니다.*/}
        <TransactionfeeTable
          marketname={marketname}
          setUpdatetime={setUpdatetime}
        />
      </Container>
    </div>
  );
};

export default Transactionfee;
