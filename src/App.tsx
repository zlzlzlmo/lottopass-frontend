import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { AppProviders } from "./context/AppProviders";
import "./styles/global.scss";
import Loading from "./components/common/loading/Loading";
import Detail from "./pages/\bdetail/Detail";
import AllStores from "./pages/allStores/AllStores";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const HomePage = lazy(() => import("./pages/home/HomePage"));
const NumberGenerationPage = lazy(
  () => import("./pages/numberGeneration/NumberGenerationPage")
);
const Result = lazy(() => import("./pages/result/Result"));
const WinningStoresPage = lazy(
  () => import("./pages/winningStores/WinningStoresPage")
);
const HistoryPage = lazy(() => import("./pages/history/HistoryPage"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <HomePage /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGenerationPage /> },
    { path: ROUTES.STORE_INFO.path, element: <WinningStoresPage /> },
    { path: ROUTES.HISTORY.path, element: <HistoryPage /> },
    { path: ROUTES.HISTORY_DETAIL.path, element: <Detail /> },
    { path: ROUTES.ALL_STORES.path, element: <AllStores /> },
    { path: ROUTES.RESULT.path, element: <Result /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
