// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import About from "./pages/About";
import Contact from "./pages/Contact";
import Movies from "./pages/Movies";
import TvSeries from "./pages/TvSeries";
import Animations from "./pages/Animations";
import AnimeSeries from "./pages/AnimeSeries";
import MovieDetailPage from "./pages/MovieDetailPage";
import MainLayout from "./layout/MainLayout";

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-series" element={<TvSeries />} />
        <Route path="/animations" element={<Animations />} />
        <Route path="/anime-series" element={<AnimeSeries />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
