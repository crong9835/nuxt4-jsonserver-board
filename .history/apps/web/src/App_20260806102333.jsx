import AppHeader from './components/AppHeader.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import PostList from './pages/PostList.jsx';

export default function App() {
  return (
    <>
      <AppHeader />
      function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/post/:id" element={<DetailPage />} />
        <Route path="/post/:id/edit" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  )
}
    </>
  );
}
