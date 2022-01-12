import { Container } from 'react-bootstrap';

const MarketLogoComp = ({ marketname }) => {
  let sitelink = '';
  /*아래의 marketname은 Bithumb과 같이 첫 문자가 대문자입니다.*/
  if (marketname === 'Bithumb') {
    sitelink = 'https://www.bithumb.com';
  } else if (marketname === 'Upbit') {
    sitelink = 'https://upbit.com';
  } else {
    return <div></div>;
  }
  return (
    <Container>
      <div className="d-flex align-items-center p-3 my-3 rounded shadow-sm justify-content-center">
        <a href={sitelink} target="_blank" rel="noreferrer">
          <img
            className="img-fluid"
            src={`https://moneyctrlcv.com/static/transactionfee/img/${marketname}_icon.png`}
            alt={`${marketname} logo`}
            style={{ maxHeight: '150px' }}
          />
        </a>
      </div>
    </Container>
  );
};

export default MarketLogoComp;
