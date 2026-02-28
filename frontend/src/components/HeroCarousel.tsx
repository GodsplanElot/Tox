import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { api } from "../services/api";

export interface CarouselItem {
  id: number | string;
  title: string;
  description: string;
  poster: string;
  link: string;
  rating?: number;
  categories?: { id: number; name: string }[];
}

interface HeroCarouselProps {
  items: CarouselItem[];
}

const HeroCarousel = ({ items }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);

  const handleSelect = useCallback((selectedIndex: number) => {
    setIndex(selectedIndex);
  }, []);

  if (!items || items.length === 0) return null;

  // Take top 5 items for the carousel
  const carouselItems = items.slice(0, 5);

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
        {carouselItems.map((item) => (
          <Carousel.Item key={`${item.id}-${item.link}`}>
            <div
              className="hero-bg"
              style={{
                backgroundImage: `url(${api.getMediaUrl(item.poster)})`,
              }}
            />
            <div className="hero-fade" />
            <div className="hero-content">
              <h1 className="hero-title">
                {item.title}
                {item.rating !== undefined && (
                  <span
                    className={`hero-rating hero-rating--${item.rating >= 8 ? "green" : item.rating >= 6 ? "yellow" : "red"}`}
                  >
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </h1>

              <p className="hero-description line-clamp-3">
                {item.description}
              </p>

              <div className="hero-categories">
                {item.categories?.map((cat) => (
                  <span key={cat.id} className="category-badge">
                    {cat.name}
                  </span>
                ))}
              </div>

              <Link to={item.link} className="hero-cta btn btn-primary">
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
