import { InputText } from 'primereact/inputtext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function AppHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q');
    const nextParams = new URLSearchParams();
    if (query) {
      nextParams.set('q', query);
    }
    navigate(nextParams.toString() ? `/?${nextParams.toString()}` : '/');
  }

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
          <form className="search" role="search" onSubmit={handleSearchSubmit}>
            <i className="pi pi-search" aria-hidden="true" />
            <InputText
              name="q"
              type="search"
              placeholder="질문이나 해결 방법 검색"
              aria-label="게시글 검색"
              defaultValue={searchParams.get('q') ?? ''}
            />
          </form>
          <Link to="/PostForm" className="p-button header-write">
            <i className="pi pi-plus" aria-hidden="true" />
            <span>글쓰기</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
