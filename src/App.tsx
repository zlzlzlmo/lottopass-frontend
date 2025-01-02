import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import NumberGeneration from "./pages/numberGeneration/NumberGeneration";
import Result from "./pages/result/Result";
import { ROUTES } from "./constants/routes";
import NotFound from "./pages/notFound/NotFound";
import { AppProviders } from "./context/AppProviders";
import "./styles/global.scss";
const App = () => {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route
            path={ROUTES.NUMBER_GENERATION}
            element={<NumberGeneration />}
          />
          <Route path={ROUTES.RESULT} element={<Result />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProviders>
  );
};

export default App;
