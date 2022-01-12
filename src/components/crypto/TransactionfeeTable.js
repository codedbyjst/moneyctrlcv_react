import { Form, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionfeeTable = ({ marketname, setUpdatetime }) => {
  const [datas, setDatas] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'fee',
    direction: 'ASC',
  });
  const [intervalID, setIntervalID] = useState(null);
  const [searchKey, setSearchKey] = useState('%%');

  const requestSort = (key) => {
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
  };
  const sortData = (unsortedData) => {
    let sortableData = [...unsortedData];
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ASC' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ASC' ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  };

  const fetchData = async () => {
    const response = await axios.get(`https://api.moneyctrlcv.com/crypto/transactionfee?market=${marketname}&searchkey=${searchKey}`);
    return response.data;
  };

  const getSortedData = async () => {
    const unsortedData = await fetchData();
    const sortedData = sortData(unsortedData);
    setDatas(sortedData);
    setUpdatetime(new Date().toString());
  };

  /* 자동 업데이트 설정 되기 전 기존 자동 업데이트 프로세스 종료 */
  useEffect(() => {
    return () => {
      clearInterval(intervalID);
    };
  }, [intervalID]);

  /* marketname 또는 sortConfig(정렬설정) 변경시 데이터 갱신 */
  useEffect(() => {
    /* 최초 데이터 갱신 */
    getSortedData();

    /* 자동 업데이트 설정 */
    setIntervalID(setInterval(getSortedData, 1000 * 10));

    // eslint-disable-next-line
  }, [marketname, sortConfig, searchKey]);

  return (
    <>
      <Form className="mb-3">
        <Form.Control
          className="text-center"
          placeholder="검색할 가상화폐명, 또는 코드를 입력해주세요!"
          onChange={(event) => {
            setSearchKey(event.target.value);
          }}
        />
      </Form>
      <Table hover className="border-0">
        <thead className="table-dark" style={{ position: 'sticky', top: '60px' }}>
          <tr>
            <th className="w-25 text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
              코인
            </th>
            <th className="w-25 text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('code')}>
              코드
            </th>
            <th className="d-none d-md-table-cell text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('price')}>
              시세
            </th>
            <th className="d-none d-md-table-cell text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('cost')}>
              수수료
            </th>
            <th className="text-center" style={{ cursor: 'pointer' }} onClick={() => requestSort('fee')}>
              수수료(원화)
            </th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data) => (
            <tr className="text-center" key={data.code}>
              <td>{data.name}</td>
              <td>{data.code}</td>
              <td className="d-none d-md-table-cell text-end">
                {parseFloat(data.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                원
              </td>
              <td className="d-none d-md-table-cell">{`${data.cost} ${data.code}`}</td>
              <td className="text-end fw-bold">
                {parseFloat(data.fee).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                원
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TransactionfeeTable;
