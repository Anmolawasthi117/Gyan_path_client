import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MapEditor from './pages/MapEditor.jsx';
import ToastProvider from './components/common/ToastProvider';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map-editor" element={<MapEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;