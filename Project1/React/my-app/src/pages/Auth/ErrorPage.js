import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🚫 잘못된 접근입니다.</h1>
      <p>해당 페이지에 접근할 권한이 없습니다.</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', fontSize: '16px' }}>
        홈으로 이동
      </button>
    </div>
  );
};

export default ErrorPage;
