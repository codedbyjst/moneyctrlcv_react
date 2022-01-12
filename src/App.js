import { Routes, Route, Navigate } from 'react-router';
import TransactionfeeMarket from './components/crypto/TransactionfeeMarket';
import FinancialReportMarket from './components/stock/FinancialReportMarket';
import FinancialReportStock from './components/stock/FinancialReportStock';
import NotFoundPage from './components/common/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        {/* 404 Error(PageNotFound) 에러 핸들링 */}
        <Route path="*" element={<NotFoundPage />} />

        {/* '/'경로 가상화폐 출금수수료로 Route */}
        <Route path="/" element={<Navigate to="/crypto/transactionfee/bithumb" />} />

        {/* 가상화폐 출금수수료 */}
        <Route path="/crypto/transactionfee/:marketname" element={<TransactionfeeMarket />} />

        {/* 재무제표 분석(리스트) */}
        <Route path="/stock/financial_report/kospi/:pagenum" element={<FinancialReportMarket marketname="kospi" />} />
        <Route path="/stock/financial_report/kosdaq/:pagenum" element={<FinancialReportMarket marketname="kosdaq" />} />
        {/* 재무제표 분석(개별 페이지) */}
        <Route path="/stock/financial_report/:stock_code" element={<FinancialReportStock />} />
      </Routes>
    </>
  );
}

export default App;
