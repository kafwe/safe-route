import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, IconButton, Button, useTheme } from "react-native-paper";
import MapComponent from "@/components/navigation/MapComponent";
import RouteRecommendations from "@/components/navigation/RouteRecommendations";
import Geocoder from 'react-native-geocoding';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";

const MainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setRoutes } = useContext(NavigationContext);
  const params = useLocalSearchParams();

  useEffect(() => {
    const init = async () => {
      const apiKey = await getGoogleMapsApiKey();
      Geocoder.init(apiKey);
    };
    init();

    if (params.searchQuery) {
      setSearchQuery(params.searchQuery);
      handleSearchLocation(params.searchQuery as string);
    }
  }, [params.searchQuery]);

  const handleSearchLocation = async (location: string) => {
    if (!location) {
      console.warn("No destination provided");
      return;
    }
    console.log(`Fetching routes for destination: ${location}`);
    setLoading(true);
    try {
      const response = await Geocoder.from(location);
      const result = response.results[0];
      const locationCoords = result.geometry.location;
      console.log(`Destination coordinates: ${JSON.stringify(locationCoords)}`);
      setDestinationCoords({
        latitude: locationCoords.lat,
        longitude: locationCoords.lng,
      });

      // Log the backend request
      const body = {
        api_key: "AIzaSyC9pv7SjMiZUm4_mlTJaZc2zKt8kj-XlmY",
        start_coords: [-34.04625271491547, 18.63355824834987], // Use actual user location in a real scenario
        end_coords: [locationCoords.lat, locationCoords.lng],
        bucket_name: "gcf-sources-1028767563254-europe-west2",
        csv_file_path: "finaldata.csv",
        crime_weight: 1,
        load_shedding_weight: 1,
      };
      console.log("Backend request body:", body);

      const routesResponse = await fetch("https://europe-west2-gradhack24jnb-608.cloudfunctions.net/my_route_function", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const routesData = await routesResponse.json();
      console.log("Backend response data:", routesData);
      setRoutes({
        safest: routesData.safest_route,
        shortest: routesData.shortest_route,
      });
      setShowRoutes(true);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchPage' as never);
  };

  return (
    <View style={styles.container}>
      <MapComponent
        userLoc={{ latitude: -33.918861, longitude: 18.4233 }}
        resultsArr={[]}
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
        Search
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    marginHorizontal: 10,
    borderRadius: 10,
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
