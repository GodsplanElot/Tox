import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";

const slides = [
  {
    title: "Savage maryfavour",
    rating: "9.8",
    ratingClass: "green",
    text: "A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source.",
    categories: ["Action", "Drama", "Comedy"],
    bg: "/img/bg/home__bg.jpg",
  },
  {
    title: "From the Other Side",
    rating: "6.9",
    ratingClass: "yellow",
    text: "In a world where magic is outlawed and hunted, a young witch must fight back.",
    categories: ["Adventure", "Thriller"],
    bg: "/img/covers/cover1.jpg",
  },
  {
    title: "Endless Horizon",
    rating: "6.2",
    ratingClass: "red",
    text: "An archaeologist's daughter journeys into the Amazon to uncover a hidden city.",
    categories: ["Action", "Drama", "Thriller"],
    bg: "/img/covers/cover2.jpg",
  },
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = useCallback((selectedIndex: number) => {
    setIndex(selectedIndex);
  }, []);

  return (
    <section className="hero-carousel">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={6000}
        pause="hover"
        controls
        indicators
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.title}>
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${slide.bg})` }}
            />
            <div className="hero-fade" />
            <div className="hero-content">
              <h1 className="hero-title">
                {slide.title}
                <span
                  className={`hero-rating hero-rating--${slide.ratingClass}`}
                >
                  {slide.rating}
                </span>
              </h1>

              <p className="hero-description">{slide.text}</p>

              <div className="hero-categories">
                {slide.categories.map((cat) => (
                  <span key={cat} className="category-badge">
                    {cat}
                  </span>
                ))}
              </div>

              <Link to="/details" className="hero-cta btn btn-primary">
                Watch Now
              </Link>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
