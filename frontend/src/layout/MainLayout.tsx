import React from "react";
import Header from "./Header";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
