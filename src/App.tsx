import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        {/* <Route path="/generate-numbers" element={<GenerateNumbers />} />
          <Route path="/exclude-numbers" element={<ExcludeNumbers />} />
          <Route path="/results" element={<Results />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
