import { Nav, Navbar, NavDropdown, Offcanvas, Container } from 'react-bootstrap';
import { useState } from 'react';

import { Link } from 'react-router-dom';

const NavbarComp = () => {
  let [expanded, setExpanded] = useState(false);
  return (
    <>
      <Navbar className="sticky-top" expand={true} bg="dark" variant="dark" expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            돈복사닷컴
          </Navbar.Brand>
          <div className="d-none d-md-block me-auto">
            <Nav>
              <NavDropdown title="코인 출금수수료" id="dropdown-transactionfee">
                <NavDropdown.Item as={Link} to="/crypto/transactionfee/bithumb">
                  Bithumb
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crypto/transactionfee/upbit">
                  Upbit
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="주식 재무제표 분석" id="dropdown-financialreport">
                <NavDropdown.Item as={Link} to="/stock/financial_report/kospi/1">
                  KOSPI
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stock/financial_report/kosdaq/1">
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

        <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="end" style={{ width: '200px' }}>
          <Offcanvas.Header
            closeButton
            style={{ height: 'calc(40px + 1em)' }}
            onHide={() => {
              setExpanded(false);
            }}
          >
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
                >
                  Bithumb
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/crypto/transactionfee/upbit"
                  onClick={() => {
                    setExpanded(false);
                  }}
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
                >
                  KOSPI
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/stock/financial_report/kosdaq/1"
                  onClick={() => {
                    setExpanded(false);
                  }}
                >
                  KOSDAQ
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>
    </>
  );
};

export default NavbarComp;
