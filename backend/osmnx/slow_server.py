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
from flask import Flask, request as flask_request, jsonify
from typing import Dict, List, Optional, Tuple, Union
import osmnx as ox
import networkx as nx
from shapely.geometry import LineString, Point
import urllib.parse
import json
from supabase import create_client
from dataclasses import dataclass
from collections import defaultdict
import random

app = Flask(__name__)

# Example usage
supabase_url = "https://cbkorawwmcaodhiakigh.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNia29yYXd3bWNhb2RoaWFraWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzMTg1MDIsImV4cCI6MjAzNTg5NDUwMn0.gnsux_t7TW0bBdpu2pH1dI09GAKrbvAk75ffF0Jgqyc"


class Info:
    def __init__(
        self,
        source: List[float],
        destination: List[float],
        travel_type: str,
        polyline: str,
        waypoints: List[List[float]],
        distance: float,
        google_deeplink: str,
        trip_summary: Optional[Dict[str, Union[int, bool, float]]] = None
    ):
        self.source = source
        self.destination = destination
        self.travel_type = travel_type
        self.polyline = polyline
        self.waypoints = waypoints
        self.distance = distance
        self.google_deeplink = google_deeplink
        self.trip_summary = trip_summary or {}

    def to_dict(self) -> Dict:
        return {
            "source": self.source,
            "destination": self.destination,
            "travelType": self.travel_type,
            "polyline": self.polyline,
            "waypoints": self.waypoints,
            "distance": self.distance,
            "google_deeplink": self.google_deeplink,
            "trip_summary": self.trip_summary
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict())

    @classmethod
    def from_dict(cls, data: Dict) -> 'Info':
        return cls(
            source=data["source"],
            destination=data["destination"],
            travel_type=data["travelType"],
            polyline=data["polyline"],
            waypoints=data["waypoints"],
            distance=data["distance"],
            google_deeplink=data["google_deeplink"],
            legs=data["legs"],
            trip_summary=data.get("trip_summary")
        )


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
        # only networks accessible by motor vehicle
        graph = ox.graph_from_bbox(
            bbox=(north, south, east, west), network_type="drive")
        return graph

    points_in_graph = are_coordinates_in_graph(
        graph, source, destination) if graph is not None else False

    if graph is None or not points_in_graph:
        graph = get_graph_between_points_helper()
        # print(
            # f"New graph created. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")
    elif graph is not None and points_in_graph:
        pass
        # print(
            # f"Using existing graph. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")
    elif graph is not None and not points_in_graph:
        new_graph = get_graph_between_points_helper()
        graph = nx.compose(graph, new_graph)
        # print(
            # f"Graph composed. Nodes: {len(graph.nodes)}, Edges: {len(graph.edges)}")

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

    # print("Coordinates", point1, point2, "within graph:",
        #   boundary.contains(point1) and boundary.contains(point2))

    # Check if both points are within the graph's boundary
    return boundary.contains(point1) and boundary.contains(point2)


def get_shortest_path_old(G, origin, destination, num_paths=10):
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


def get_shortest_path(G, origin, destination, num_paths=5):
    print("Finding shortest path between", origin, destination)

    if not are_coordinates_in_graph(G, origin, destination):
        return None, {"error": "Coordinates not in graph"}

    origin_node = ox.distance.nearest_nodes(G, Y=origin[0], X=origin[1])
    destination_node = ox.distance.nearest_nodes(G, Y=destination[0], X=destination[1])

    # Get the shortest path
    shortest_path = nx.shortest_path(G, origin_node, destination_node, weight='length')
    
    # Calculate the length of the shortest path
    shortest_length = sum(G[u][v][0]['length'] for u, v in zip(shortest_path[:-1], shortest_path[1:]))

    paths = [shortest_path]
    
    # Generate alternative paths
    for _ in range(num_paths - 1):
        # Randomly remove some edges from the graph
        temp_G = G.copy()
        edges_to_remove = random.sample(list(temp_G.edges()), int(len(temp_G.edges()) * 0.1))  # Remove 10% of edges
        temp_G.remove_edges_from(edges_to_remove)
        
        try:
            alt_path = nx.shortest_path(temp_G, origin_node, destination_node, weight='length')
            alt_length = sum(G[u][v][0]['length'] for u, v in zip(alt_path[:-1], alt_path[1:]))
            
            # Only add the path if it's not too much longer than the shortest path
            if alt_length <= shortest_length * 1.5:  # Allow paths up to 50% longer
                paths.append(alt_path)
        except nx.NetworkXNoPath:
            continue  # If no path found, continue to next iteration

    return paths, {"success": f"Found {len(paths)} paths"}
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
            if data.get('length') is None:
                data['length'] = 0
            return (u, v, data)

    return (0,0, {"distance": 0})


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
        print("Paths:", paths[0])
        # 6. get the osm ids for each leg of the paths
        path_osm_ids = [get_path_osm_ids(G, path) for path in paths]

        # 7. do something with the paths (example add crime and print)
        path_0_osm_ids = path_osm_ids[0]
        first_leg_osm_id = path_0_osm_ids[0]
        add_data_to_edge_by_osm_id(G, first_leg_osm_id, {"crime": "high"})
        edge = get_edge_by_osm_id(G, first_leg_osm_id)
        # print("First leg of the path:", edge)

        # 8. get polylines for a path
        polyline = get_polyline_from_path(G, paths[0])
        encoded_polyline = encode_polyline(polyline)
        # print("Encoded polyline:", encoded_polyline)

        # 9. create a Google Maps deep link
        waypoints = format_waypoints_for_google_maps_deeplink(G, paths[0])
        deeplink = create_google_maps_deeplink(
            origin=f"{source[0]},{source[1]}", destination=f"{destination[0]},{destination[1]}", formatted_waypoints=waypoints)
        # print("Google Maps deep link:", deeplink)


from supabase import create_client
from dataclasses import dataclass, field
from typing import List

@dataclass
class DBTrip:
    legs: List[str]
    theft_out_of_or_from_motor_vehicle: int = 0
    stock_theft: int = 0
    theft_of_motor_vehicle_and_motorcycle: int = 0
    burglary_at_residential_premises: int = 0
    burglary_at_non_residential_premises: int = 0
    murder: int = 0
    common_assault: int = 0
    trio_crime: int = 0
    rape: int = 0
    bank_robbery: int = 0
    robbery_at_residential_premises: int = 0
    assault_with_the_intent_to_inflict_grievous_bodily_harm: int = 0
    truck_hijacking: int = 0
    robbery_of_cash_in_transit: int = 0
    common_robbery: int = 0
    attempted_sexual_offences: int = 0
    attempted_murder: int = 0
    carjacking: int = 0
    sexual_assault: int = 0
    robbery_at_non_residential_premises: int = 0
    contact_sexual_offences: int = 0
    load_shedding: int = 0
    total_crime_count: int = 0
    danger_score: int = 0
    trip_data: Info = 0

    def __str__(self):
        result = [f"Trip with {len(self.legs)} legs:"]
        result.append(f"Total crime count: {self.total_crime_count}")
        result.append(f"Total loadshedding count: {self.load_shedding}")
        for attr, value in self.__dict__.items():
            if attr not in ['legs', 'total_crime_count']:
                result.append(f"{attr.replace('_', ' ').capitalize()}: {value}")
        return "\n".join(result)
    
    def set_danger_score(self, score):
        self.danger_score = score

from collections import defaultdict

def create_trip(osmids: List[Union[str, int]], supabase_url: str, supabase_key: str) -> DBTrip:
    supabase = create_client(supabase_url, supabase_key)

    # Convert all OSMIDs to strings
    osmids = [str(osmid) for osmid in osmids]

    trip = DBTrip(legs=osmids)

    # Create a string representation of the OSMID array for the query
    osmids_query = f"{{{'{'}{','.join(osmids)}{'}'}}}"

    # Make a single query to fetch data for all OSMIDs
    response = supabase.table('crime_data').select('*').filter('osmid', 'ov', osmids_query).execute()

    # Use a defaultdict to accumulate the maximum values for each attribute
    max_values = defaultdict(int)

    for crime_data in response.data:
        for attr, value in crime_data.items():
            if attr != 'osmid' and hasattr(trip, attr):
                max_values[attr] = max(max_values[attr], value or 0)

    # Set the trip attributes to the maximum values
    for attr, value in max_values.items():
        setattr(trip, attr, value)

    # Calculate total crime count
    trip.total_crime_count = sum([getattr(trip, attr) for attr in trip.__dict__ if attr not in ['legs', 'total_crime_count', 'load_shedding']])

    return trip

def get_path_distance_from_osm_ids(G, osm_ids):
    distance = 0
    for osm_id in osm_ids:
        edge = get_edge_by_osm_id(G, osm_id)
        # print("Edge:", edge)
        distance += list(edge)[2].get('length', 0)
    return distance

def dangerScore(trip, is_walking, crime_weights=None, load_shedding_weight=1):
    if crime_weights is None:
        crime_weights = {
            'theft_out_of_or_from_motor_vehicle': 3 if not is_walking else 1,
            'stock_theft': 1,
            'theft_of_motor_vehicle_and_motorcycle': 4 if not is_walking else 1,
            'burglary_at_residential_premises': 2,
            'burglary_at_non_residential_premises': 2,
            'murder': 10,
            'common_assault': 5,
            'trio_crime': 4,
            'rape': 9,
            'bank_robbery': 3,
            'robbery_at_residential_premises': 4,
            'assault_with_the_intent_to_inflict_grievous_bodily_harm': 7,
            'truck_hijacking': 3 if not is_walking else 1,
            'robbery_of_cash_in_transit': 2,
            'common_robbery': 4,
            'attempted_sexual_offences': 6,
            'attempted_murder': 8,
            'carjacking': 6 if not is_walking else 2,
            'sexual_assault': 8,
            'robbery_at_non_residential_premises': 3,
            'contact_sexual_offences': 7
        }

    total_score = 0

    for crime_type, weight in crime_weights.items():
        if hasattr(trip, crime_type):
            total_score += getattr(trip, crime_type) * weight

    total_score += trip.load_shedding * load_shedding_weight

    return total_score

def request(source, destination, navigation_type='drive'):

    G = get_graph_between_points(source, destination)
    path, status = get_shortest_path(G, source, destination, num_paths=10)
    # 5. get the paths
    paths = list(path)
    print("path 0:", path[0])
    # 6. get the osm ids for each leg of the paths
    path_osm_ids = [get_path_osm_ids(G, path) for path in paths]



    trips = []
    # for each path of osm ids, create a trip
    for ids in path_osm_ids:
        trip = create_trip(ids, supabase_url, supabase_key)
        trips.append(trip)
        # print("OSM IDs:", ids)


    for trip in trips:
        # calculate the danger score
        score = dangerScore(trip, is_walking=False)
        trip.set_danger_score(score)

    # sort the trips by danger score
    trips.sort(key=lambda trip: trip.danger_score, reverse=True)

    # take the 4 safest trips
    safest_trips = trips[:4]

    i = 0
    for trip in safest_trips:
        polyline = get_polyline_from_path(G, paths[i])
        encoded_polyline = encode_polyline(polyline)
        waypoints = format_waypoints_for_google_maps_deeplink(G, paths[i])
        deeplink = create_google_maps_deeplink(
            origin=f"{source[0]},{source[1]}", destination=f"{destination[0]},{destination[1]}", formatted_waypoints=waypoints)
        
        trip_summary_info = {
            "total_crimes": trip.total_crime_count,
            "power_outage_in_route": trip.load_shedding,
            "distance": get_path_distance_from_osm_ids(G, path_osm_ids[i]),
            "risk_score": trip.danger_score
        }

        trip_data = Info(
            source=[source[0], source[1]],
            destination=[destination[0], destination[1]],
            travel_type="driving",
            polyline=encoded_polyline,
            waypoints=waypoints,
            distance=trip_summary_info['distance'],
            google_deeplink=deeplink,
            trip_summary=trip_summary_info
        )
        trip.trip_data = trip_data
        i += 1

    # print the safest trips
    for trip in safest_trips:
        # print(trip.trip_data.to_dict())
        print()

    return safest_trips

def main():

    source = (-26.077702, 27.950062)
    destination = (-26.081334, 27.935728)
    # destination = (-25.756415, 28.229561) # pretoria
    request(source, destination)

@app.route('/get_safest_trips', methods=['POST'])
def get_route():
    data = flask_request.json
    source = tuple(data['source'])
    destination = tuple(data['destination'])
    navigation_type = data.get('navigation_type', 'drive')

    try:
        safest_trips = request(source, destination, navigation_type)
        return jsonify([trip.trip_data.to_dict() for trip in safest_trips])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True)

