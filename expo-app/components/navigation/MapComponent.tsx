import React, { useRef, useEffect, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import { NavigationContext } from "./NavigationContext";
import { useTheme } from "react-native-paper";
import Constants from 'expo-constants';

interface MapComponentProps {
  userLoc?: { latitude: number; longitude: number };
  resultsArr?: { coords: { latitude: number; longitude: number }; title: string }[];
  locationChosen?: () => void;
  locationDeChosen?: () => void;
  mode?: number;
  destinationCoords: { latitude: number; longitude: number } | null;
  setDestinationCoords: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number } | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GOOGLE_MAPS_API_KEY ="AIzaSyDPzWN903NrP9Yac5m-Th9SJ3z847pkAbU"

const MapComponent: React.FC<MapComponentProps> = ({
  userLoc = { latitude: -33.918861, longitude: 18.4233 }, // Cape Town, South Africa
  resultsArr,
  locationChosen,
  locationDeChosen,
  mode,
  destinationCoords,
  setDestinationCoords,
  loading,
  setLoading,
}) => {
  const mapRef = useRef<MapView>(null);
  const context = useContext(NavigationContext);
  const { colors } = useTheme();

  if (!context) {
    throw new Error('MapComponent must be used within a NavigationProvider');
  }

  const { destination, routes } = context;

  useEffect(() => {
    Geocoder.init(GOOGLE_MAPS_API_KEY);  // Initialize Geocoder
  }, []);

  useEffect(() => {
    if (destination) {
      handleDestinationSearch(destination);
    }
  }, [destination]);

  const handleDestinationSearch = (destination: string) => {
    setLoading(true);
    Geocoder.from(destination)
      .then((json) => {
        const location = json.results[0].geometry.location;
        setDestinationCoords({
          latitude: location.lat,
          longitude: location.lng,
        });
      })
      .catch((error) => console.warn(error))
      .finally(() => setLoading(false));
  };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation={true}
      initialRegion={{
        latitude: userLoc.latitude,
        longitude: userLoc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {resultsArr &&
        resultsArr.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coords}
            title={marker.title}
            onPress={locationChosen}
            onDeselect={locationDeChosen}
          />
        ))}
      {routes && routes.map((route, index) => (
        <Polyline
          key={index}
          coordinates={decodePolyline(route.polyline)}
          strokeWidth={3}
          strokeColor="blue"
        />
      ))}
    </MapView>
  );
};

const decodePolyline = (encoded: string) => {
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

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
