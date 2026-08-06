import { InputText } from 'primereact/inputtext';

export default function AppHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true">
            M
          </span>
          <span className="logo-copy">
            <strong>개발 미션 게시판</strong>
          </span>
        </div>

        <div className="header-actions">
          <div className="search">
            <i className="pi pi-search" aria-hidden="true" />
            <InputText
              type="search"
              placeholder="질문이나 해결 방법 검색"
              aria-label="게시글 검색"
              readOnly
            />
          </div>
          <span className="p-button header-write is-static">
            <i className="pi pi-plus" aria-hidden="true" />
            <span>글쓰기</span>
          </span>
        </div>
      </div>
    </header>
  );
}
