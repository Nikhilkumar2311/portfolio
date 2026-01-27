import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, HomePage, BlogListPage, BlogPostPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
