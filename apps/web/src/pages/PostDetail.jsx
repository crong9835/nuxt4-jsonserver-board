import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';

import { ContentState, ArticleSkeleton } from '../components/ContentState.jsx';
import { API_BASE } from '../api.js';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});

  const [comments, setComments] = useState({
    name: '',
    contents: '',
  });
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(false);
  const deleteBtnRef = useRef(null);
  // 게시글 가져오기
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchPost() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/posts/${id}`, {
          signal: abortController.signal,
        });
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setPost(data);
        setNotFound(false);
        setError(false);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('불러오기 실패', err);
        setError(true);
        setLoading(false);
      }
    }

    fetchPost();

    return () => {
      abortController.abort();
    };
  }, [id]);
  // 댓글가져오기
  useEffect(() => {
    const abortController = new AbortController();
    setCommentsLoading(true);
    setCommentsError(false);

    fetch(`${API_BASE}/comments?postId=${id}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setCommentsList(data);
        setCommentsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('댓글 로딩 실패:', err);
        setCommentsError(true);
        setCommentsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [id]);

  // 게시글 삭제
  const deleteBtn = () => {
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    deleteBtnRef.current?.focus();
  };

  const confirmDelete = () => {
    setDeleting(true);
    fetch(`${API_BASE}/posts/${id}?_dependent=comments`, {
      method: 'DELETE',
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          alert('삭제완료');
          navigate('/');
        } else {
          alert('삭제실패');
          setDeleting(false);
        }
      })
      .catch((err) => {
        console.error('삭제 실패', err);
        alert('삭제실패');
        setDeleting(false);
      });
  };

  // 댓글쓰기
  const { name, contents } = comments;

  const onChange = (event) => {
    const { value, name } = event.target;
    setComments({
      ...comments,
      [name]: value,
    });
  };

  const saveComments = async () => {
    if (!contents.trim()) {
      alert('칸을 채워주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...comments,
          postId: id,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setCommentsList([...commentsList, newComment]);
        setComments({ name: '', contents: '' });
        alert('등록되었습니다.');
      } else {
        alert('등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
    setSubmitting(false);
  };

  const formatDateTime = (value) => {
    const date = new Date(value);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${hour}:${minute}`;
  };

  const formatCommentDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hour}:${minute}`;
  };

  // 게시글 보여주기
  let articleContent = (
    <>
      <div>
        <h1 className="page-title article-title">{post.title}</h1>

        <div className="post-head">
          <div className="author">
            <span className="author-face" aria-hidden="true">
              작
            </span>
            <div>
              <div className="author-name">{post.name}</div>
              <div className="author-date">{formatDateTime(post.createdAt)}</div>
            </div>
          </div>
          <div className="stat-row">
            <span aria-label={`조회 ${post.views}회`}>
              <i className="pi pi-eye" aria-hidden="true" />
              {post.views}
            </span>
            <span aria-label={`댓글 ${commentsList.length}개`}>
              <i className="pi pi-comment" aria-hidden="true" />
              {commentsList.length}
            </span>
          </div>
        </div>

        <hr className="rule" />

        <div className="post-body">{post.contents}</div>
      </div>
      <div className="post-actions">
        <Button
          ref={deleteBtnRef}
          onClick={deleteBtn}
          type="button"
          label="글 삭제"
          severity="danger"
          icon="pi pi-trash"
          className="is-static"
        />
        <Link to={`/posts/${id}/edit`} className="p-button p-button-secondary">
          <i className="pi pi-pencil" aria-hidden="true" />
          <span>글 수정</span>
        </Link>
      </div>
    </>
  );

  if (notFound) {
    articleContent = (
      <ContentState
        icon="pi-search"
        title="게시글을 찾을 수 없습니다"
        description="삭제되었거나 잘못된 주소입니다"
      />
    );
  }

  if (error) {
    articleContent = (
      <ContentState
        tone="danger"
        icon="pi-exclamation-triangle"
        title="글을 불러오지 못했습니다"
        description="잠시 후 다시 시도해주세요"
      />
    );
  }

  if (loading) {
    articleContent = <ArticleSkeleton />;
  }

  // 댓글보여주기
  let commentContent = commentsList.map((comment) => (
    <ul key={comment.id} className="comment-list">
      <li className="comment">
        <span className="comment-face" aria-hidden="true">
          작
        </span>

        <div>
          <div className="author-name">
            작성자
            <span className="author-date comment-when">{formatCommentDate(comment.createdAt)}</span>
          </div>
          <p className="comment-text">{comment.contents}</p>
        </div>
      </li>
    </ul>
  ));

  if (commentsList.length === 0) {
    commentContent = (
      <ContentState
        compact
        icon="pi-comments"
        title="댓글이 없습니다"
        description="첫 댓글을 작성해보세요"
      />
    );
  }

  if (commentsError) {
    commentContent = (
      <ContentState
        compact
        tone="danger"
        icon="pi-exclamation-triangle"
        title="댓글을 불러오지 못했습니다"
        description="잠시 후 다시 시도해주세요"
      />
    );
  }

  if (commentsLoading) {
    commentContent = (
      <ContentState compact icon="pi-comments" title="댓글을 불러오는 중입니다" description="" />
    );
  }

  // 댓글 영역
  let commentSection = (
    <section className="card comments-card">
      <div className="section-heading">
        <div>
          <h2 className="section-title">댓글 {commentsList.length}개</h2>
          <p>답변이나 참고 자료를 나누면 더 빨리 해결할 수 있어요.</p>
        </div>
      </div>
      {commentContent}

      <form className="comment-form field">
        <label className="field-label" htmlFor="comment">
          댓글 작성
        </label>
        <InputTextarea
          id="comment"
          rows={3}
          placeholder="해결 방법이나 참고 자료를 알려주세요"
          name="contents"
          value={contents}
          onChange={onChange}
        />
        <div className="row-end">
          <Button onClick={saveComments} type="button" label="댓글 등록" disabled={submitting} />
        </div>
      </form>
    </section>
  );

  if (notFound || error) {
    commentSection = null;
  }

  return (
    <>
      <Link to="/" className="back-link">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </Link>

      <article className="card article-card">{articleContent}</article>

      {commentSection}
      {/* 퍼블리싱된 삭제 확인 UI. visible 상태와 이벤트는 인턴이 구현한다. */}
      <Dialog
        visible={showDeleteDialog}
        header="이 글을 삭제할까요?"
        draggable={false}
        onHide={closeDeleteDialog}
        footer={
          <>
            <Button
              type="button"
              label="취소"
              severity="help"
              onClick={closeDeleteDialog}
            />
            <Button
              type="button"
              label="삭제"
              severity="danger"
              onClick={confirmDelete}
              disabled={deleting}
            />
          </>
        }
      >
        {`댓글 ${commentsList.length}개도 함께 사라지고, 되돌릴 수 없어요.`}
      </Dialog>
    </>
  );
}
