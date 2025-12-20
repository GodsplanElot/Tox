// src/pages/Home.tsx
import React from "react";
import HeroCarousel from "../components/HeroCarousel";

const Home: React.FC = () => {
  return (
    <>
      <HeroCarousel />

      <div className="container py-5">
        <h1>Welcome to MyMovieApp</h1>
        <p>This is the homepage. MOVIE will appear here later.</p>
      </div>
    </>
  )
}

export default Home;
