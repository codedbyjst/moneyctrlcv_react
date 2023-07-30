import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      Not Found Error.(404)
      <p>
        Did you mean <Link to="/stock/financial_report/kospi/1">코스피 재무제표 분석</Link>?
      </p>
    </div>
  );
};

export default NotFoundPage;
