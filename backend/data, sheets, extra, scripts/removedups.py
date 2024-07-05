import json

def remove_duplicate_street_names(input_file, output_file):
    # Load the GeoJSON file
    with open(input_file, 'r') as file:
        data = json.load(file)

    # Check if the data has the required structure
    if 'features' not in data or not isinstance(data['features'], list):
        print("Invalid GeoJSON structure: 'features' list is missing or not a list")
        return

    # Assuming the structure contains features with street names in a property
    unique_street_names = set()
    unique_features = []

    for feature in data['features']:
        street_name = feature['properties'].get('STR_NAME')
        if street_name and street_name not in unique_street_names:
            unique_street_names.add(street_name)
            unique_features.append(feature)

    # Create a new GeoJSON structure with unique features
    unique_data = {
        "type": "FeatureCollection",
        "features": unique_features
    }

    # Save the new GeoJSON file
    with open(output_file, 'w') as file:
        json.dump(unique_data, file, indent=4)

    print(f"Unique entries have been saved to {output_file}")

# Usage
input_file = 'Street_Name.geojson'  # Replace with your input file path
output_file = 'Unique_Street_Name.geojson'  # Replace with your desired output file path
remove_duplicate_street_names(input_file, output_file)
