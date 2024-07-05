import requests
import json

def get_routes(api_key, start_coords, end_coords):
    url = "https://routes.googleapis.com/directions/v2:computeRoutes"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.legs.steps"
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

def extract_street_names(routes):
    all_street_names = []
    for route in routes.get('routes', []):
        steps = route.get('legs', [])[0].get('steps', [])
        street_names = []
        for step in steps:
            instructions = step.get('navigationInstruction', {}).get('instructions')
            if instructions:
                # Extract street names from the instructions
                street_names.append(instructions)
        all_street_names.append(street_names)
    return all_street_names

if __name__ == "__main__":
    # Replace with your actual API key
    api_key = "redacted"

    # Example coordinates
    start_coords = (-34.00571956902123, 18.475301232776673)  # San Francisco, CA
    end_coords = (-34.00959065881407, 18.592188755314048) 
  # Los Angeles, CA

    routes = get_routes(api_key, start_coords, end_coords)
    if routes:
        all_street_names = extract_street_names(routes)
        for route_number, street_names in enumerate(all_street_names, start=1):
            print(f"Route {route_number}:")
            for street in street_names:
                print(street)
            print()
    else:
        print("Failed to get routes")
