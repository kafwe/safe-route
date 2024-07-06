import googlemaps
from faker import Faker
import random
import json
from datetime import timedelta
import uuid
import pandas as pd

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
        email = f"{name.lower().replace(" ", "")}.{fake.free_email_domain()}"
        user_data = {
            "userId": user_id,
            "name": fake.name(),
            "email": fake.email(),
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
            
            # Check if start location is in any of the crime areas
            in_crime_area = any(area['Station'] in start_location['name'] for area in crime_areas)
            
            # Increase risk score based on incident value of the crime area
            if in_crime_area:
                area_data = next(area for area in crime_areas if area['Station'] in start_location['name'])
                incident_value = area_data['Incidents values']
                risk_score += (incident_value / 1000.0)  # Adjust as needed based on your scenario
            
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

# Generate sample users and trips with random number of trips per user
num_users = 50
min_trips_per_user = 2
max_trips_per_user = 8
users = generate_users_and_trips(num_users, min_trips_per_user, max_trips_per_user)

# Save to JSON file (optional)
with open('firebase_data.json', 'w') as f:
    json.dump(users, f, indent=4)
