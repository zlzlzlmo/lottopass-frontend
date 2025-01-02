import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { AppProviders } from "./context/AppProviders";
import "./styles/global.scss";
import Loading from "./components/common/loading/Loading";

const Home = lazy(() => import("./pages/home/Home"));
const NumberGeneration = lazy(
  () => import("./pages/numberGeneration/NumberGeneration")
);
const Result = lazy(() => import("./pages/result/Result"));
const StoreInfo = lazy(() => import("./pages/storeInfo/StoreInfo"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const App: React.FC = () => {
  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route
              path={ROUTES.NUMBER_GENERATION}
              element={<NumberGeneration />}
            />
            <Route path={ROUTES.STORE_INFO} element={<StoreInfo />} />
            <Route path={ROUTES.RESULT} element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProviders>
  );
};

export default App;
