export interface Episode {
  id: string
  title: string
  episodeNumber: number
  runtime?: number
  videoUrl: string
  downloadUrl?: string
  description?: string
}

export interface Season {
  id: string
  seasonNumber: number
  episodes: Episode[]
}

export interface Series {
  id: string
  title: string
  poster: string
  backdrop?: string
  description: string
  genres: string[]
  rating?: number
  year?: number
  seasons: Season[]
}
