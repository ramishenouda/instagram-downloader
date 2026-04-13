import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home.jsx';
import InstaPage from './pages/InstaPage.jsx';
import Stats from './pages/Stats.jsx';
import AboutPage from './pages/AboutPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PageMeta from './components/PageMeta.jsx';

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <PageMeta pathname={location.pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insta" element={<InstaPage />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  );
}

export default App;
