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
from shapely.geometry import LineString, Point, box, mapping
import urllib.parse


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


def print_edges(G, num_edges=None):
    """
    Print the edges of the graph.

    Parameters:
    - G (networkx.MultiDiGraph): The OSMnx graph
    - num_edges (int): The number of edges to print
    """
    num_edges = num_edges if num_edges is not None else len(G.edges)

    for i, edge in enumerate(G.edges(data=True)):
        if i == num_edges:
            break
        print(edge)


def get_polyline_from_path(G, path):
    """
    Create a polyline (LineString) from an OSMnx path.
    
    Parameters:
    G (networkx.MultiDiGraph): The OSMnx graph
    path (list): List of node IDs representing the path
    
    Returns:
    shapely.geometry.LineString: The polyline representing the path
    """
    # Get the coordinates for each node in the path
    coords = []
    for node in path:
        # Get the node's data
        node_data = G.nodes[node]
        # Append the (longitude, latitude) coordinates
        coords.append((node_data['y'], node_data['x']))

    # Create a LineString from the coordinates
    polyline = LineString(coords)

    return polyline


def encode_polyline(polyline, precision=5):
    """
    Encode a polyline into the Google Polyline Format.
    
    Parameters:
    polyline (shapely.geometry.LineString): The polyline to encode
    precision (int): The precision of the encoding (default is 5)
    
    Returns:
    str: The encoded polyline string
    """
    def encode_number(num):
        num = int(round(num * 10 ** precision))
        num = num << 1 if num >= 0 else ~(num << 1)
        chunks = []
        while num >= 0x20:
            chunks.append((0x20 | (num & 0x1f)) + 63)
            num >>= 5
        chunks.append(num + 63)
        return ''.join(chr(c) for c in chunks)

    coords = list(polyline.coords)
    result = []
    prev_lat, prev_lng = 0, 0
    for lat, lng in coords:
        result.append(encode_number(lat - prev_lat))
        result.append(encode_number(lng - prev_lng))
        prev_lat, prev_lng = lat, lng
    return ''.join(result)


def polyline_to_geojson(polyline):
    """
    Convert a Shapely LineString to GeoJSON LineString format.
    
    Parameters:
    polyline (shapely.geometry.LineString): The polyline to convert
    
    Returns:
    dict: GeoJSON representation of the LineString
    """
    coordinates = list(polyline.coords)
    for i, coord in enumerate(coordinates):
        coordinates[i] = [coord[0], coord[1]]

    geojson = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates
        },
        "properties": {}
    }

    return geojson


def get_path_osm_ids(G, path):
    """
    Get the OSM IDs for each leg of the path.
    
    Parameters:
    G (networkx.MultiDiGraph): The OSMnx graph
    path (list): List of node IDs representing the path
    
    Returns:
    list: List of OSM IDs for each leg of the path
    """
    leg_osm_ids = []

    # Iterate through the path, looking at pairs of nodes
    for i in range(len(path) - 1):
        start_node = path[i]
        end_node = path[i + 1]

        # Get the edge data between these two nodes
        edge_data = G.get_edge_data(start_node, end_node)

        # There might be multiple edges between two nodes, so we need to handle that
        if edge_data is not None:
            # If there's only one edge, it won't be in a list
            if 0 in edge_data:
                osm_id = edge_data[0].get('osmid')
            else:
                # If there are multiple edges, choose the first one (you might want to modify this logic)
                osm_id = next(iter(edge_data.values())).get('osmid')

            # The osmid might be a list, in which case we'll take the first element
            if isinstance(osm_id, list):
                osm_id = osm_id[0]

            leg_osm_ids.append(osm_id)
        else:
            # If there's no edge data, append None or some placeholder
            leg_osm_ids.append(None)

    return leg_osm_ids


def get_edge_by_osm_id(G, osm_id):
    """
    Get the edge data for a given OSM ID.
    
    Parameters:
    G (networkx.MultiDiGraph): The OSMnx graph
    osm_id (int): The OSM ID of the edge
    
    Returns:
    dict: The edge data
    """
    for u, v, data in G.edges(data=True):
        if data.get('osmid') == osm_id:
            return (u, v, data)

    return None


def add_data_to_edge_by_osm_id(G, osm_id, data):
    """
    Add data to an edge by its OSM ID.
    
    Parameters:
    G (networkx.MultiDiGraph): The OSMnx graph
    osm_id (int): The OSM ID of the edge
    data (dict): The data to add to the edge
    """
    for u, v, edge_data in G.edges(data=True):
        if edge_data.get('osmid') == osm_id:
            edge_data.update(data)
            break



def create_google_maps_deeplink(origin, destination, formatted_waypoints=None, travel_mode="driving", avoid=None):
    base_url = "https://www.google.com/maps/dir/"
    params = {
        "api": 1,
        "origin": origin,
        "destination": destination,
        "travelmode": travel_mode,
        "dir_action": "navigate"
    }
    
    if formatted_waypoints:
        # Join waypoints with pipe character, but don't URL-encode the commas in coordinates
        params["waypoints"] = formatted_waypoints
    
    if avoid:
        params["avoid"] = ",".join(avoid)
    
    # Use safe parameter to preserve commas in coordinates and pipes between waypoints
    query_string = urllib.parse.urlencode(params, safe=",|")
    deeplink = f"{base_url}?{query_string}"
    
    return deeplink


def format_waypoints_for_google_maps_deeplink(G, path):
    """
    Format the waypoints for a Google Maps deep link.

    Parameters:
    - path (list): The path to format

    Returns:
    - str: The formatted waypoints
    """

    waypoints = []
    for i, node in enumerate(path):
        # Get the node's data
        node_data = G.nodes[node]
        # Append the (longitude, latitude) coordinates
        waypoints.append(f"{node_data['y']},{node_data['x']}")

    return "|".join(waypoints)



def example_flow():
    # 1. start by defining the source and destination points as a tuple of (latitude, longitude)
    source = (-26.077702, 27.950062)
    destination = (-26.081334, 27.935728)
    destination = (-25.756415, 28.229561) # pretoria

    # 2. create a graph encompassing the source and destination points
    G = get_graph_between_points(
        source=source, destination=destination, graph=None)

    # 2.1. (optional) add a new point to the graph
    # new_destination = (-25.770344, 27.852952)
    # if you provide a graph, the new point will be added to the existing graph if it's not already there
    # G = get_graph_between_points(source=source, destination=new_destination, graph=G)

    # 3. get the shortest path between the source and destination
    shortest_paths, status = get_shortest_path(
        G, source, destination, num_paths=1)

    # 4. check the status of the operation
    if status.get("error"):
        # handle the error
        pass
    elif status.get("success"):
        # 5. get the paths
        paths = list(shortest_paths)
        # 6. get the osm ids for each leg of the paths
        path_osm_ids = [get_path_osm_ids(G, path) for path in paths]

        # 7. do something with the paths (example add crime and print)
        path_0_osm_ids = path_osm_ids[0]
        first_leg_osm_id = path_0_osm_ids[0]
        add_data_to_edge_by_osm_id(G, first_leg_osm_id, {"crime": "high"})
        edge = get_edge_by_osm_id(G, first_leg_osm_id)
        print("First leg of the path:", edge)

        # 8. get polylines for a path
        polyline = get_polyline_from_path(G, paths[0])
        encoded_polyline = encode_polyline(polyline)
        print("Encoded polyline:", encoded_polyline)

        # 9. create a Google Maps deep link
        waypoints = format_waypoints_for_google_maps_deeplink(G, paths[0])
        deeplink = create_google_maps_deeplink(
            origin=f"{source[0]},{source[1]}", destination=f"{destination[0]},{destination[1]}", formatted_waypoints=waypoints)
        print("Google Maps deep link:", deeplink)



def main():
    example_flow()

if __name__ == "__main__":
    main()
