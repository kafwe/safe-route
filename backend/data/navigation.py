from typing import List, Dict
from pypolyline.cutil import decode_polyline
import math

def get_directions(data: Dict) -> Dict:
  """
  Extracts data from request, calculates waypoints, and builds Google Maps URL.

  Args:
      data: Dictionary containing origin, destination, and encoded_polyline data.

  Returns:
      Dictionary with a single key 'url' containing the Google Maps URL for navigation.
  """
  origin = data.get('origin')
  destination = data.get('destination')
  encoded_polyline = data.get('encoded_polyline')

  # Decode polyline using pypolyline
  polyline = decode_polyline(str.encode(encoded_polyline), 5)
  print("polyline", polyline)

  # Replace with your chosen waypoint extraction logic
  waypoints = extract_waypoints(polyline)

  # Build Google Maps URL with waypoints
  formatted_waypoints = '|'.join(f"{point['latitude']},{point['longitude']}" for point in waypoints)
  url = f"https://www.google.com/maps/dir/?api=1&origin={origin['latitude']},{origin['longitude']}&destination={destination['latitude']},{destination['longitude']}&travelmode=driving&waypoints={formatted_waypoints}"

  return {'url': url}

def extract_waypoints(polyline: List[List], distance_threshold=100) -> List[Dict]:
  """
  Extracts waypoints from a polyline using a distance-based approach.

  Args:
      polyline: List of lists containing latitude and longitude coordinates. (Output from pypolyline.decode_polyline)
      distance_threshold: Minimum distance between waypoints (meters).

  Returns:
      List of dictionaries containing waypoint coordinates.
  """
  waypoints = []
  last_point = None
  for point in polyline:
    if not last_point or distance_between(point[0], point[1], last_point[0], last_point[1]) >= distance_threshold:
      waypoints.append({'latitude': point[0], 'longitude': point[1]})
      last_point = point
  return waypoints

def distance_between(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
  """
  Calculates the distance between two points using the Haversine formula.

  Args:
      lat1: Latitude of the first point.
      lon1: Longitude of the first point.
      lat2: Latitude of the second point.
      lon2: Longitude of the second point.

  Returns:
      Distance between the two points in meters (float).
  """
  earth_radius = 6371e3  # Meters

  lat1 = radians(lat1)
  lon1 = radians(lon1)
  lat2 = radians(lat2)
  lon2 = radians(lon2)

  d_lat = lat2 - lat1
  d_lon = lon2 - lon1

  a = math.sin(d_lat / 2) * math.sin(d_lat / 2) + math.cos(lat1) * math.cos(lat2) * math.sin(d_lon / 2) * math.sin(d_lon / 2)
  c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

  return earth_radius * c

def radians(angle: float) -> float:
  """
  Converts degrees to radians.

  Args:
      angle: Angle in degrees (float).

  Returns:
      Angle in radians (float).
  """
  return (angle * math.pi) / 180

if __name__ == '__main__':
  # Sample data for testing (replace with actual data)
  data = {
    'origin': {'latitude': -33.88516, 'longitude': 18.51747},
    'destination': {'latitude': -33.88310, 'longitude': 18.51044},
    'encoded_polyline': 'feymEeu_pB|dApl@kLpk@mdAem@',
  }

  response = get_directions(data)
  print(response)  # Output: {'url': 'https://www.google.com/maps/dir/...'}
