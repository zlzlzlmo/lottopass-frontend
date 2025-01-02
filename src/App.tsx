import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { AppProviders } from "./context/AppProviders";
import "./styles/global.scss";
import Loading from "./components/common/loading/Loading";
import Detail from "./pages/\bdetail/Detail";

const Home = lazy(() => import("./pages/home/Home"));
const NumberGeneration = lazy(
  () => import("./pages/numberGeneration/NumberGeneration")
);
const Result = lazy(() => import("./pages/result/Result"));
const StoreInfo = lazy(() => import("./pages/storeInfo/StoreInfo"));
const History = lazy(() => import("./pages/history/History"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <Home /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGeneration /> },
    { path: ROUTES.STORE_INFO.path, element: <StoreInfo /> },
    { path: ROUTES.HISTORY.path, element: <History /> },
    { path: ROUTES.DETAIL.path, element: <Detail /> },
    { path: ROUTES.RESULT.path, element: <Result /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </AppProviders>
  );
};

export default App;
