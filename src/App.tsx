import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 다른 기능별 페이지 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
