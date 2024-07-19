import osmnx as ox
import networkx as nx
from shapely.geometry import LineString
import urllib.parse
from typing import List, Dict, Union, Optional
from dataclasses import dataclass
from collections import defaultdict
from functools import lru_cache
from math import radians, sin, cos, sqrt, atan2
import concurrent.futures
from supabase import create_client, Client
import asyncio
import aiohttp


supabase_url = "https://cbkorawwmcaodhiakigh.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNia29yYXd3bWNhb2RoaWFraWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzMTg1MDIsImV4cCI6MjAzNTg5NDUwMn0.gnsux_t7TW0bBdpu2pH1dI09GAKrbvAk75ffF0Jgqyc"

@dataclass
class Info:
    source: List[float]
    destination: List[float]
    travel_type: str
    polyline: str
    waypoints: List[List[float]]
    distance: float
    google_deeplink: str
    trip_summary: Optional[Dict[str, Union[int, bool, float]]] = None

    def to_dict(self) -> Dict:
        return {
            "source": self.source,
            "destination": self.destination,
            "travelType": self.travel_type,
            "polyline": self.polyline,
            "waypoints": self.waypoints,
            "distance": self.distance,
            "google_deeplink": self.google_deeplink,
            "trip_summary": self.trip_summary or {}
        }

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
    trip_data: Info = None

@lru_cache(maxsize=1)
def get_cached_graph(source, destination, mode='drive'):
    # ... (keep the existing get_graph_between_points function, but rename it)
    # This function will now be cached for repeated use
    G = get_graph_between_points(source, destination, mode)
    # Convert MultiGraph to Graph
    G = nx.Graph(G)
    return G

@lru_cache(maxsize=32)
def get_graph_between_points(source, destination, mode='drive'):
    # Calculate distance between points
    def haversine_distance(lat1, lon1, lat2, lon2):
        R = 6371  # Earth's radius in kilometers
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        return R * c

    distance = haversine_distance(source[0], source[1], destination[0], destination[1])

    # Adjust buffer, network type, and custom filter based on distance and mode
    if distance < 5:  # Less than 5 km
        buffer = 0.002
        network_type = "all" if mode == 'walk' else "drive"
        custom_filter = '["highway"~"primary|secondary|tertiary|residential|path|footway|cycleway"]'
    elif distance < 20:  # 6-20 km
        buffer = 0.005
        network_type = "all" if mode == 'walk' else "drive"
        custom_filter = '["highway"~"motorway|trunk|primary|secondary|tertiary|residential"]'
    elif distance < 40:  # 21-40 km
        buffer = 0.01
        network_type = "drive"
        custom_filter = '["highway"~"motorway|trunk|primary|secondary"]'
    else:  # More than 20 km
        buffer = 0.02
        network_type = "drive_service"
        custom_filter = '["highway"~"motorway|trunk|primary"]'

    # Calculate bounding box
    north = max(source[0], destination[0]) + buffer
    south = min(source[0], destination[0]) - buffer
    east = max(source[1], destination[1]) + buffer
    west = min(source[1], destination[1]) - buffer

    # Adjust the level of detail based on distance
    if distance > 50:  # For very long distances, use a simplified graph
        simplify = True
        retain_all = False
    else:
        simplify = True
        retain_all = True

    # Get the graph with custom filter
    G = ox.graph_from_bbox(north, south, east, west, network_type=network_type, 
                           custom_filter=custom_filter, simplify=simplify, retain_all=retain_all)

    # For walking mode and short distances, we might want to include additional data
    if mode == 'walk' and distance < 5:
        G = ox.add_edge_speeds(G)
        G = ox.add_edge_travel_times(G)

    return G

def get_shortest_paths(G, origin, destination, num_paths=10):
    origin_node = ox.distance.nearest_nodes(G, Y=origin[0], X=origin[1])
    destination_node = ox.distance.nearest_nodes(G, Y=destination[0], X=destination[1])
    
    paths = []
    for path in nx.shortest_simple_paths(G, origin_node, destination_node, weight="length"):
        paths.append(path)
        if len(paths) == num_paths:
            break
    return paths

def encode_polyline(coords, precision=5):
    def encode_number(num):
        num = int(round(num * 10 ** precision))
        num = num << 1 if num >= 0 else ~(num << 1)
        chunks = []
        while num >= 0x20:
            chunks.append((0x20 | (num & 0x1f)) + 63)
            num >>= 5
        chunks.append(num + 63)
        return ''.join(chr(c) for c in chunks)

    result = []
    prev_lat, prev_lng = 0, 0
    for lat, lng in coords:
        result.append(encode_number(lat - prev_lat))
        result.append(encode_number(lng - prev_lng))
        prev_lat, prev_lng = lat, lng
    return ''.join(result)

def create_google_maps_deeplink(origin, destination, formatted_waypoints=None, travel_mode="driving"):
    base_url = "https://www.google.com/maps/dir/?api=1"
    params = {
        "origin": f"{origin[0]},{origin[1]}",
        "destination": f"{destination[0]},{destination[1]}",
        "travelmode": travel_mode,
    }
    if formatted_waypoints:
        params["waypoints"] = formatted_waypoints
    
    query_string = urllib.parse.urlencode(params, safe=",")
    return f"{base_url}&{query_string}"

def create_trip(osmids: List[Union[str, int]], supabase):
    osmids = [str(osmid) for osmid in osmids]
    trip = DBTrip(legs=osmids)
    osmids_query = f"{{{'{'}{','.join(osmids)}{'}'}}}"
    response = supabase.table('crime_data').select('*').filter('osmid', 'ov', osmids_query).execute()

    max_values = defaultdict(int)
    for crime_data in response.data:
        for attr, value in crime_data.items():
            if attr != 'osmid' and hasattr(trip, attr):
                max_values[attr] = max(max_values[attr], value or 0)

    for attr, value in max_values.items():
        setattr(trip, attr, value)

    trip.total_crime_count = sum(value for attr, value in trip.__dict__.items() 
                                 if attr not in ['legs', 'total_crime_count', 'load_shedding', 'danger_score', 'trip_data'])
    return trip


@lru_cache(maxsize=1)
def get_max_score(crime_weights_tuple):
    return sum(10 * weight for _, weight in crime_weights_tuple) + 10

def dangerScore(trip, is_walking):
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

    raw_score = sum(getattr(trip, crime_type, 0) * weight 
                    for crime_type, weight in crime_weights.items()) + trip.load_shedding

    crime_weights_tuple = tuple(crime_weights.items())
    max_score = get_max_score(crime_weights_tuple)
    
    return min(100, (raw_score / max_score) * 100)

def process_path(G, path, source, destination, navigation_type, supabase):
    osmids = []
    for i in range(len(path) - 1):
        edge_data = G.get_edge_data(path[i], path[i+1])
        if edge_data and 'osmid' in edge_data:
            osmids.append(edge_data['osmid'])
        else:
            osmids.append(None)  # or some default value if osmid is not available

    trip = create_trip(osmids, supabase)
    trip.danger_score = dangerScore(trip, is_walking=(navigation_type == 'walk'))
    
    polyline = LineString([G.nodes[node]['y'], G.nodes[node]['x']] for node in path)
    encoded_polyline = encode_polyline(polyline.coords)
    waypoints = "|".join(f"{G.nodes[node]['y']},{G.nodes[node]['x']}" for node in path[1:-1])
    deeplink = create_google_maps_deeplink(source, destination, waypoints)
    
    distance = sum(G[path[i]][path[i+1]].get('length', 0) for i in range(len(path)-1))
    
    trip_summary_info = {
        "total_crimes": trip.total_crime_count,
        "power_outage_in_route": trip.load_shedding,
        "distance": distance,
        "risk_score": trip.danger_score
    }
    
    trip.trip_data = Info(
        source=list(source),
        destination=list(destination),
        travel_type=navigation_type,
        polyline=encoded_polyline,
        waypoints=[list(coord) for coord in polyline.coords],
        distance=distance,
        google_deeplink=deeplink,
        trip_summary=trip_summary_info
    )
    return trip

def request(source, destination, navigation_type='drive'):
    G = get_cached_graph(source, destination, navigation_type)
    paths = get_shortest_paths(G, source, destination, num_paths=10)
    
    supabase = create_client(supabase_url, supabase_key)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        future_to_path = {executor.submit(process_path, G, path, source, destination, navigation_type, supabase): path for path in paths}
        trips = []
        for future in concurrent.futures.as_completed(future_to_path):
            trips.append(future.result())

    return sorted(trips, key=lambda t: t.danger_score)[:4]

def main():
    # source = (-26.077702, 27.950062)
    # destination = (-26.081334, 27.935728)
    # destination = (-26.112641, 27.914288) # friend
    # safest_trips = request(source, destination)

    discovery = (-26.113180, 28.053153)
    wits = (-26.193034, 28.033049)

    safest_trips = request(discovery, wits, navigation_type='walk')
    for trip in safest_trips:
        print(trip.trip_data.to_dict())
        print()

if __name__ == "__main__":
    main()