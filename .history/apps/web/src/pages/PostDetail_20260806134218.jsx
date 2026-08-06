import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // 1. navigate 선언 추가
  const [post, setPost] = useState(null); // 2. 단일 객체 상태로 변경

  useEffect(() => {
    // 3. 특정 id의 게시글만 가져오도록 수정 (서버 지원 여부에 따름)
    fetch(`http://localhost:4100/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  const deleteBtn = () => {
    fetch(`http://localhost:4100/posts/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          alert('삭제완료');
          navigate('/');
        } else {
          alert('삭제실패');
        }
      })
      .catch((error) => {
        console.error('에러 발생:', error);
        alert('삭제실패');
      });
  };
  return (
    <>
      <Link to="/" className="back-link">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </Link>

      <article className="card article-card">
        {posts
          .filter((post) => String(post.id) === id)
          .map((post) => (
            <div key={post.id}>
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
                  <span aria-label="댓글 2개">
                    <i className="pi pi-comment" aria-hidden="true" />2
                  </span>
                </div>
              </div>

              <hr className="rule" />

              <div className="post-body">{post.title}</div>
            </div>
          ))}

        <div className="post-actions">
          <Button
            onClick={deleteBtn}
            type="button"
            label="글 삭제"
            severity="danger"
            icon="pi pi-trash"
            className="is-static"
          />
          <Link
            to={`/posts/${id}/edit`}
            className="p-button p-button-secondary"
          >
            <i className="pi pi-pencil" aria-hidden="true" />
            <span>글 수정</span>
          </Link>
        </div>
      </article>

      <section className="card comments-card">
        <div className="section-heading">
          <div>
            <h2 className="section-title">댓글 2개</h2>
            <p>답변이나 참고 자료를 나누면 더 빨리 해결할 수 있어요.</p>
          </div>
        </div>

        <ul className="comment-list">
          <li className="comment">
            <span className="comment-face" aria-hidden="true">
              작
            </span>
            <div>
              <div className="author-name">
                작성자2
                <span className="author-date comment-when">8월 10일 10:12</span>
              </div>
              <p className="comment-text">
                저도 같은 부분에서 막혔는데 덕분에 해결했습니다. 감사합니다!
              </p>
            </div>
          </li>
          <li className="comment">
            <span className="comment-face" aria-hidden="true">
              작
            </span>
            <div>
              <div className="author-name">
                작성자5
                <span className="author-date comment-when">8월 10일 11:40</span>
              </div>
              <p className="comment-text">
                페이지네이션은 쿼리 파라미터로 넘기면 편해요.
              </p>
            </div>
          </li>
        </ul>

        <form className="comment-form field">
          <label className="field-label" htmlFor="comment">
            댓글 작성
          </label>
          <InputTextarea
            id="comment"
            rows={3}
            placeholder="해결 방법이나 참고 자료를 알려주세요"
          />
          <div className="row-end">
            <Button type="button" label="댓글 등록" disabled />
          </div>
        </form>
      </section>

      {/* 퍼블리싱된 삭제 확인 UI. visible 상태와 이벤트는 인턴이 구현한다. */}
      <Dialog
        visible={false}
        header="이 글을 삭제할까요?"
        draggable={false}
        footer={
          <>
            <Button type="button" label="취소" severity="help" />
            <Button type="button" label="삭제" severity="danger" />
          </>
        }
      >
        댓글 2개도 함께 사라지고, 되돌릴 수 없어요.
      </Dialog>
    </>
  );
}
