import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { ContentState, ArticleSkeleton } from '../components/ContentState.jsx';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // 게시글 가져오기
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchPost() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4100/posts/${id}`, {
          signal: abortController.signal,
        });
        if (!response.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setPost(data);
        setNotFound(false);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('불러오기 실패', err);
        setLoading(false); // 이것도 아직 빠져 있음
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

    fetch(`http://localhost:4100/comments?postId=${id}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => setCommentsList(data))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('댓글 로딩 실패:', err);
      });

    return () => {
      abortController.abort();
    };
  }, [id]);

  // 게시글 삭제
  const deleteBtn = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:4100/posts/${id}?_dependent=comments`, {
      method: 'DELETE',
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        alert('삭제완료');
        navigate('/');
      } else {
        alert('삭제실패');
      }
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
    try {
      const response = await fetch('http://localhost:4100/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...comments,
          postId: id,
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
              <div className="author-date">2026년 8월 10일 09:02</div>
            </div>
          </div>
          <div className="stat-row">
            <span aria-label="조회 297회">
              <i className="pi pi-eye" aria-hidden="true" />
              297
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
            <span className="author-date comment-when">8월 10일 10:12</span>
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
          <Button onClick={saveComments} type="button" label="댓글 등록" />
        </div>
      </form>
    </section>
  );

  if (notFound) {
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
        onHide={() => setShowDeleteDialog(false)}
        footer={
          <>
            <Button
              type="button"
              label="취소"
              severity="help"
              onClick={() => setShowDeleteDialog(false)}
            />
            <Button
              type="button"
              label="삭제"
              severity="danger"
              onClick={confirmDelete}
            />
          </>
        }
      >
        {`댓글 ${commentsList.length}개도 함께 사라지고, 되돌릴 수 없어요.`}
      </Dialog>
    </>
  );
}
