import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ContentState, PostListSkeleton } from '../components/ContentState.jsx';
import { API_BASE } from '../api.js';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const limit = 10;

  const keyword = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || 1);
  const notice = searchParams.get('notice') || 'all';
  const sort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`${API_BASE}/posts`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('로딩 실패', err);
        setError(true);
        setLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`${API_BASE}/comments`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('로딩 실패', err);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const commentCountByPostId = {};
  comments.forEach((comment) => {
    if (commentCountByPostId[comment.postId]) {
      commentCountByPostId[comment.postId] = commentCountByPostId[comment.postId] + 1;
    } else {
      commentCountByPostId[comment.postId] = 1;
    }
  });

  const getCommentCount = (postId) => {
    return commentCountByPostId[postId] || 0;
  };

  const searched = posts.filter((post) => {
    const word = keyword.toLowerCase();
    const title = (post.title || '').toLowerCase();
    const contents = (post.contents || '').toLowerCase();
    return title.includes(word) || contents.includes(word);
  });

  const filtered = searched.filter((post) => {
    if (notice === 'notice') {
      return post.isNotice === true;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'views') {
      return b.views - a.views;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalCount = sorted.length;
  const totalPages = Math.ceil(totalCount / limit);
  const pagePosts = sorted.slice((page - 1) * limit, page * limit);

  const pageWindow = 5;
  let startPage = page - 2;
  if (startPage < 1) {
    startPage = 1;
  }
  let endPage = startPage + pageWindow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = endPage - pageWindow + 1;
  }
  if (startPage < 1) {
    startPage = 1;
  }
  const pageNumbers = [];
  for (let p = startPage; p <= endPage; p++) {
    pageNumbers.push(p);
  }

  const formatDate = (value) => {
    const date = new Date(value);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const goPage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', nextPage);
    setSearchParams(nextParams);
  };

  const goNotice = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('notice', value);
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const goSort = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', value);
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  // 목록 보여주기
  let listContent = (
    <ul className="post-list">
      {pagePosts.map((post) => (
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
              <span>{formatDate(post.createdAt)}</span>
              <span className="sep" />
              <span>조회 {post.views}</span>
            </div>
          </div>
          <div className="post-item-side">
            <span className="reply-count">
              <i className="pi pi-comment" aria-hidden="true" />
              <span className="sr-only">댓글 </span>
              {getCommentCount(post.id)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );

  if (sorted.length === 0) {
    if (keyword) {
      listContent = (
        <ContentState
          icon="pi-search"
          title="검색 결과가 없습니다"
          description={`'${keyword}'와 일치하는 글이 없습니다`}
        />
      );
    } else {
      listContent = (
        <ContentState
          icon="pi-inbox"
          title="등록된 글이 없습니다"
          description="첫 글을 작성해보세요"
        />
      );
    }
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
            <button
              type="button"
              className={notice === 'all' ? 'tab is-active' : 'tab'}
              aria-pressed={notice === 'all'}
              onClick={() => goNotice('all')}
            >
              전체
            </button>
            <button
              type="button"
              className={notice === 'notice' ? 'tab is-active' : 'tab'}
              aria-pressed={notice === 'notice'}
              onClick={() => goNotice('notice')}
            >
              공지
            </button>
          </div>
          <div className="toolbar-meta">
            <p className="result-count">{totalCount}개의 글</p>
            <label className="sort-control">
              <span className="sr-only">게시글 정렬</span>
              <select
                value={sort}
                onChange={(event) => goSort(event.target.value)}
              >
                <option value="latest">최신순</option>
                <option value="views">조회순</option>
              </select>
              <i className="pi pi-chevron-down" aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="card card--list">{listContent}</div>
      </section>
      <div className="pager" aria-label="페이지 이동 UI">
        <button
          type="button"
          className={page <= 1 ? 'is-disabled' : ''}
          disabled={page <= 1}
          aria-label="이전 페이지"
          onClick={() => goPage(page - 1)}
        >
          <i className="pi pi-chevron-left" aria-hidden="true" />
        </button>

        {pageNumbers.map((p) => (
          <button
            type="button"
            key={p}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => goPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className={page >= totalPages ? 'is-disabled' : ''}
          disabled={page >= totalPages}
          aria-label="다음 페이지"
          onClick={() => goPage(page + 1)}
        >
          <i className="pi pi-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
