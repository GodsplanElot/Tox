// src/App.tsx
import React from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./pages/Home"; // swap this for About/Contact manually for now

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Home />
{/*         <About />
        <Contact /> */}
      </main>
      <Footer />
    </>
  );
};

export default App;
