import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import InstaPage from './pages/InstaPage.jsx';
import YoutubePage from './pages/YoutubePage.jsx';
import Stats from './pages/Stats.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/insta" element={<InstaPage />} />
      <Route path="/youtube" element={<YoutubePage />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  );
}

export default App;
