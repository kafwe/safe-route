import googlemaps
from faker import Faker
import random
import json
from datetime import timedelta
import uuid
import pandas as pd
from geopy.distance import geodesic
from geopy.point import Point
import geopy.distance


# Initialize Faker and Google Maps client
fake = Faker()
gmaps = googlemaps.Client(key='AIzaSyBoBRKnm25Hz_A0TjmvmNdEEJ48LxFLZS8')

car_makes = ["Toyota", "Ford", "BMW", "Mercedes", "Volkswagen"]
car_models = {
    "Toyota": ["Corolla", "Fortuner", "RAV4"],
    "Ford": ["Focus", "Fiesta"],
    "BMW": ["X5", "3 Series", "5 Series"],
    "Mercedes": ["C-Class", "E-Class", "GLA"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Polo"],
    "Audi": ["A3", "A4", "Q5" , "Q7"],
    "Honda": ["Civic", "Accord", "CR-V"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe"],
    "Kia": ["Rio", "Soul", "Sportage"],
    "Nissan": ["Sentra", "Altima", "Qashqai"],
    "Chevrolet": ["Spark", "Cruze",],
    "Mazda": ["3", "6", "CX-5"],
}

# Read crime areas data from CSV
crime_areas_df = pd.read_csv('crime-stats-summary.csv')

# Convert dataframe to a dictionary for easy access
crime_areas = crime_areas_df.to_dict(orient='records')

def generate_random_location_within_cape_town():
    # Use Google Places API to find a random place within Cape Town
    places_result = gmaps.places_nearby(
        location={"lat": -33.9249, "lng": 18.4241}, # Cape Town's approximate center
        radius=30000, # 30 km radius
        type='point_of_interest' # You can change the type as needed
    )
    place = random.choice(places_result['results'])
    return {
        "latitude": place['geometry']['location']['lat'],
        "longitude": place['geometry']['location']['lng'],
        "name": place['name'],
        "address": place['vicinity']
    }



def generate_users_and_trips(num_users, min_trips_per_user, max_trips_per_user):
    users = []
    for _ in range(num_users):
        user_id = str(uuid.uuid4())
        num_trips = random.randint(min_trips_per_user, max_trips_per_user)
        car_make = random.choice(car_makes)
        name = fake.name()
        email = f"{name.lower().replace(' ', '')}.{fake.free_email_domain()}"

        user_data = {
            "userId": user_id,
            "name": name,
            "email": email,
            "carMake": car_make,
            "carModel": random.choice(car_models[car_make]),
            "carYear": fake.year(),
            "licensePlate": fake.license_plate(),
            "trips": []
        }
        
        for _ in range(num_trips):
            trip_id = str(uuid.uuid4())
            start_location = generate_random_location_within_cape_town()
            end_location = generate_random_location_within_cape_town()
            start_time = fake.date_time_this_year()
            duration = random.randint(5, 120)  # Duration between 5 minutes to 2 hours
            end_time = start_time + timedelta(minutes=duration)
            distance = round(random.uniform(1, 50), 2)  # Distance between 1 to 50 km
            risk_score = round(random.uniform(0, 10), 2)  # Risk score between 0 to 10
                        
            trip_data = {
                "tripId": trip_id,
                "startLocation": start_location,
                "endLocation": end_location,
                "startTime": start_time.isoformat(),
                "endTime": end_time.isoformat(),
                "distance": distance,
                "duration": duration,
                "riskScore": risk_score,
                "incidents": []
            }
            user_data["trips"].append(trip_data)
        
        users.append(user_data)
    
    return users


def is_location_in_crime_area(location):
    for area in crime_areas:
        crime_location = (area['Latitude'], area['Longitude'])
        location_point = (location['latitude'], location['longitude'])
        distance = geodesic(crime_location, location_point).km
        if distance <= 1:  # Assuming a 1 km radius for crime area
            return area
    return None


def generate_location_near_crime_area(crime_area, radius_km=1):
    base_location = Point(crime_area['Latitude'], crime_area['Longitude'])
    random_distance = random.uniform(0, radius_km)
    random_bearing = random.uniform(0, 360)
    destination = geopy.distance.distance(kilometers=random_distance).destination(base_location, random_bearing)
    
    # Reverse geocoding to get a place name and address
    reverse_geocode_result = gmaps.reverse_geocode((destination.latitude, destination.longitude))
    if reverse_geocode_result:
        location_name = reverse_geocode_result[0]['formatted_address']
        address = reverse_geocode_result[0]['formatted_address']
    else:
        location_name = crime_area['Station']
        address = f"{crime_area['Station']} area"
    
    return {
        "latitude": destination.latitude,
        "longitude": destination.longitude,
        "name": location_name,
        "address": address
    }
def generate_incidents(num_incidents):
    incidents = []
    for _ in range(num_incidents):
        incident_id = str(uuid.uuid4())
        
        # Select a high-crime area based on incidents value to generate incident locations
        high_crime_area = random.choices(
            crime_areas,
            weights=[area['Incidents values'] for area in crime_areas],
            k=1
        )[0]
        
        incident_location = generate_location_near_crime_area(high_crime_area)
        
        timestamp = fake.date_time_this_year().isoformat()
        description = fake.text(max_nb_chars=100)
        car_make = random.choice(car_makes)
        car_model = random.choice(car_models[car_make])
        car_year = fake.year()
        license_plate = fake.license_plate()
        
        incident_data = {
            "incidentId": incident_id,
            "type": random.choice(["Carjacking", 
                                           "Theft out of or from motor vehicle", 
                                           "Murder", 
                                           "Theft of motor vehicle and motorcycle"]),
            "location": incident_location,
            "timestamp": timestamp,
            "description": description,
            "carMake": car_make,
            "carModel": car_model,
            "carYear": car_year,
            "licensePlate": license_plate
        }
        
        incidents.append(incident_data)
                
    return incidents

# Generate sample users and trips with random number of trips per user
num_users = 50
min_trips_per_user = 2
max_trips_per_user = 15
users = generate_users_and_trips(num_users, min_trips_per_user, max_trips_per_user)
incidents = generate_incidents(100)

# Save to JSON file (optional)
with open('user_data.json', 'w') as f:
    json.dump(users, f, indent=4)

with open('incident_data.json', 'w') as f:
    json.dump(incidents, f, indent=4)
