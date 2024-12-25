import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import NumberGeneration from "./pages/numberGeneration/NumberGeneration";
import ExcludeNumbers from "./pages/excludedNumbers/ExcludeNumbers";
import Result from "./pages/result/Result";
import { LottoNumberProvider } from "./context/lottoNumbers";

const App = () => {
  return (
    <LottoNumberProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/number-generation" element={<NumberGeneration />} />
          <Route path="/exclude-numbers" element={<ExcludeNumbers />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </LottoNumberProvider>
  );
};

export default App;
