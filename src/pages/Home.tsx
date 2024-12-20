import React from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Menu />
      </main>
      <Footer />

      <div className="bg-blue-500 text-white p-4 text-center">
        Tailwind CSS 적용 확인
      </div>
    </div>
  );
};

export default Home;
