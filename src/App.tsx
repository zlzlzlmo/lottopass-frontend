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
import SimulationResultPage from "./pages/result/simulation/SimulationResultPage";
import SignupPage from "./pages/signup/SignupPage";
import LoginPage from "./pages/login/LoginPage";
import AppInitializer from "./AppInitializer";
import UserProfileUpdatePage from "./pages/auth/UserProfileUpdatePage";
import MyPage from "./pages/my/MyPage";
import DeleteAccountPage from "./pages/auth/DeleteAccountPage";
import FindPasswordPage from "./pages/findPassword/FindPasswordPage";
import SavedNumbersPage from "./pages/auth/SavedNumbersPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <HomePage /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGenerationPage /> },
    {
      path: ROUTES.S_NUMBER_GENERATION.path,
      element: <SimulationNumberGenrationPage />,
    },
    { path: ROUTES.WINNING_STORES.path, element: <WinningStoresPage /> },
    { path: ROUTES.HISTORY.path, element: <HistoryPage /> },
    { path: ROUTES.HISTORY_DETAIL.path, element: <DetailPage /> },
    { path: ROUTES.ALL_STORES.path, element: <AllStoresPage /> },
    { path: ROUTES.RESULT.path, element: <ResultPage /> },
    { path: ROUTES.SIMULATION_RESULT.path, element: <SimulationResultPage /> },
    { path: ROUTES.STATISTIC.path, element: <StatisticPage /> },
    { path: ROUTES.SIGNUP.path, element: <SignupPage /> },
    { path: ROUTES.LOGIN.path, element: <LoginPage /> },
    { path: ROUTES.UPDATE_PROFILE.path, element: <UserProfileUpdatePage /> },
    { path: ROUTES.FIND_PASSWORD.path, element: <FindPasswordPage /> },
    { path: ROUTES.MYPAGE.path, element: <MyPage /> },
    { path: ROUTES.DELETE_ACCOUNT.path, element: <DeleteAccountPage /> },
    { path: ROUTES.SAVED_NUMBERS.path, element: <SavedNumbersPage /> },
    { path: ROUTES.DASHBOARD.path, element: <DashboardPage /> },
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
          <ScrollToTop />
          {/* <AppInitializer> */}
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
    </QueryClientProvider>
  );
};

export default App;
