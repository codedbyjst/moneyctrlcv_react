import { Container } from 'react-bootstrap';

const LogoComp = () => {
  return (
    <Container>
      <div className="d-flex align-items-center p-3 my-3 rounded shadow-sm justify-content-center">
        <div
          style={{
            fontFamily: 'serif',
            fontSize: '2.5rem',
            maxHeight: '100px',
          }}
        >
          <i style={{ color: '#043927' }}>Money </i>ctrl
          <i style={{ color: '#111E6C' }}>cv</i>
        </div>
      </div>
    </Container>
  );
};

export default LogoComp;
