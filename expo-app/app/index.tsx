import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { IconButton, Button, useTheme, ActivityIndicator, Divider, Card } from "react-native-paper";
import MapView, { Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";
import { useToast } from "react-native-paper-toast";
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MainPage = () => {
  const [mode, setMode] = useState('drive');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setRoutes, routes, destination } = useContext(NavigationContext);
  const toaster = useToast();

  const [region, setRegion] = useState({
    latitude: -33.918861,
    longitude: 18.4233,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [destinationName, setDestinationName] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const apiKey = await getGoogleMapsApiKey();
        Geocoder.init(apiKey);
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          toaster.show({
            message: "Location permission denied",
            type: "error",
          });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (destination) {
      setDestinationName(destination);
      setSearchPerformed(true);
      fetchRoute(currentLocation, destination);
    }
  }, [destination]);

  const fetchRoute = async (origin, destination) => {
    if (!origin || !destination) return;
    try {
      setLoading(true);
      const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination}&key=${await getGoogleMapsApiKey()}`);
      if (response.data.status === 'OK') {
        const route = response.data.routes[0];
        const routeData = {
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          polyline: route.overview_polyline.points,
          arrivalTime: new Date(Date.now() + route.legs[0].duration.value * 1000).toLocaleTimeString(),
          color: 'Green'  // or 'Blue' or 'Purple' based on your logic
        };
        setRoutes([routeData]);
        setDestinationCoords({
          latitude: route.legs[0].end_location.lat,
          longitude: route.legs[0].end_location.lng,
        });
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchPage' as never);
  };

  const decodePolyline = (encoded) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="menu" onPress={() => {}} />
        <Text style={styles.headerText}>{destinationName || "Select Destination"}</Text>
      </View>

    <View style={styles.segmentedButtons}>
  {[
    { mode: 'walk', icon: 'walk', label: 'Walking' },
    { mode: 'train', icon: 'train', label: 'Transit' },
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
</View>

      {searchPerformed && (
        <View style={styles.routesContainer}>
          <ScrollView horizontal contentContainerStyle={styles.routesScrollView}>
            {routes && routes.map((route, index) => (
              <React.Fragment key={index}>
                <View style={[styles.routeBox, styles[`routeBox${route.color}`]]}>
                  <Text style={styles.routeTime}>{route.duration}</Text>
                  <Text style={styles.routeDistance}>{route.distance}</Text>
                  <Text style={styles.routeArrival}>Arrive at {route.arrivalTime}</Text>
                </View>
                 <View style={[styles.routeBox, styles[`routeBox${route.color}`]]}>
                  <Text style={styles.routeTime}>{route.duration}</Text>
                  <Text style={styles.routeDistance}>{route.distance}</Text>
                  <Text style={styles.routeArrival}>Arrive at {route.arrivalTime}</Text>
                </View>
                 <View style={[styles.routeBox, styles[`routeBox${route.color}`]]}>
                  <Text style={styles.routeTime}>{route.duration}</Text>
                  <Text style={styles.routeDistance}>{route.distance}</Text>
                  <Text style={styles.routeArrival}>Arrive at {route.arrivalTime}</Text>
                </View>
                {index < routes.length - 1 && <Divider />}
              </React.Fragment>
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
          <Polyline
            key={index}
            coordinates={decodePolyline(route.polyline)}
            strokeWidth={3}
            strokeColor="blue"  // Adjust color as needed
          />
        ))}
      </MapView>

      {loading && <ActivityIndicator style={styles.loadingIndicator} animating={true} color={colors.primary} />}
      {showRoutes && (
        <RouteRecommendations 
          onClose={() => setShowRoutes(false)} 
          onRouteSelect={() => {}}
        />
      )}

      <Button
        mode="contained"
        icon={searchPerformed ? "navigation" : "magnify"}
        onPress={handleSearchPress}
        style={styles.actionButton}
      >
        {searchPerformed ? 'Start Navigation' : 'Search'}
      </Button>
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
    padding: 10,
    backgroundColor: '#3f51b5',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  routeArrival: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
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
});

export default MainPage;
