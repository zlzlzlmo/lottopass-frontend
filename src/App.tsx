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
import ScrollToTop from "./components/common/scroll/ScrollToTop";
import SimulationNumberGenrationPage from "./pages/simulationNumberGeneration/SimulationNumberGenrationPage";
import SimulationResultPage from "./pages/result/SimulationResult";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <HomePage /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGenerationPage /> },
    {
      path: ROUTES.S_NUMBER_GENERATION.path,
      element: <SimulationNumberGenrationPage />,
    },
    { path: ROUTES.STORE_INFO.path, element: <WinningStoresPage /> },
    { path: ROUTES.HISTORY.path, element: <HistoryPage /> },
    { path: ROUTES.HISTORY_DETAIL.path, element: <DetailPage /> },
    { path: ROUTES.ALL_STORES.path, element: <AllStoresPage /> },
    { path: ROUTES.RESULT.path, element: <ResultPage /> },
    { path: ROUTES.SIMULATION_RESULT.path, element: <SimulationResultPage /> },
    { path: ROUTES.STATISTIC.path, element: <StatisticPage /> },
    // { path: ROUTES.SIGNUP.path, element: <SignupPage /> },
    { path: "*", element: <NotFound /> },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllDraws());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <AppInitializer> */}
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
        {/* </AppInitializer> */}
      </Router>
      <ScrollToTop />
    </QueryClientProvider>
  );
};

export default App;
