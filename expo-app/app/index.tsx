import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Alert, TouchableOpacity, Linking } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { IconButton, Button, useTheme, ActivityIndicator } from "react-native-paper";
import MapView, { Polyline, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import openMap from 'react-native-open-maps';
import axios from 'axios';
import supabase from "@/lib/supabase/supabaseConfig";
import { TripsContext } from "@/lib/contexts/tripsContext";

const MainPage = () => {
  const [mode, setMode] = useState('drive');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setRoutes, routes, destination } = useContext(NavigationContext);
  
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState({
    latitude: -33.918861,
    longitude: 18.4233,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destinationName, setDestinationName] = useState('');
  const [incidents, setIncidents] = useState<{
    address: string | null;
    carMake: string | null;
    carModel: string | null;
    carYear: number | null;
    description: string | null;
    incidentId: string;
    latitude: number | null;
    licensePlate: string | null;
    location_name: string | null;
    longitude: number | null;
    timestamp: string | null;
    type: string | null;
  }[] | null>([]);
  const { trips } = useContext(TripsContext);

  useFocusEffect(
    React.useCallback(() => {
      // check if the trips context has been updated
      if (trips) {
        
      }
    }, [trips])
  );

  useEffect(() => {
    (async () => {
      Geocoder.init("AIzaSyCuosz_XkI9j-EPgWHnuXDAo1mEMYDEN_k"); // Initialize with your Google Maps API key
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Error", "Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log("Current location:", location.coords);
      setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121,
      });
    })();
  }, []);

  useEffect(() => {
    if (destination) {
      setDestinationName(destination);
      setSearchPerformed(true);
      // fetchRoute(currentLocation, destination);
      fetchRouteNew(currentLocation, destination);
    }
  }, [destination]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('incidents').select();
      setIncidents(data);
    })();
  }, []);

  useEffect(() => {
    const fetchIncidents = async () => {
      const { data, error } = await supabase.from('incidents').select();
      setIncidents(data);
    };

    fetchIncidents();
  }, []);

  const fetchRoute = async (origin, destination) => {
    if (!origin || !destination) return;
    try {
      setLoading(true);

      // Convert the destination to coordinates using Geocoder
      const response = await Geocoder.from(destination);
      const destinationCoords = response.results[0].geometry.location;

      // Prepare request body for the custom API
      const body = {
        api_key: "AIzaSyCuosz_XkI9j-EPgWHnuXDAo1mEMYDEN_k",
        start_coords: [origin.latitude, origin.longitude],
        end_coords: [destinationCoords.lat, destinationCoords.lng],
        bucket_name: "gcf-sources-1036555436109-europe-west2",
        csv_file_path: "finaldata.csv",
        crime_weight: 1,
        load_shedding_weight: 1
      };

      // Call the custom API
      const apiResponse = await axios.post(
        'https://europe-west2-gradhack-2024-the-cookout.cloudfunctions.net/my_route_function',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the API response for debugging
      // console.log("API Response:", apiResponse.data);

      // Create routes array
      const routes = [
        {
          duration: "N/A", // API doesn't provide duration
          distance: apiResponse.data.safest_route.distance,
          summary: "Safest Route",
          polyline: apiResponse.data.safest_route.polyline,
          color: 'Green',
          dangerScore: apiResponse.data.safest_route.danger_score,
          crimeNumber: apiResponse.data.safest_route.total_crime_number,
          loadSheddingCount: apiResponse.data.safest_route.total_load_shedding_count,
        },
        {
          duration: "N/A", // API doesn't provide duration
          distance: apiResponse.data.shortest_route.distance,
          summary: "Shortest Route",
          polyline: apiResponse.data.shortest_route.polyline,
          color: 'Blue',
          dangerScore: "N/A", // Not provided for shortest route
          crimeNumber: apiResponse.data.shortest_route.total_crime_number,
          loadSheddingCount: apiResponse.data.shortest_route.total_load_shedding_count,
        }
      ];

      setRoutes(routes);
      setDestinationCoords({
        latitude: destinationCoords.lat,
        longitude: destinationCoords.lng,
      });

    } catch (error) {
      console.error("Error fetching route data:", error);
      Alert.alert("Error", "Failed to fetch route data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteNew = async (origin, destination) => {
    const polyLineColors = [
      "#FF6347", // Tomato
      "#4682B4", // Steel Blue
      "#32CD32", // Lime Green
      "#FF69B4", // Hot Pink
      "#40E0D0", // Turquoise
      "#FFA07A", // Light Salmon
      "#9370DB", // Medium Purple
      "#FFD700"  // Gold
    ]    

    if (!origin || !destination) return;
    try {
      setLoading(true);

      const routes = [];

      let i = 0;
      for (const trip of trips) {

        routes.push({
          duration: "N/A", // API doesn't provide duration
          distance: trip.distance,
          summary: "Safe Route",
          polyline: trip.polyline,
          color: polyLineColors[i++],
          dangerScore: trip.trip_summary.risk_score,
          crimeNumber: trip.trip_summary.total_crimes,
          loadSheddingCount: trip.trip_summary.power_outage_in_route,
          deepLink: trip.google_deeplink
        });
      }

      // order the routes by risk score
      routes.sort((a, b) => a.dangerScore - b.dangerScore);

      setRoutes(routes);
      setDestinationCoords({
        latitude: trips[0].destination[0],
        longitude: trips[0].destination[1],
      });

    } catch (error) {
      console.error("Error fetching route data:", error);
      Alert.alert("Error", "Failed to fetch route data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchPage' as never);
  };

  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1E5,
        longitude: lng / 1E5
      });
    }
    return points;
  };

  const openGoogleMaps = () => {
    if (currentLocation && destinationCoords) {
      console.log("Opening Google Maps with coordinates:");
      console.log("Start:", currentLocation);
      console.log("End:", destinationCoords);

      // openMap({
      //   start: `${currentLocation.latitude},${currentLocation.longitude}`,
      //   end: `${destinationCoords.latitude},${destinationCoords.longitude}`,
      //   travelType: mode,
      // });

      Linking.openURL(trips[0].google_deeplink);
    } else {
      Alert.alert("Error", "No destination coordinates available.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {searchPerformed ? <View style={styles.header}>
        <IconButton icon="undo" iconColor="white" onPress={() => {
          setRoutes(null);
          // setDestinationName('');
          setSearchPerformed(false);
        }} style={{
          color: 'black',
        }} /> 
        <Text style={styles.headerText}>{destinationName || "Select Destination"}</Text>
      </View>: null}

      {/* <View style={styles.segmentedButtons}>
        {[
          { mode: 'walk', icon: 'walk', label: 'Walking' },
          { mode: 'drive', icon: 'car', label: 'Driving' }
        ].map((option) => (
          <Button
            key={option.mode}
            mode={mode === option.mode ? "contained" : "outlined"}
            onPress={() => setMode(option.mode)}
            icon={({ size, color }) => (
              <MaterialCommunityIcons name={option.icon} size={size} color={color} />
            )}
            style={styles.segmentButton}
          >
            {option.label}
          </Button>
        ))}
      </View> */}

      {searchPerformed && (
        <View style={styles.routesContainer}>
          <ScrollView horizontal contentContainerStyle={styles.routesScrollView}>
            {routes && routes.map((route, index) => (
              <TouchableOpacity key={index} style={[styles.routeBox, styles[`routeBox${route.color}`]]} activeOpacity={1} onPress={
                // open deep link
                () => {
                  Linking.openURL(route.deepLink);
                }
              }>
                <Text style={{...styles.routeTime, color: route.color}}>{route.summary}</Text>
                <Text style={styles.routeDistance}>{Math.round((route.distance/1000)*100)/100} km</Text>
                {route.dangerScore !== "N/A" && (
                  <Text style={styles.routeInfo}>Danger Score: {route.dangerScore}</Text>
                )}
                <Text style={styles.routeInfo}>Crimes: {route.crimeNumber}</Text>
                <Text style={styles.routeInfo}>Load Shedding: {route.loadSheddingCount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {routes && routes.map((route, index) => (
          route.polyline ? (
            <Polyline
              key={index}
              coordinates={decodePolyline(route.polyline)}
              strokeWidth={3}
              strokeColors={[route.color]}
              onPress={() => {
                Linking.openURL(route.deepLink);
              }}
            />
          ) : null
        ))}
        {incidents && incidents.map((incident, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: incident.latitude || 0,
              longitude: incident.longitude || 0,
            }}
            title={incident.type || "Unknown"}
            description={incident.description || ""}
          />
        ))}
      </MapView>

      {loading && <ActivityIndicator style={styles.loadingIndicator} animating={true} color={colors.primary} />}

      <Button
        mode="contained"
        icon={searchPerformed ? "navigation" : "magnify"}
        onPress={searchPerformed ? openGoogleMaps : handleSearchPress}
        style={styles.actionButton}
      >
        {searchPerformed ? 'Start Navigation' : 'Search'}
      </Button>

      <View style={styles.reportButton}>
        <IconButton
          icon="alert-octagon"
          iconColor={colors.error}
          size={40}
          onPress={() => navigation.navigate('report' as never)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#3f51b5',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    minHeight: 40,
    maxWidth: '80%',
  },
  segmentedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  routesContainer: {
    paddingVertical: 10,
  },
  routesScrollView: {
    paddingHorizontal: 10,
  },
  routeBox: {
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  routeBoxGreen: {
    backgroundColor: '#b0e57c',
  },
  routeBoxBlue: {
    backgroundColor: '#7fcaff',
  },
  routeBoxPurple: {
    backgroundColor: '#d4aaff',
  },
  routeTime: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  routeDistance: {
    fontSize: 16,
    color: '#666666',
  },
  map: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  actionButton: {
    margin: 10,
    paddingVertical: 8,
  },
  reportButton: {
    position: "absolute",
    bottom: 120,
    right: 10,
  },
});

export default MainPage;
