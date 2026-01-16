export interface Episode {
  id: number
  title: string
  episodeNumber: number
  runtime?: number
  videoUrl?: string
}

export interface Season {
  id: number
  seasonNumber: number
  episodes: Episode[]
}

export interface Series {
  id: number
  title: string
  description: string
  poster: string
  backdrop?: string
  rating?: number
  year?: number
  genres?: string[]
  categoryIds: number[]   // ✅ ADD THIS
  firstAirDate: Date
  seasons: Season[]
}
