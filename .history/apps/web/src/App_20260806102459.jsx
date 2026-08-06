import AppHeader from './components/AppHeader.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import PostList from './pages/PostList.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/write" element={<PostForm />} />
        <Route path="/post/:id" element={<PostDetail />} />
        {/* <Route path="/post/:id/edit" element={<EditPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
