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
import LoginPage from "./pages/auth/LoginPage";

import AppInitializer from "./AppInitializer";
import SavedCombinationsPage from "./pages/savedCombinations/savedCombinationsPage";
import PrivateRoute from "./PrivateRoute";
import CallbackPage from "./pages/auth/CallbackPage";
import SignupPage from "./pages/auth/SignupPage";

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
    { path: ROUTES.LOGIN.path, element: <LoginPage /> },
    { path: ROUTES.CALLBACK.path, element: <CallbackPage /> },
    { path: ROUTES.SIGN_UP.path, element: <SignupPage /> },
    {
      path: ROUTES.SAVED_COMBINATIONS.path,
      element: (
        <PrivateRoute>
          <SavedCombinationsPage />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllDraws());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppInitializer>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </AppInitializer>
      </Router>
      <ScrollToTop />
    </QueryClientProvider>
  );
};

export default App;
