import json

def extract_street_names_and_coordinates(input_file, output_file):
    # Load the GeoJSON file
    with open(input_file, 'r') as file:
        data = json.load(file)

    # Check if the data has the required structure
    if 'features' not in data or not isinstance(data['features'], list):
        print("Invalid GeoJSON structure: 'features' list is missing or not a list")
        return

    # Extract street names and coordinates
    extracted_data = []
    for feature in data['features']:
        street_name = feature['properties'].get('STR_NAME')
        coordinates = feature['geometry'].get('coordinates')[0] if feature['geometry']['type'] == 'LineString' else None
        if street_name and coordinates:
            extracted_data.append({"STR_NAME": street_name, "coordinates": coordinates})

    # Save the extracted data to a new file with formatted output
    with open(output_file, 'w') as file:
        for item in extracted_data:
            json.dump(item, file)
            file.write('\n\n')

    print(f"Extracted data have been saved to {output_file}")

# Usage
input_file = 'Simplified_Street_Name.geojson'  # Replace with your input file path
output_file = 'Formatted_Extracted_Street_Names_and_Coordinates.json'  # Replace with your desired output file path
extract_street_names_and_coordinates(input_file, output_file)