import csv
import random

# File names
input_file = 'grouped_by_police_station.csv'
output_file = 'finaldata.csv'

def distribute_crimes_randomly(total_crimes, num_streets):
    """Distribute total crimes randomly among streets, ensuring the sum is equal to total_crimes."""
    if num_streets == 1:
        return [total_crimes]
    
    random_numbers = [random.random() for _ in range(num_streets)]
    total_random = sum(random_numbers)
    scaled_numbers = [num / total_random * total_crimes for num in random_numbers]
    
    # Round to the nearest integer and adjust to ensure the total matches exactly
    rounded_numbers = [round(num) for num in scaled_numbers]
    difference = total_crimes - sum(rounded_numbers)
    
    # Adjust the rounded numbers to account for the rounding difference
    for i in range(abs(difference)):
        index = random.randint(0, num_streets - 1)
        rounded_numbers[index] += 1 if difference > 0 else -1
    
    return rounded_numbers

def assign_load_shedding_status():
    """Assign a load shedding status of 0 (80% of the time) and 1 (20% of the time)."""
    return 0 if random.random() < 0.8 else 1

# Reading the original CSV file
data = []

try:
    with open(input_file, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            area = row['Area']
            crime_number = int(row['Number_of_Incidents'])
            street_names = row['Street_Name'].strip('[]').split(', ')  # Assumes streets are listed as a string array
            street_names = [street.strip("'") for street in street_names]  # Clean the street names
            street_count = len(street_names)
            
            # Distribute crimes randomly among streets
            crime_distribution = distribute_crimes_randomly(crime_number, street_count)
            
            for street, crimes in zip(street_names, crime_distribution):
                load_shedding_status = assign_load_shedding_status()
                data.append({'street_name': street, 'crime_number': crimes, 'load_shedding_status': load_shedding_status})

    # Writing the transformed data to a new CSV file
    with open(output_file, mode='w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['street_name', 'crime_number', 'load_shedding_status']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(data)

    print("Transformation complete. Check the new CSV file.")
except UnicodeDecodeError as e:
    print(f"UnicodeDecodeError encountered: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
