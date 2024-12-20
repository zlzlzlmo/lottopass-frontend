import React from "react";
import Menu from "../components/Menu";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-yellow-400 text-white text-center py-4">
        <h1 className="text-xl font-bold">로또 번호 생성</h1>
      </header>
      <main className="container mx-auto">
        <Menu />
      </main>
      <footer className="bg-white border-t border-gray-200 text-center py-2">
        <p className="text-sm text-gray-600">© 2024 Lotto Pass</p>
      </footer>
    </div>
  );
};

export default Home;
