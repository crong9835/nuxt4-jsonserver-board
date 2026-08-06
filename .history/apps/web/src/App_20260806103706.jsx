import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import PostForm from './pages/PostForm.jsx';
import PostList from './pages/PostList.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <main id="main" tabIndex="-1" className="shell page">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/write" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
