import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    title: 'Savage maryfavour',
    rating: '9.8',
    ratingClass: 'green',
    text:
      "A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source. But when her groundbreaking technology falls into the wrong hands, she must race against time to stop it from being used for evil.",
    categories: ['Action', 'Drama', 'Comedy'],
    bg: '/img/bg/home__bg.jpg',
  },
  {
    title: 'From the Other Side',
    rating: '6.9',
    ratingClass: 'yellow',
    text:
      'In a world where magic is outlawed and hunted, a young witch must use her powers to fight back against the corrupt authorities who seek to destroy her kind.',
    categories: ['Adventure', 'Triler'],
    bg: '/img/covers/cover1.jpg',
  },
  {
    title: 'Endless Horizon',
    rating: '6.2',
    ratingClass: 'red',
    text:
      "When a renowned archaeologist goes missing, his daughter sets out on a perilous journey to the heart of the Amazon rainforest to find him. Along the way, she discovers a hidden city and a dangerous conspiracy that threatens the very balance of power in the world.",
    categories: ['Action', 'Drama', 'Triler'],
    bg: '/img/covers/cover2.jpg',
  },
]

type Props = {
  autoplayMs?: number
}

const HeroCarousel: React.FC<Props> = ({ autoplayMs = 6000 }) => {
  const [index, setIndex] = useState(0)
  const autoplayRef = useRef<number | null>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    autoplayRef.current = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), autoplayMs)
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
    }
  }, [autoplayMs])

  useEffect(() => {
    // mark splide as rendered so splide.min.css won't keep it hidden
    setRendered(true)
    return () => setRendered(false)
  }, [])

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length)
  }

  function resetAutoplay() {
    if (autoplayRef.current) window.clearInterval(autoplayRef.current)
    autoplayRef.current = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), autoplayMs)
  }

  return (
    <section className="home home--hero">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={`hero splide splide--hero ${rendered ? 'is-initialized is-rendered' : ''}`} aria-roledescription="carousel">
              <div className="splide__arrows">
                <button
                  className="splide__arrow splide__arrow--prev"
                  type="button"
                  onClick={() => {
                    prev()
                    resetAutoplay()
                  }}
                  aria-label="Previous slide"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  className="splide__arrow splide__arrow--next"
                  type="button"
                  onClick={() => {
                    next()
                    resetAutoplay()
                  }}
                  aria-label="Next slide"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              <div className="splide__track">
                <ul className="splide__list">
                  {slides.map((s, i) => (
                    <li
                      key={s.title}
                      className={`splide__slide ${i === index ? 'is-active' : ''}`}
                      aria-hidden={i === index ? 'false' : 'true'}
                      style={{ display: i === index ? undefined : 'none' }}
                    >
                      <div className="hero__slide" data-bg={s.bg} style={{ backgroundImage: `url(${s.bg})` }}>
                        <div className="hero__content">
                          <h2 className="hero__title">
                            {s.title} <sub className={s.ratingClass}>{s.rating}</sub>
                          </h2>
                          <p className="hero__text">{s.text}</p>
                          <p className="hero__category">
                            {s.categories.map((c) => (
                              <a key={c} href="#">
                                {c}
                              </a>
                            ))}
                          </p>
                          <div className="hero__actions">
                            <Link to="/details" className="hero__btn">
                              <span>Watch now</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
