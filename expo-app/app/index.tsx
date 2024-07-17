import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";
import { ActivityIndicator, IconButton, Button, useTheme } from "react-native-paper";
import MapComponent from "@/components/navigation/MapComponent";
import RouteRecommendations from "@/components/navigation/RouteRecommendations";
import Geocoder from 'react-native-geocoding';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import * as Location from 'expo-location';
import { useToast } from "react-native-paper-toast";

const MainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [destinationName, setDestinationName] = useState(''); // New state for destination name
  const [searchPerformed, setSearchPerformed] = useState(false); // New state to track if search is performed
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setRoutes, routes, destination } = useContext(NavigationContext); // Access destination from context
  
  const toaster = useToast();

  const [location, setLocation] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          toaster.show({
            message: "Location permission denied",
            type: "error",
          });
        } else {
          let location = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const apiKey = await getGoogleMapsApiKey();
      Geocoder.init(apiKey);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toaster.show({
          duration: 2000,
          message: "Permission to access location was denied",
          type: "error",
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    })();
  }, []);

  useEffect(() => {
    if (destination) {
      setDestinationName(destination); // Set the destination name from context
      setSearchPerformed(true); // Set searchPerformed to true when destination is set
    }
  }, [destination]);

  const handleSearchPress = () => {
    navigation.navigate('SearchPage' as never);
  };

  return (
    <View style={styles.container}>
      {searchPerformed && destinationName ? (
        <View style={styles.navigationBox}>
          <Text style={styles.navigationText}>
            Your location → {destinationName}
          </Text>
        </View>
      ) : null}
      
      {searchPerformed && (
        <View style={styles.routesContainer}>
          <ScrollView horizontal contentContainerStyle={styles.routesScrollView}>
            <View style={[styles.routeBox, styles.routeBoxGreen]}>
              <Text style={styles.routeText}>26 min</Text>
              <Text style={styles.routeSubText}>25.1 km</Text>
            </View>
            <View style={[styles.routeBox, styles.routeBoxBlue]}>
              <Text style={styles.routeText}>30 min</Text>
              <Text style={styles.routeSubText}>23.6 km</Text>
            </View>
            <View style={[styles.routeBox, styles.routeBoxPurple]}>
              <Text style={styles.routeText}>32 min</Text>
              <Text style={styles.routeSubText}>23.3 km</Text>
            </View>
            {/* Add more placeholders as needed */}
          </ScrollView>
        </View>
      )}

      <MapComponent
        userLoc={{ 
          latitude: -33.918861,
          longitude: 18.4233
        }}
        locationChosen={() => {}}
        locationDeChosen={() => {}}
        destinationCoords={destinationCoords}
        loading={loading}
        setLoading={setLoading}
      />
      
      <View style={styles.iconButton}>
        <IconButton
          icon="menu"
          iconColor={colors.primary}
          size={30}
          onPress={() => navigation.navigate('SearchPage' as never)}
        />
      </View>

      {loading && <ActivityIndicator style={styles.loadingIndicator} animating={true} color={colors.primary} />}
      {showRoutes && (
        <RouteRecommendations 
          onClose={() => setShowRoutes(false)} 
          onRouteSelect={() => {}}
        />
      )}
      <Button
        mode="contained"
        icon="magnify"
        onPress={handleSearchPress}
        style={styles.searchButton}
      >
        {searchPerformed ? 'Navigate' : 'Search'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBox: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1000,
    alignItems: 'center',
  },
  navigationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routesContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1000,
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
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  routeSubText: {
    fontSize: 14,
    color: '#000',
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  searchButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    marginHorizontal: 10,
    borderRadius: 10,  
  },
});

export default MainPage;
