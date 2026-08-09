import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ContentState, PostListSkeleton } from '../components/ContentState.jsx';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`http://localhost:4100/posts?_page=${page}&_per_page=${limit}`)
      .then((res) => {
        const total = res.headers.get('X-Total-Count');
        if (total) setTotalCount(Number(total));
        return res.json();
      })
      .then((data) => {
        setPosts(data.data);
        setTotalCount(data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      });
  }, [page]);
  // console.log('totalcount:', totalCount);

  // 목록 보여주기
  let listContent = (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-item">
          <div className="post-item-body">
            <div className="post-item-head">
              <Link to={`/posts/${post.id}`} className="post-item-title">
                {post.title}
              </Link>
            </div>
            <div className="post-item-meta">
              <span className="post-author">{post.name}</span>
              <span className="sep" />
              <span>8월 12일</span>
              <span className="sep" />
              <span>조회 351</span>
            </div>
          </div>
          <div className="post-item-side">
            <span className="reply-count">
              <i className="pi pi-comment" aria-hidden="true" />
              <span className="sr-only">댓글 </span>0
            </span>
          </div>
        </li>
      ))}
    </ul>
  );

  if (posts.length === 0) {
    listContent = (
      <ContentState
        icon="pi-inbox"
        title="등록된 글이 없습니다"
        description="첫 글을 작성해보세요"
      />
    );
  }

  if (error) {
    listContent = (
      <ContentState
        tone="danger"
        icon="pi-exclamation-triangle"
        title="글을 불러오지 못했습니다"
        description="잠시 후 다시 시도해주세요"
      />
    );
  }

  if (loading) {
    listContent = <PostListSkeleton />;
  }

  return (
    <>
      <section className="page-intro" aria-labelledby="board-title">
        <div>
          <h1 className="page-title" id="board-title">
            질문과 해결 방법
          </h1>
          <p className="page-description">
            미션을 진행하며 생긴 질문과 해결한 방법을 나눠보세요.
          </p>
        </div>
      </section>

      <section className="board-panel" aria-label="게시글 목록">
        <div className="board-toolbar">
          <div className="tabs" role="group" aria-label="게시글 필터">
            <button type="button" className="tab is-active" aria-pressed="true">
              전체
            </button>
            <button type="button" className="tab" aria-pressed="false">
              공지
            </button>
          </div>
          <div className="toolbar-meta">
            <p className="result-count">{posts.length}개의 글</p>
            <label className="sort-control">
              <span className="sr-only">게시글 정렬</span>
              <select defaultValue="최신순">
                <option>최신순</option>
                <option>조회순</option>
              </select>
              <i className="pi pi-chevron-down" aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="card card--list">{listContent}</div>
      </section>
      <div className="pager" aria-label="페이지 이동 UI">
        <span className="is-disabled" aria-hidden="true">
          <i className="pi pi-chevron-left" />
        </span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            className="is-static"
            aria-current="page"
            key={p}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <span className="is-static" aria-label="다음 페이지">
          <i className="pi pi-chevron-right" aria-hidden="true" />
        </span>
      </div>
    </>
  );
}
