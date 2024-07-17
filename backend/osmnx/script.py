"""
    1. Install miniconda on linux:
        `mkdir -p ~/miniconda3
        wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
        bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
        rm -rf ~/miniconda3/miniconda.sh`
    2. Activate miniconda: `~/miniconda3/bin/conda init bash` or `~/miniconda3/bin/conda init zsh`
    3. Create the environment `~/miniconda3/bin/conda env create -f environment.yml`
    4. activate the ox environment "~/miniconda3/bin/conda activate ox"
    5. run this script "python script.py"
    6. deactivate ox "~/miniconda3/bin/conda deactivate"
"""
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
import multiprocessing as mp
from shapely.geometry import Point
from shapely.geometry import LineString, Point, box
import random


def get_node_id_from_address(address, G):
    """
    Get the nearest node ID to a given address.

    Parameters:
    - address (str): The address to geocode
    - G (networkx.MultiDiGraph): The OSMnx graph

    Returns:
    - int: The ID of the nearest node to the address
    """
    # Geocode the address
    location = ox.geocode(address)

    if location is None:
        return None, "Address not found"

    # Find the nearest node to the geocoded location
    nearest_node = ox.distance.nearest_nodes(G, location[1], location[0])

    return nearest_node


def get_graph_between_points(source, destination, graph=None):
    """
    Get the graph between two points. If the graph is not provided or the points are not in the graph, a new graph is created.
    If the graph is provided and the points are in the graph, the graph is returned.
    If the graph is provided and the points are not in the graph, a new graph is created and composed with the provided graph.

    Parameters:
    - source (tuple): The source point (lat, lon)
    - destination (tuple): The destination point (lat, lon)

    Returns:
    - networkx.MultiDiGraph: The graph between the two points
    """
    buffer = 0.005  # Adjust this value as needed

    def get_graph_between_points_helper():
        north = max(source[0], destination[0]) + buffer
        south = min(source[0], destination[0]) - buffer
        east = max(source[1], destination[1]) + buffer
        west = min(source[1], destination[1]) - buffer
        # Get the graph for the bounding box
        graph = ox.graph_from_bbox(
            bbox=(north, south, east, west), network_type="all")
        return graph

    points_in_graph = are_coordinates_in_graph(
        graph, source, destination) if graph is not None else False

    if graph is None or not points_in_graph:
        graph = get_graph_between_points_helper()
        print(
            f"New graph created. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")
    elif graph is not None and points_in_graph:
        print(
            f"Using existing graph. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")
    elif graph is not None and not points_in_graph:
        new_graph = get_graph_between_points_helper()
        graph = nx.compose(graph, new_graph)
        print(
            f"Graph composed. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")

    return graph


def are_coordinates_in_graph(graph, coord1, coord2):
    # Get the graph's bounding box
    nodes = list(graph.nodes(data=True))
    lats = [node[1]['y'] for node in nodes]
    lons = [node[1]['x'] for node in nodes]
    north, south, east, west = max(lats), min(lats), max(lons), min(lons)

    # Add a small buffer
    buffer = 0.01  # Adjust this value as needed
    north += buffer
    south -= buffer
    east += buffer
    west -= buffer

    bbox = north, south, east, west

    # Create a polygon from the bounding box
    boundary = ox.utils_geo.bbox_to_poly(bbox=bbox)

    # Create Point objects from the coordinates
    point1 = Point(coord1[1], coord1[0])  # (lon, lat)
    point2 = Point(coord2[1], coord2[0])  # (lon, lat)

    print("Coordinates", point1, point2, "within graph:",
          boundary.contains(point1) and boundary.contains(point2))

    # Check if both points are within the graph's boundary
    return boundary.contains(point1) and boundary.contains(point2)


def get_shortest_path(G, origin, destination, num_paths=5):
    """
    Get the shortest path between two coordinates.

    Parameters:
    - G (networkx.MultiDiGraph): The OSMnx graph
    - origin (tuple): The origin coordinates (lat, lon)
    - destination (tuple): The destination coordinates (lat, lon)
    - num_paths (int): The number of shortest paths to find

    Returns:
    - list: The shortest path between the origin and destination
    - dict: The status of the operation
    """
    print("Finding shortest path between", origin, destination)

    # check if the origin and destination are in the graph
    if not are_coordinates_in_graph(G, origin, destination):
        return None, {"error": "Coordinates not in graph"}

    # Get the nearest nodes to the origin and destination
    origin_node = ox.distance.nearest_nodes(G, Y=origin[0], X=origin[1])
    destination_node = ox.distance.nearest_nodes(
        G, Y=destination[0], X=destination[1])

    # Find the shortest path between the origin and destination
    shortest_path = ox.k_shortest_paths(
        G, origin_node, destination_node, k=num_paths, weight="length")

    return shortest_path, {"success": "Shortest path found"}


def print_edges(G):
    for edge in G.edges(data=True):
        print(edge)


def main():
    source = (-26.077702, 27.950062)  # home
    destination = (-26.081334, 27.935728)  # Curro
    destination2 = (-25.770344, 27.852952)  # Ortho

    G = get_graph_between_points(source=source, destination=destination)
    # G = get_graph_between_points(
    #     source=source, destination=destination2, graph=G)

    # Print graph information
    print(f"Final graph - Nodes: {len(G.nodes)}, Edges: {len(G.edges)}")
    print(
        f"Graph bounds: {ox.utils_geo.bbox_from_point((G.nodes[list(G.nodes)[0]]['y'], G.nodes[list(G.nodes)[0]]['x']), dist=1000)}")

    # Get the shortest path between the source and destination
    shortest_path, status = get_shortest_path(G, source, destination)

    print_edges(G)

    if status.get("error"):
        print(status)
        return
    elif status.get("success"):
        print("Shortest path found")
        # plot the graph with the shortest path highlighted
        fig, ax = ox.plot_graph_routes(
            G, list(shortest_path), route_colors="y", route_linewidth=4, node_size=0)
        plt.show()


if __name__ == "__main__":
    main()
