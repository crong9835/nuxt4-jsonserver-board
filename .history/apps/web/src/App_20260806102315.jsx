import AppHeader from './components/AppHeader.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import PostList from './pages/PostList.jsx';

export default function App() {
  return (
    <>
      <AppHeader />
      <main id="main" tabIndex="-1" className="shell page">
        <Screen />
      </main>
    </>
  );
}
