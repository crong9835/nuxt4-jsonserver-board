import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../api.js';
import { ContentState } from '../components/ContentState.jsx';

export default function PostForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [post, setPosts] = useState({
    title: '',
    name: '',
    contents: '',
  });
  const [initialPost, setInitialPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);
  const [errors, setErrors] = useState({ title: '', name: '', contents: '' });
  const [saveError, setSaveError] = useState(false);
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const contentRef = useRef(null);
  const cancelLinkRef = useRef(null);

  const { title, name, contents } = post;

  let isDirty = false;
  if (isEdit && initialPost) {
    isDirty =
      title !== initialPost.title ||
      name !== initialPost.name ||
      contents !== initialPost.contents;
  } else if (!isEdit) {
    isDirty = Boolean(title.trim() || name.trim() || contents.trim());
  }

  const onCancel = (event) => {
    if (!isDirty) return;
    event.preventDefault();
    setLeaveDialogVisible(true);
  };

  const closeLeaveDialog = () => {
    setLeaveDialogVisible(false);
    cancelLinkRef.current?.focus();
  };

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const validate = () => {
    const nextErrors = { title: '', name: '', contents: '' };
    if (!title.trim()) nextErrors.title = '제목을 입력해주세요.';
    if (!name.trim()) nextErrors.name = '닉네임을 입력해주세요.';
    if (!contents.trim()) nextErrors.contents = '내용을 입력해주세요.';
    setErrors(nextErrors);

    if (nextErrors.title) {
      titleRef.current?.focus();
    } else if (nextErrors.name) {
      authorRef.current?.focus();
    } else if (nextErrors.contents) {
      contentRef.current?.focus();
    }

    return !nextErrors.title && !nextErrors.name && !nextErrors.contents;
  };

  const onChange = (event) => {
    const { value, name } = event.target;
    setPosts({
      ...post,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!isEdit) return;
    const abortController = new AbortController();
    async function fetchPost() {
      try {
        const response = await fetch(`${API_BASE}/posts/${id}`, {
          signal: abortController.signal,
        });
        if (!response.ok) {
          console.error('게시글불러오기 실패');
          return;
        }

        const data = await response.json();

        setPosts({
          title: data.title,
          name: data.name,
          contents: data.contents,
        });
        setInitialPost({
          title: data.title,
          name: data.name,
          contents: data.contents,
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('불러오기 실패', err);
      }
    }
    fetchPost();
    return () => {
      abortController.abort();
    };
  }, [id, isEdit]);

  const savepost = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(false);
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
        setSaveError(true);
        setSaving(false);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setSaveError(true);
      setSaving(false);
    }
  };

  const updatePost = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(false);
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          name: name,
          contents: contents,
        }),
      });

      if (res.ok) {
        alert('수정되었습니다.');
        navigate(`/posts/${id}`);
      } else {
        setSaveError(true);
        setSaving(false);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setSaveError(true);
      setSaving(false);
    }
  };

  const onSubmit = isEdit ? updatePost : savepost;

  return (
    <>
      <Link to="/" className="back-link is-static">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </Link>

      <section className="page-intro page-intro--compact">
        <div>
          <h1 className="page-title">{isEdit ? '게시글 수정' : '새 글 작성'}</h1>
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
              ref={titleRef}
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
                {errors.title || `${title.length} / 100자`}
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
              ref={authorRef}
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
                {errors.name || `${name.length} / 20자`}
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
              ref={contentRef}
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
                {errors.contents || `${contents.length} / 2,000자`}
              </span>
            </div>
          </div>

          {saveError && (
            <ContentState
              compact
              tone="danger"
              icon="pi-exclamation-triangle"
              title="저장하지 못했습니다"
              description="잠시 후 다시 시도해주세요"
            />
          )}

          <div className="form-footer">
            <Link
              ref={cancelLinkRef}
              to="/"
              onClick={onCancel}
              className="p-button p-button-help btn-xl is-static"
            >
              {isEdit ? '수정 취소' : '작성 취소'}
            </Link>
            <Button
              onClick={onSubmit}
              type="button"
              label={isEdit ? '글 수정' : '글 등록'}
              className="btn-xl"
              icon="pi pi-check"
              disabled={saving}
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
        onHide={closeLeaveDialog}
        header="작성을 그만둘까요?"
        draggable={false}
        footer={
          <>
            <Button
              type="button"
              label="계속 작성"
              severity="help"
              onClick={closeLeaveDialog}
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
