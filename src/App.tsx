import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.scss";
import Home from "./pages/home/Home";
import NumberGeneration from "./pages/numberGeneration/NumberGeneration";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/number-generation" element={<NumberGeneration />} />
      </Routes>
    </Router>
  );
};

export default App;
