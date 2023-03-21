import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      Not Found Error.(404)
      <p>
        Did you mean <Link to="/crypto/transactionfee/bithumb">https://moneyctrlcv.com/crypto/transactionfee/bithumb</Link>?
      </p>
    </div>
  );
};

export default NotFoundPage;
