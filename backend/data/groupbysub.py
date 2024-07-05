import pandas as pd
from geopy.distance import geodesic

# Load the datasets
police_df = pd.read_csv('crime-stats-summary.csv')
streets_df = pd.read_csv('streets.csv')

# Strip any leading/trailing whitespace characters from column names
police_df.columns = police_df.columns.str.strip()
streets_df.columns = streets_df.columns.str.strip()

# Print columns for debugging
print("Police DataFrame Columns:", police_df.columns)
print("Streets DataFrame Columns:", streets_df.columns)

# Function to find the closest police station for a given street
def find_closest_police_station(street_coord, police_df):
    closest_station = None
    min_distance = float('inf')
    for _, police_row in police_df.iterrows():
        police_coord = (police_row['Latitude'], police_row['Longitude'])
        distance = geodesic(street_coord, police_coord).meters
        if distance < min_distance:
            min_distance = distance
            closest_station = police_row
    return closest_station

# Assign each street to the closest police station
street_to_station = []
for _, street_row in streets_df.iterrows():
    street_coord = (street_row['STR_LAT'], street_row['STR_LONG'])
    closest_station = find_closest_police_station(street_coord, police_df)
    street_to_station.append((closest_station['Station'], closest_station['Incidents values'], street_row['STR_NAME']))
    print(f"Street '{street_row['STR_NAME']}' assigned to area '{closest_station['Station']}'")

# Convert to DataFrame
grouped_df = pd.DataFrame(street_to_station, columns=['Area', 'Number_of_Incidents', 'Street_Name'])

# Group by police station
result_df = grouped_df.groupby(['Area', 'Number_of_Incidents'])['Street_Name'].apply(list).reset_index()

# Save the results to a new CSV file
result_df.to_csv('grouped_by_police_station.csv', index=False)

print("Data saved successfully to 'grouped_by_police_station.csv'.")
