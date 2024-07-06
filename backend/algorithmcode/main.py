import requests
import json
import csv
from html import unescape
from google.cloud import storage

class Route:
    def __init__(self):
        self.streets = []
        self.incident_count = 0
        self.load_shedding_count = 0
        self.distance = 0
        self.polyline = ""

    def add_street(self, street_name, crime_number, load_shedding_status):
        self.streets.append(street_name)
        self.incident_count += crime_number
        self.load_shedding_count += load_shedding_status

    def set_distance(self, distance):
        self.distance = distance
    
    def set_polyline(self, polyline):
        self.polyline = polyline

def get_routes(api_key, start_coords, end_coords):
    url = "https://routes.googleapis.com/directions/v2:computeRoutes"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.legs.steps,routes.distanceMeters,routes.polyline.encodedPolyline"
    }

    body = {
        "origin": {
            "location": {
                "latLng": {
                    "latitude": start_coords[0],
                    "longitude": start_coords[1]
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": end_coords[0],
                    "longitude": end_coords[1]
                }
            }
        },
        "travelMode": "DRIVE",
        "computeAlternativeRoutes": True
    }

    response = requests.post(url, headers=headers, data=json.dumps(body))

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Request failed with status code {response.status_code}")
        print(f"Response: {response.text}")
        return None

def extract_street_names(routes, street_data):
    exclude_words = {"DRAAI", "BY", "DIE", "WEG", "LINKS", "EGS"}
    all_street_names = []
    distances = []
    polylines = []
    for route in routes.get('routes', []):
        steps = route.get('legs', [])[0].get('steps', [])
        street_names = []
        for step in steps:
            instructions = step.get('navigationInstruction', {}).get('instructions')
            if instructions:
                instructions_text = unescape(instructions).replace('<b>', '').replace('</b>', '')
                words = instructions_text.split()  # Split the instructions into words
                for word in words:
                    word_upper = word.strip().upper()
                    if word_upper not in exclude_words and word_upper in street_data:
                        street_names.append(word_upper)
        all_street_names.append(street_names)
        distance = route.get('distanceMeters', 0) / 1000  # Convert to kilometers
        distances.append(distance)
        polyline = route.get('polyline', {}).get('encodedPolyline', "")
        polylines.append(polyline)
    return all_street_names, distances, polylines

def read_csv_to_dict(bucket_name, csv_file_path):
    street_data = {}

    # Download the CSV file from Google Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(csv_file_path)
    blob.download_to_filename('/tmp/' + csv_file_path)

    with open('/tmp/' + csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            street_name = row['street_name'].strip().upper()
            street_data[street_name] = {
                'crime_number': int(row['crime_number']),
                'load_shedding_status': int(row['load_shedding_status'])
            }
    return street_data

def analyze_routes(routes, distances, polylines, street_data):
    route_objects = []
    for route, distance, polyline in zip(routes, distances, polylines):
        route_obj = Route()
        route_obj.set_distance(distance)
        route_obj.set_polyline(polyline)
        for street_name in route:
            if street_name in street_data:
                data = street_data[street_name]
                route_obj.add_street(street_name, data['crime_number'], data['load_shedding_status'])
        route_objects.append(route_obj)
    return route_objects

def dangerScore(route, crime_weight=1, load_shedding_weight=1):
    return route.incident_count * crime_weight + route.load_shedding_count * load_shedding_weight

def main(request):
    request_json = request.get_json()

    api_key = request_json['api_key']
    start_coords = request_json['start_coords']
    end_coords = request_json['end_coords']
    bucket_name = request_json['bucket_name']
    csv_file_path = request_json['csv_file_path']

    routes = get_routes(api_key, start_coords, end_coords)

    shortest_route = None
    safest_route = None
    lowest_danger_score = None

    if routes:
        street_data = read_csv_to_dict(bucket_name, csv_file_path)
        all_street_names, distances, polylines = extract_street_names(routes, street_data)
        route_objects = analyze_routes(all_street_names, distances, polylines, street_data)

        for route_number, route in enumerate(route_objects, start=1):
            print(f"Route {route_number}:")
            print(f"Distance: {route.distance:.2f} km")
            print(f"Polyline: {route.polyline}")
            print(f"Streets: {route.streets}")
            print(f"Total Crime Number: {route.incident_count}")
            print(f"Total Load Shedding Count: {route.load_shedding_count}")
            print()

            # Determine the shortest route
            if shortest_route is None or route.distance < shortest_route.distance:
                shortest_route = route
            if safest_route is None or dangerScore(route) < dangerScore(safest_route):
                safest_route = route
                lowest_danger_score = dangerScore(route)

        print("Shortest Route:")
        print(f"Distance: {shortest_route.distance:.2f} km")
        print(f"Polyline: {shortest_route.polyline}")
        print(f"Streets: {shortest_route.streets}")
        print(f"Total Crime Number: {shortest_route.incident_count}")
        print(f"Total Load Shedding Count: {shortest_route.load_shedding_count}")

        print("\nSafest Route:")
        print(f"Distance: {safest_route.distance:.2f} km")
        print(f"Polyline: {safest_route.polyline}")
        print(f"Streets: {safest_route.streets}")
        print(f"Total Crime Number: {safest_route.incident_count}")
        print(f"Total Load Shedding Count: {safest_route.load_shedding_count}")
        print(f"Danger Score: {lowest_danger_score}")

        return {
            'shortest_route': {
                'distance': shortest_route.distance,
                'polyline': shortest_route.polyline,
                'streets': shortest_route.streets,
                'total_crime_number': shortest_route.incident_count,
                'total_load_shedding_count': shortest_route.load_shedding_count
            },
            'safest_route': {
                'distance': safest_route.distance,
                'polyline': safest_route.polyline,
                'streets': safest_route.streets,
                'total_crime_number': safest_route.incident_count,
                'total_load_shedding_count': safest_route.load_shedding_count,
                'danger_score': lowest_danger_score
            }
        }
    else:
        return {"error": "Failed to get routes"}
