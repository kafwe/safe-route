import logging
import requests
from typing import List, Dict
from pypolyline.cutil import decode_polyline

logging.basicConfig(level=logging.info, format='%(asctime)s - %(levelname)s - %(message)s')

def snap_to_roads(polyline: List[List], api_key: str) -> List[List]:
  """
  Snaps a polyline to actual roads using the Google Roads API.

  Args:
      polyline: List of lists containing latitude and longitude coordinates.
      api_key: Your API key for the Google Roads API.

  Returns:
      The original polyline if an error occurs, otherwise a list of lists representing the snapped polyline along actual roads.
  """
  logging.info("Snapping polyline to roads using Google Roads API...")

  # Encode polyline for the API request (as per Google Roads API documentation)
  encoded_polyline = "|".join([f"{lat},{lng}" for lat, lng in polyline])

  # Prepare API request URL and parameters
  base_url = "https://roads.googleapis.com/v1/snapToRoads"
  params = {'path': encoded_polyline, 'key': api_key}

  try:
    response = requests.get(base_url, params=params)
    response.raise_for_status()  # Raise exception for non-200 status codes
  except requests.exceptions.RequestException as e:
    logging.error(f"Error making Google Roads API call: {e}")
    return polyline  # Return original polyline on error

  # Parse response data (as per Google Roads API documentation)
  snapped_points = response.json()['snappedPoints']
  return snapped_points

def get_directions(data: Dict, api_key: str) -> Dict:
  """
  Extracts data from request, calculates waypoints using unique roads from Google Roads API, and builds Google Maps URL.

  Args:
      data: Dictionary containing origin, destination, and encoded_polyline data.
      api_key: Your API key for the Google Roads API.

  Returns:
      Dictionary with a single key 'url' containing the Google Maps URL for navigation, 
      or an 'error' key if issues occur.
  """
  origin = data.get('origin')
  destination = data.get('destination')
  encoded_polyline = data.get('encoded_polyline')

  # Error handling: Check for missing data
  if not all([origin, destination, encoded_polyline]):
    return {'error': 'Missing required data in request.'}

  logging.info("Processing request with:")
  logging.info(f"\t- Origin: {origin}")
  logging.info(f"\t- Destination: {destination}")
  logging.info(f"\t- Encoded Polyline: {encoded_polyline}")

  # Decode polyline using pypolyline
  try:
    polyline = decode_polyline(str.encode(encoded_polyline), 5)
  except Exception as e:
    logging.error(f"Error decoding polyline: {e}")
    return {'error': f'Error decoding polyline: {e}'}

  # Snap polyline to roads using Google Roads API
  snapped_polyline = snap_to_roads(polyline, api_key)

  # Filter out duplicate roads (replace with your logic to identify a unique road)
  unique_roads = filter_unique_roads(snapped_polyline)
  logging.info(f"Extracted {len(unique_roads)} unique roads from snapped polyline.")


  # Build Google Maps URL with waypoints
  formatted_waypoints = '|'.join(f"{point['location']['latitude']},{point['location']['longitude']}" for point in unique_roads)
  url = f"https://www.google.com/maps/dir/?api=1&origin={origin['latitude']},{origin['longitude']}&destination={destination['latitude']},{destination['longitude']}&travelmode=driving&waypoints={formatted_waypoints}"

  logging.info(f"Generated Google Maps URL: {url}")
  return {'url': url}

def filter_unique_roads(snapped_points: List[Dict]) -> List[Dict]:
    """
    Filters out duplicate roads from the snapped polyline by the placeId field.

    Args:
        snapped_polyline: List of dictionaries containing latitude and longitude coordinates of snapped points.

    Returns:
        List of dictionaries representing unique roads.
    """
    logging.info("Starting to filter unique roads.")
    
    unique_roads = []
    place_ids = set()

    logging.info(f"Total snapped points received: {len(snapped_points)}")
    
    for point in snapped_points:
        place_id = point.get('placeId')
        if place_id:
            if place_id not in place_ids:
                unique_roads.append(point)
                place_ids.add(place_id)
                logging.info(f"Added point with placeId {place_id} to unique roads.")
            else:
                logging.info(f"Duplicate point with placeId {place_id} found, skipping.")
        else:
            logging.info("Point does not have a placeId, skipping.")

    logging.info(f"Total unique roads filtered: {len(unique_roads)}")
    
    return unique_roads