import { Container } from 'react-bootstrap';

const MarketLogoComp = ({ marketname }) => {
  let sitelink = '';
  let logotext = '';
  let logocolor = '#000000';
  /*아래의 marketname은 Bithumb과 같이 첫 문자가 대문자입니다.*/
  if (marketname === 'Bithumb') {
    sitelink = 'https://www.bithumb.com';
    logotext = 'bithumb';
    logocolor = '#FF8200';
  } else if (marketname === 'Upbit') {
    sitelink = 'https://upbit.com';
    logotext = 'UPbit';
    logocolor = '#093687';
  } else {
    return <div></div>;
  }
  return (
    <Container>
      <div className="d-flex align-items-center p-0 my-3 rounded shadow-sm justify-content-center">
        <a href={sitelink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          {/* <img className="img-fluid" src={`/img/crypto/${marketname}_icon.png`} alt={`${marketname} logo`} style={{ maxHeight: '150px' }} /> */}
          <div className="mt-0" style={{ color: logocolor, fontFamily: 'Roboto', fontSize: '4em' }}>
            {logotext}
          </div>
        </a>
      </div>
    </Container>
  );
};

export default MarketLogoComp;
