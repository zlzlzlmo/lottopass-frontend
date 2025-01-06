import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import "./styles/global.scss";

import { QueryClient, QueryClientProvider } from "react-query";
import { fetchAllDraws } from "./features/draw/drawSlice";
import { useAppDispatch } from "./redux/hooks";
import {
  AllStoresPage,
  DetailPage,
  HistoryPage,
  HomePage,
  NotFound,
  NumberGenerationPage,
  ResultPage,
  StatisticPage,
  WinningStoresPage,
} from "./pages";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <HomePage /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGenerationPage /> },
    { path: ROUTES.STORE_INFO.path, element: <WinningStoresPage /> },
    { path: ROUTES.HISTORY.path, element: <HistoryPage /> },
    { path: ROUTES.HISTORY_DETAIL.path, element: <DetailPage /> },
    { path: ROUTES.ALL_STORES.path, element: <AllStoresPage /> },
    { path: ROUTES.RESULT.path, element: <ResultPage /> },
    { path: ROUTES.STATISTIC.path, element: <StatisticPage /> },
    { path: "*", element: <NotFound /> },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllDraws());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
