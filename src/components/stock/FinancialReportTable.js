import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';

const FinancialReportTable = ({ marketname, pagenum }) => {
  const [datas, setDatas] = useState([]);
  const [pageConfig, setPageConfig] = useState({
    curpage: pagenum - 1,
    perpage: 50,
  });
  const [totalPage, setTotalPage] = useState(100);
  const [sortConfig, setSortConfig] = useState({
    key: 'total_assets',
    direction: 'DESC',
  });
  const [searchKey, setSearchKey] = useState('%%');
  /* react-router-dom의 link handling 객체입니다. */
  /* pagination에서 클릭시 이벤트를 처리합니다. */
  const navigate = useNavigate();

  const requestSort = (key) => {
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key: key, direction: direction });
  };

  const fetchData = async () => {
    /* LIST DATA */
    let response = await axios.get(
      `https://api.moneyctrlcv.com/stock/financial_state/list?stock_market=${marketname}&curpage=${pageConfig.curpage}&perpage=${pageConfig.perpage}&sortkey=${
        sortConfig.key
      }&sortdir=${sortConfig.direction.toLowerCase()}&searchkey=${searchKey}`,
    );
    setDatas(response.data);

    /* PAGINATION DATA */
    response = await axios.get(`https://api.moneyctrlcv.com/stock/financial_state/list/cnt?stock_market=${marketname}&searchkey=${searchKey}`);
    setTotalPage(Math.ceil(response.data.COUNT / pageConfig.perpage));
  };

  useEffect(() => {
    /* 데이터 갱신 */
    fetchData();
    // console.log(`updating... marketname:${marketname} pagenum:${pagenum}`);
    // eslint-disable-next-line
  }, [marketname, pagenum, pageConfig, sortConfig, searchKey]);

  /* marketname 변동시 pagination, sort초기화 */
  useEffect(() => {
    setPageConfig({ curpage: 0, perpage: 50 });
    setSortConfig({ key: 'total_assets', direction: 'DESC' });
  }, [marketname]);
  /* pagenum 변동시 pagniaton component에도 전달 */
  useEffect(() => {
    setPageConfig({ ...pageConfig, curpage: pagenum - 1 });
    // eslint-disable-next-line
  }, [pagenum]);

  return (
    <>
      <Form className="mb-3">
        <Form.Control
          className="text-center"
          placeholder="검색할 법인(회사)명, 또는 코드번호를 입력해주세요!"
          onChange={(event) => {
            setSearchKey(event.target.value);
            setPageConfig({ ...pageConfig, curpage: 0 });
          }}
        />
      </Form>
      <Table hover className="border-0">
        <thead className="table-dark" style={{ position: 'sticky', top: '60px' }}>
          <tr>
            <th className="w-50 text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('stock_name')}>
              종목
            </th>
            <th className="w-25 text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('stock_code')}>
              코드
            </th>
            <th className="d-none d-md-table-cell text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('total_assets')}>
              자산총계
            </th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data) => (
            <tr className="text-center" key={data.stock_code}>
              <td>
                <Link to={`/stock/financial_report/${data.stock_code}`}>{data.stock_name}</Link>
              </td>
              <td>{data.stock_code}</td>
              <td className="d-none d-md-table-cell text-end">{parseFloat(data.total_assets).toLocaleString(undefined, {})}원</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <ReactPaginate
          breakLabel="..."
          previousLabel="<"
          nextLabel=">"
          onPageChange={(event) => {
            setPageConfig({
              ...pageConfig,
              curpage: event.selected,
            });
            navigate(`/stock/financial_report/${marketname}/${event.selected + 1}`);
          }}
          forcePage={pageConfig.curpage}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPage}
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </>
  );
};

export default FinancialReportTable;
