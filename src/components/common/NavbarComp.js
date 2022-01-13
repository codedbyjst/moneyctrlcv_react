import { Nav, Navbar, NavDropdown, Offcanvas, Container } from 'react-bootstrap';
import { useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

const NavbarComp = () => {
  const [expanded, setExpanded] = useState(false);
  /* 현재 페이지의 경로에 따라 ui를 변화시킵니다. */
  const pathname = useLocation().pathname;
  /* navbar의 각 요소가 색이 칠해져있을지를 정합니다. */
  let colorset = {
    transactionfee: '',
    bithumb: '',
    upbit: '',
    financial_report: '',
    kospi: '',
    kosdaq: '',
  };
  for (let key in colorset) {
    if (pathname.includes(key)) {
      colorset[key] = '#0d6efd';
    }
  }
  /* 현재 페이지의 카테고리(transactionfee 등)에 따라 sub navbar의 구성을 바꿉니다. */
  let category = '';
  if (pathname.includes('transactionfee')) {
    category = 'transactionfee';
  } else if (pathname.includes('financial_report')) {
    category = 'financial_report';
  }

  return (
    <>
      <Navbar className="sticky-top" expand={true} bg="dark" variant="dark" expanded={expanded} style={{ zIndex: '2000' }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            돈복사닷컴
          </Navbar.Brand>
          <div className="d-none d-md-block me-auto">
            <Nav>
              <NavDropdown title="코인 출금수수료" id="dropdown-transactionfee">
                <NavDropdown.Item as={Link} to="/crypto/transactionfee/bithumb" style={{ color: colorset.bithumb }}>
                  Bithumb
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crypto/transactionfee/upbit" style={{ color: colorset.upbit }}>
                  Upbit
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="주식 재무제표 분석" id="dropdown-financialreport">
                <NavDropdown.Item as={Link} to="/stock/financial_report/kospi/1" style={{ color: colorset.kospi }}>
                  KOSPI
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stock/financial_report/kosdaq/1" style={{ color: colorset.kosdaq }}>
                  KOSDAQ
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
          <Navbar.Toggle
            onClick={() => {
              setExpanded(true);
            }}
            className="d-md-none"
            aria-controls="offcanvasNavbar"
            style={{ display: 'block' }}
          />
        </Container>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          style={{ zIndex: '3000', width: '200px' }}
          onHide={() => {
            setExpanded(false);
          }}
        >
          <Offcanvas.Header closeButton style={{ height: 'calc(40px + 1em)' }}>
            <Offcanvas.Title id="offcanvasNavbarLabel">메뉴</Offcanvas.Title>
          </Offcanvas.Header>
          <hr className="m-0" />
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Home
              </Nav.Link>

              <NavDropdown.Divider />

              <NavDropdown title="코인 출금수수료" id="crypto-transactionfee">
                <NavDropdown.Item
                  as={Link}
                  to="/crypto/transactionfee/bithumb"
                  onClick={() => {
                    setExpanded(false);
                  }}
                  style={{ color: colorset.bithumb }}
                >
                  Bithumb
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/crypto/transactionfee/upbit"
                  onClick={() => {
                    setExpanded(false);
                  }}
                  style={{ color: colorset.upbit }}
                >
                  Upbit
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="주식 재무제표 분석" id="stock-financialreport">
                <NavDropdown.Item
                  as={Link}
                  to="/stock/financial_report/kospi/1"
                  onClick={() => {
                    setExpanded(false);
                  }}
                  style={{ color: colorset.kospi }}
                >
                  KOSPI
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/stock/financial_report/kosdaq/1"
                  onClick={() => {
                    setExpanded(false);
                  }}
                  style={{ color: colorset.kosdaq }}
                >
                  KOSDAQ
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>

      {/* Sub Navbar */}
      <Navbar className="sticky-top p-1 shadow-sm" style={{ top: '56px', backgroundColor: '#FFFFFF' }}>
        <Container className="p-0">
          <Nav>
            {category === 'transactionfee' ? (
              <>
                <Nav.Link className="pe-3" as={Link} to="/crypto/transactionfee/bithumb" style={{ color: colorset.bithumb }}>
                  Bithumb
                </Nav.Link>
                <Nav.Link className="pe-3" as={Link} to="/crypto/transactionfee/upbit" style={{ color: colorset.upbit }}>
                  Upbit
                </Nav.Link>
              </>
            ) : category === 'financial_report' ? (
              <>
                <Nav.Link className="pe-3" as={Link} to="/stock/financial_report/kospi/1" style={{ color: colorset.kospi }}>
                  KOSPI
                </Nav.Link>
                <Nav.Link className="pe-3" as={Link} to="/stock/financial_report/kosdaq/1" style={{ color: colorset.kosdaq }}>
                  KOSDAQ
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComp;
