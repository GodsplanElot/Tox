import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_watchlist():
    # 1. Get watchlist
    print("Fetching watchlist...")
    response = requests.get(f"{BASE_URL}/watchlist/")
    if response.status_code == 200:
        print(f"Success: {len(response.json())} items found.")
    else:
        print(f"Failed: {response.status_code}")
        print(response.text)
        return

    # 2. Get a movie to add
    print("\nFetching movies...")
    movies_response = requests.get(f"{BASE_URL}/movies/")
    if not movies_response.json():
        print("No movies found to test with.")
        return
    movie = movies_response.json()[0]
    print(f"Using movie: {movie['title']} (ID: {movie['id']})")

    # 3. Add to watchlist
    print("\nAdding to watchlist...")
    add_response = requests.post(f"{BASE_URL}/watchlist/", json={
        "content_type_model": "movie",
        "object_id": movie['id']
    })
    if add_response.status_code == 201:
        item = add_response.json()
        print(f"Success: Added item {item['id']}")
        item_id = item['id']
    else:
        print(f"Failed to add: {add_response.status_code}")
        print(add_response.text)
        return

    # 4. Check status
    print(f"\nChecking status for movie {movie['id']}...")
    status_response = requests.get(f"{BASE_URL}/watchlist/?content_type=movie&object_id={movie['id']}")
    if status_response.status_code == 200 and len(status_response.json()) > 0:
        print("Success: Item found in status check.")
    else:
        print("Failed: Item not found in status check.")

    # 5. Remove from watchlist
    print(f"\nRemoving item {item_id}...")
    del_response = requests.delete(f"{BASE_URL}/watchlist/{item_id}/")
    if del_response.status_code == 204:
        print("Success: Item removed.")
    else:
        print(f"Failed to remove: {del_response.status_code}")

if __name__ == "__main__":
    test_watchlist()
