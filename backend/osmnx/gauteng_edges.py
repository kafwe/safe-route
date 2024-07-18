import osmnx as ox
import pandas as pd

# Define the place for which you want the road networks (Gauteng province, South Africa)
placename = "Gauteng, South Africa"

# List of network types to extract
network_types = ['drive', 'walk']

# Initialize an empty list to store edges GeoDataFrames
all_edges = []

# Loop through each network type
for network_type in network_types:
    # Download the road network data
    graph = ox.graph_from_place(placename, network_type=network_type)

    # Convert the edges to a pandas DataFrame
    edges = ox.graph_to_gdfs(graph, nodes=False, edges=True)

    # Append the edges DataFrame to the list
    all_edges.append(edges)

    # Save edges as a CSV file
    edges.to_csv(f"gauteng_edges{network_type}.csv", index=False)

    print(f"Edges for {network_type} saved to gauteng_edges{network_type}.csv")

# Combine all edges DataFrames into a single DataFrame (optional)
combined_edges = pd.concat(all_edges, ignore_index=True)

# Save combined edges as a CSV file (optional)
combined_edges.to_csv("gauteng_edges_combined.csv", index=False)

print("Combined edges saved to gauteng_edges_combined.csv")