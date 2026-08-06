import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [boardList, setBoardList] = useState([]);
  const getBoardList = async () => {
    const response = await fetch('http://localhost:4100/posts');
    const resp = await response.json();

    // 2) 게시글 목록 데이터에 할당
    setBoardList(resp.data);

    // 3) boardList 변수에 할당
    const pngn = resp.pagination;
    console.log(pngn);
  };

  return (
    <>
      <Link to="/" className="back-link">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </Link>

      <section className="page-intro page-intro--compact">
        <div>
          <h1 className="page-title">
            {isEditMode ? '글 수정' : '새 글 작성'}
          </h1>
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
              placeholder="예: 페이지네이션 쿼리는 어떻게 넘기시나요?"
              aria-describedby="title-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="title-count">
                0 / 100자
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
              placeholder="목록에 표시될 이름"
              aria-describedby="author-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="author-count">
                0 / 20자
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
              rows={12}
              placeholder="막힌 부분, 시도해본 방법, 궁금한 점을 차례로 적어보세요"
              aria-describedby="content-count"
            />
            <div className="field-foot">
              <span className="field-hint" id="content-count">
                0 / 2,000자
              </span>
            </div>
          </div>

          <div className="form-footer">
            <Link to="/" className="p-button p-button-help btn-xl">
              작성 취소
            </Link>
            <Button
              type="button"
              label={isEditMode ? '글 수정' : '글 등록'}
              className="btn-xl"
              icon="pi pi-check"
              disabled
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

      {/* 퍼블리싱된 이탈 확인 UI. visible 상태와 이벤트는 인턴이 구현한다. */}
      <Dialog
        visible={false}
        header="작성을 그만둘까요?"
        draggable={false}
        footer={
          <>
            <Button type="button" label="계속 작성" severity="help" />
            <Button
              type="button"
              label="내용 버리고 나가기"
              severity="danger"
            />
          </>
        }
      >
        지금 나가면 입력한 내용이 사라져요.
      </Dialog>
    </>
  );
}
