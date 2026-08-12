import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function AppHeader() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setKeyword(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (keyword) {
      navigate(`/?q=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            M
          </span>
          <span className="logo-copy">
            <strong>개발 미션 게시판</strong>
          </span>
        </Link>

        <div className="header-actions">
          <form className="search" onSubmit={handleSearch}>
            <i className="pi pi-search" aria-hidden="true" />
            <InputText
              type="search"
              placeholder="질문이나 해결 방법 검색"
              aria-label="게시글 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </form>
          <Link to="/write" className="p-button header-write">
            <i className="pi pi-plus" aria-hidden="true" />
            <span>글쓰기</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
