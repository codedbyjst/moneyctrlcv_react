import { Alert } from 'react-bootstrap';

const NoticeAlert = () => {
  return (
    <div className="text-center">
      <Alert className="mb-2" variant="success">
        블로그 이전하였습니다!
        <br />
        <a href="https://codedbyjst.tistory.com/" target="_blank" rel="noreferrer">
          https://codedbyjst.tistory.com/
        </a>
        <br />
        가장 최근 패치일 : 2023.12.06 02:00
      </Alert>
    </div>
  );
};

export default NoticeAlert;
