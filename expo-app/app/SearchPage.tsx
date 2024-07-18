import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Alert, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { TextInput, Button, useTheme, IconButton } from "react-native-paper";
import axios from "axios";
import { NavigationContext } from "@/components/navigation/NavigationContext";
import * as Location from 'expo-location';
import RouteDetailsModal from '@/components/navigation/RouteRecommendations';
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Geocoder from "react-native-geocoding"; 
interface Route {
  duration: string;
  distance: string;
  summary: string;
  polyline: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCuosz_XkI9j-EPgWHnuXDAo1mEMYDEN_k';

const SearchPage: React.FC = () => {
  const [origin, setOrigin] = useState<string>("Current Location");
  const [destination, setDestination] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setRoutes, setDestination: setContextDestination, routes, selectedRoute, setSelectedRoute } = useContext(NavigationContext) || {};
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Error", "Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);

  const fetchPlacePredictions = async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.status === 'OK') {
        setPredictions(response.data.predictions);
      } else {
        console.error("Error fetching place predictions:", response.data.status, response.data.error_message);
      }
    } catch (error) {
      console.error("Error fetching place predictions:", error);
    }
  };

  const handleDestinationChange = (input: string) => {
    setDestination(input);
    fetchPlacePredictions(input);
  };

  const handlePredictionSelect = (prediction: any) => {
    setDestination(prediction.description);
    setPredictions([]);
  };

const handleSearch = async () => {
  if (destination.trim()) {
    if (!currentLocation) {
      Alert.alert("Error", "Current location not available. Please try again.");
      return;
    }

    try {
      // Convert the destination to coordinates using Geocoder
      const response = await Geocoder.from(destination);
      const destinationCoords = response.results[0].geometry.location;

      // Prepare request body for the custom API
      const body = {
        api_key: "AIzaSyCuosz_XkI9j-EPgWHnuXDAo1mEMYDEN_k",
        start_coords: [currentLocation.latitude, currentLocation.longitude],
        end_coords: [destinationCoords.lat, destinationCoords.lng],
        bucket_name: "gcf-sources-1036555436109-europe-west2",
        csv_file_path: "finaldata.csv",
        crime_weight: 2, // Different weight
        load_shedding_weight: 0 // Different weight
      };

      console.log("Request Body:", JSON.stringify(body));

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

      console.log("API Response:", JSON.stringify(apiResponse.data));

      // Parse the API response
      const safestRoute = apiResponse.data.safest_route;
      const shortestRoute = apiResponse.data.shortest_route;

      // Create routes array
      const routes = [
        {
          duration: safestRoute.duration || "unknown",
          distance: safestRoute.distance,
          summary: "Safest Route",
          polyline: safestRoute.polyline,
        },
        {
          duration: shortestRoute.duration || "unknown",
          distance: shortestRoute.distance,
          summary: "Shortest Route",
          polyline: shortestRoute.polyline,
        },
      ];

      setRoutes(routes);
      setContextDestination(destination);
      navigation.navigate('index' as never);

    } catch (error) {
      console.error("Error fetching route data:", error);
      Alert.alert("Error", "Failed to fetch route data. Please try again.");
    }
  } else {
    Alert.alert("Error", "Please enter a destination");
  }
};




  const renderPrediction = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePredictionSelect(item)}>
      <View style={styles.predictionItem}>
        <Text style={styles.predictionText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Search</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Current Location"
          value={origin}
          editable={false}
          left={<TextInput.Icon icon="map-marker" />}
        />
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Where to?"
          onChangeText={handleDestinationChange}
          value={destination}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      <FlatList
        data={predictions}
        renderItem={renderPrediction}
        keyExtractor={(item) => item.place_id}
        style={styles.predictionList}
      />

      <Button
        mode="contained"
        onPress={handleSearch}
        style={styles.searchButton}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="navigation" size={size} color={color} />
        )}
      >
        Search
      </Button>

      <RouteDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onNavigate={() => {}}
        route={selectedRoute}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  inputContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  predictionList: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  predictionText: {
    fontSize: 16,
  },
  searchButton: {
    margin: 20,
    paddingVertical: 8,
  },
});

export default SearchPage;
