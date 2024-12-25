import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import NumberGeneration from "./pages/numberGeneration/NumberGeneration";
import ExcludeNumbers from "./pages/excludedNumbers/ExcludeNumbers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/number-generation" element={<NumberGeneration />} />
        <Route path="/exclude-numbers" element={<ExcludeNumbers />} />
      </Routes>
    </Router>
  );
};

export default App;
