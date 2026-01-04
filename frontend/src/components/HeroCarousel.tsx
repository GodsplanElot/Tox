import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

const slides = [
  {
    title: "Savage maryfavour",
    rating: "9.8",
    ratingClass: "green",
    text:
      "A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source.",
    categories: ["Action", "Drama", "Comedy"],
    bg: "/img/bg/home__bg.jpg",
  },
  {
    title: "From the Other Side",
    rating: "6.9",
    ratingClass: "yellow",
    text:
      "In a world where magic is outlawed and hunted, a young witch must fight back.",
    categories: ["Adventure", "Thriller"],
    bg: "/img/covers/cover1.jpg",
  },
  {
    title: "Endless Horizon",
    rating: "6.2",
    ratingClass: "red",
    text:
      "An archaeologist’s daughter journeys into the Amazon to uncover a hidden city.",
    categories: ["Action", "Drama", "Thriller"],
    bg: "/img/covers/cover2.jpg",
  },
]

const AUTOPLAY_MS = 6000

const HeroCarousel = () => {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number | null>(null)
  const startX = useRef<number | null>(null)

  const next = () => {
    setIndex((i) => (i + 1) % slides.length)
  }

  const prev = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    timerRef.current = window.setInterval(next, AUTOPLAY_MS)

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const resetAutoplay = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
    }

    timerRef.current = window.setInterval(next, AUTOPLAY_MS)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return

    const delta = e.changedTouches[0].clientX - startX.current

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        prev()
      } else {
        next()
      }
      resetAutoplay()
    }

    startX.current = null
  }

  return (
    <section
      className="hero-carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="hero-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s) => (
          <div
            key={s.title}
            className="hero-slide"
            style={{ backgroundImage: `url(${s.bg})` }}
          >
            <div className="hero-overlay" />

            <div className="hero-content">
              <h1>
                {s.title} <sub className={s.ratingClass}>{s.rating}</sub>
              </h1>

              <p>{s.text}</p>

              <div className="hero-categories">
                {s.categories.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>

              <Link to="/details" className="hero-btn">
                Watch Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel
