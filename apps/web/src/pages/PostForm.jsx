import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_BASE } from '../api.js';

export default function PostForm() {
  const navigate = useNavigate();

  const [post, setPosts] = useState({
    title: '',
    name: '',
    contents: '',
  });
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);

  const { title, name, contents } = post;
  const isDirty = Boolean(title.trim() || name.trim() || contents.trim());

  const onCancel = (event) => {
    if (!isDirty) return;
    event.preventDefault();
    setLeaveDialogVisible(true);
  };

  const onChange = (event) => {
    const { value, name } = event.target;
    setPosts({
      ...post,
      [name]: value,
    });
  };

  const savepost = async () => {
    if (!title.trim() || !name.trim() || !contents.trim()) {
      alert('모든 칸을 채워주세요.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          createdAt: new Date().toISOString(),
          views: 0,
          isNotice: false,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        alert('등록되었습니다.');
        navigate(`/posts/${newPost.id}`);
      } else {
        alert('등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <>
      <Link to="/" className="back-link is-static">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </Link>

      <section className="page-intro page-intro--compact">
        <div>
          <h1 className="page-title">새 글 작성</h1>
          <p className="page-description">
            질문이나 해결 방법을 작성하면 목록에 바로 보여요.
          </p>
        </div>
      </section>

      <div className="write-layout">
        <form className="card form-card">
          <div className="field">
            <label className="field-label" htmlFor="title">
              제목
              <span className="req" aria-hidden="true">
                *
              </span>
            </label>
            <InputText
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              maxLength={100}
              placeholder="예: 페이지네이션 쿼리는 어떻게 넘기시나요?"
              aria-describedby="title-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="title-count">
                {title.length} / 100자
              </span>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="author">
              닉네임
              <span className="req" aria-hidden="true">
                *
              </span>
            </label>
            <InputText
              id="author"
              name="name"
              value={name}
              onChange={onChange}
              maxLength={20}
              placeholder="목록에 표시될 이름"
              aria-describedby="author-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="author-count">
                {name.length} / 20자
              </span>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="content">
              내용
              <span className="req" aria-hidden="true">
                *
              </span>
            </label>
            <InputTextarea
              id="content"
              name="contents"
              value={contents}
              onChange={onChange}
              maxLength={2000}
              rows={12}
              placeholder="막힌 부분, 시도해본 방법, 궁금한 점을 차례로 적어보세요"
              aria-describedby="content-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="content-count">
                {contents.length} / 2,000자
              </span>
            </div>
          </div>

          <div className="form-footer">
            <Link
              to="/"
              onClick={onCancel}
              className="p-button p-button-help btn-xl is-static"
            >
              작성 취소
            </Link>
            <Button
              onClick={savepost}
              type="button"
              label="글 등록"
              className="btn-xl"
              icon="pi pi-check"
            />
          </div>
        </form>

        <aside className="writing-guide" aria-labelledby="writing-guide-title">
          <span className="guide-icon" aria-hidden="true">
            <i className="pi pi-lightbulb" />
          </span>
          <h2 id="writing-guide-title">답변받기 좋은 글</h2>
          <ul>
            <li>문제가 생긴 상황을 먼저 알려주세요.</li>
            <li>이미 시도한 방법을 함께 적어주세요.</li>
            <li>개인정보는 글에 남기지 마세요.</li>
          </ul>
        </aside>
      </div>

      <Dialog
        visible={leaveDialogVisible}
        onHide={() => setLeaveDialogVisible(false)}
        header="작성을 그만둘까요?"
        draggable={false}
        footer={
          <>
            <Button
              type="button"
              label="계속 작성"
              severity="help"
              onClick={() => setLeaveDialogVisible(false)}
            />
            <Button
              type="button"
              label="내용 버리고 나가기"
              severity="danger"
              onClick={() => navigate('/')}
            />
          </>
        }
      >
        지금 나가면 입력한 내용이 사라져요.
      </Dialog>
    </>
  );
}
