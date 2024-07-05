import json

def simplify_coordinates(input_file, output_file):
    # Load the GeoJSON file
    with open(input_file, 'r') as file:
        data = json.load(file)

    # Check if the data has the required structure
    if 'features' not in data or not isinstance(data['features'], list):
        print("Invalid GeoJSON structure: 'features' list is missing or not a list")
        return

    # Simplify coordinates
    for feature in data['features']:
        if feature['geometry']['type'] == 'LineString':
            # Keep only the first coordinate
            first_coordinate = feature['geometry']['coordinates'][0]
            feature['geometry']['coordinates'] = [first_coordinate]

    # Save the new GeoJSON file with formatted output
    with open(output_file, 'w') as file:
        file.write('{\n    "type": "FeatureCollection",\n    "features": [\n')
        for i, feature in enumerate(data['features']):
            json.dump(feature, file)
            if i < len(data['features']) - 1:
                file.write(',\n\n')
        file.write('\n    ]\n}')

    print(f"Simplified coordinates have been saved to {output_file}")

# Usage
input_file = 'Unique_Street_Name.geojson'  # Replace with your input file path
output_file = 'Simplified_Street_Name.geojson'  # Replace with your desired output file path
simplify_coordinates(input_file, output_file)
