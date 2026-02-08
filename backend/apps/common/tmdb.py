import requests
from django.conf import settings

class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

    def __init__(self):
        self.api_key = getattr(settings, "TMDB_API_KEY", None)

    def fetch_movie_data(self, tmdb_id):
        if not self.api_key:
            return None
        
        url = f"{self.BASE_URL}/movie/{tmdb_id}"
        params = {"api_key": self.api_key, "language": "en-US"}
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                "title": data.get("title"),
                "description": data.get("overview"),
                "poster": f"{self.IMAGE_BASE_URL}{data.get('poster_path')}" if data.get("poster_path") else None,
                "backdrop": f"{self.IMAGE_BASE_URL}{data.get('backdrop_path')}" if data.get("backdrop_path") else None,
                "rating": data.get("vote_average"),
                "release_date": data.get("release_date"),
                "runtime": data.get("runtime"),
            }
        return None

    def fetch_series_data(self, tmdb_id):
        if not self.api_key:
            return None
        
        url = f"{self.BASE_URL}/tv/{tmdb_id}"
        params = {"api_key": self.api_key, "language": "en-US"}
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                "title": data.get("name"),
                "description": data.get("overview"),
                "poster": f"{self.IMAGE_BASE_URL}{data.get('poster_path')}" if data.get("poster_path") else None,
                "backdrop": f"{self.IMAGE_BASE_URL}{data.get('backdrop_path')}" if data.get("backdrop_path") else None,
                "rating": data.get("vote_average"),
                "first_air_date": data.get("first_air_date"),
            }
        return None
# ... (Keep existing fetch logic but NOTE: fields are now ImageFields)
# The sync actions in admin will needs to be updated if you want to 
# automatically download TMDB images into your local media storage.
# For now, it will attempt to assign the URL which may fail for ImageFields.
