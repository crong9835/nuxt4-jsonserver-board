import { useEffect, useState } from 'react';
import { ContentState, PostListSkeleton } from '../components/ContentState.jsx';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');

    fetch('http://localhost:4100/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('failed to fetch posts');
        }
        return res.json();
      })
      .then((data) => {
        if (ignore) {
          return;
        }
        setPosts(data);
        setStatus('success');
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

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
            <p className="result-count">
              {posts.length}
              개의 글
            </p>
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

        <div className="card card--list">
          {status === 'loading' && <PostListSkeleton />}

          {status === 'error' && (
            <ContentState
              icon="pi-exclamation-triangle"
              title="게시글을 불러오지 못했어요"
              description="잠시 후 다시 시도해 주세요."
              tone="danger"
            />
          )}

          {status === 'success' && posts.length === 0 && (
            <ContentState
              icon="pi-inbox"
              title="아직 게시글이 없어요"
              description="가장 먼저 질문이나 해결 방법을 남겨보세요."
            />
          )}

          {status === 'success' && posts.length > 0 && (
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <div className="post-item-body">
                    <div className="post-item-head">
                      <h2 className="post-item-title">{post.title}</h2>
                    </div>
                    <div className="post-item-meta">
                      <span className="post-author">작성자</span>
                      <span className="sep" />
                      <span>{post.content}</span>
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
          )}
        </div>
      </section>

      <div className="pager" aria-label="페이지 이동 UI">
        <span className="is-disabled" aria-hidden="true">
          <i className="pi pi-chevron-left" />
        </span>
        <span className="is-static" aria-current="page">
          1
        </span>
        <span className="is-static">2</span>
        <span className="is-static">3</span>
        <span className="is-static" aria-label="다음 페이지">
          <i className="pi pi-chevron-right" aria-hidden="true" />
        </span>
      </div>
    </>
  );
}
