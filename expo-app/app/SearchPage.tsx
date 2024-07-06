import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Pressable, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { TextInput, Button, Card, useTheme } from "react-native-paper";
import axios from "axios";
import Constants from 'expo-constants';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import * as Location from 'expo-location';
import RouteDetailsModal from '@/components/navigation/RouteRecommendations'; // Adjust the import path as needed
import { useNavigation } from "@react-navigation/native"; // Import the navigation hook

interface ButtonData {
  id: string;
  title: string;
  icon: string;
}

interface Route {
  duration: string;
  distance: string;
  summary: string;
  polyline: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDPzWN903NrP9Yac5m-Th9SJ3z847pkAbU';

const CAPE_TOWN_LOCATION = {
  latitude: -33.918861,
  longitude: 18.4233,
};

const RADIUS = 50000; // 50 kilometers

const SearchPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setRoutes, setDestination, routes } = useContext(NavigationContext) || {};
  const { colors } = useTheme();
  const navigation = useNavigation(); // Use the navigation hook

  const buttonData: ButtonData[] = [
    { id: "1", title: "Gas", icon: "gas-pump" },
    { id: "2", title: "Food", icon: "utensils" },
    { id: "3", title: "Parking", icon: "parking" },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(`${location.coords.latitude},${location.coords.longitude}`);
    })();
  }, []);

  const fetchRoutes = async (destination: string) => {
    if (!currentLocation) {
      Alert.alert("Error", "Current location not available. Please try again.");
      return;
    }

    console.log(`Fetching routes for destination: ${destination}`);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );
      console.log("Google Maps API response:", response.data);

      if (response.data.status === 'OK') {
        const data = response.data.routes.map((route: any) => ({
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          summary: route.summary,
          polyline: route.overview_polyline.points,
        }));
        console.log("Parsed route data:", data);
        setRoutes && setRoutes(data);
        setDestination && setDestination(destination);
      } else {
        console.error("Error fetching route data:", response.data.status, response.data.error_message);
        Alert.alert("Error", `Could not fetch route data: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
      Alert.alert("Error", "Could not fetch route data. Please try again.");
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      console.log(`Search submitted for: ${search}`);
      fetchRoutes(search);
    } else {
      console.log("Search query is empty.");
    }
  };

  const fetchPlacePredictions = async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${CAPE_TOWN_LOCATION.latitude},${CAPE_TOWN_LOCATION.longitude}&radius=${RADIUS}&key=${GOOGLE_MAPS_API_KEY}`
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

  const handleSearchChange = (input: string) => {
    setSearch(input);
    fetchPlacePredictions(input);
  };

  const handlePredictionSelect = (prediction: any) => {
    setSearch(prediction.description);
    setPredictions([]);
    fetchRoutes(prediction.description);
  };

  const handleRoutePress = (route: Route) => {
    setSelectedRoute(route);
    setIsModalVisible(true);
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    // Navigate to the map page with the selected route details
    navigation.navigate('index', { route: selectedRoute });
  };

  const renderButton = ({ item }: { item: ButtonData }) => (
    <Button
      mode="contained"
      style={styles.searchButton}
      onPress={() => {
        setSearch(item.title);
        handleSearchSubmit();
      }}
      icon={({ size, color }) => (
        <Icon name={item.icon} type="font-awesome-5" color="white" size={size} />
      )}
    >
      {item.title}
    </Button>
  );

  const renderRoute = ({ item, index }: { item: Route; index: number }) => (
    <TouchableOpacity key={index} onPress={() => handleRoutePress(item)}>
      <Card style={styles.routeCard}>
        <Card.Content>
          <Text style={styles.routeText}>Summary: {item.summary}</Text>
          <Text style={styles.routeText}>Duration: {item.duration}</Text>
          <Text style={styles.routeText}>Distance: {item.distance}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderPrediction = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePredictionSelect(item)}>
      <View style={styles.predictionItem}>
        <Text style={styles.predictionText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        style={styles.searchBar}
        placeholder="Where to?"
        onChangeText={handleSearchChange}
        value={search}
        onSubmitEditing={handleSearchSubmit}
      />
      <FlatList
        data={predictions}
        renderItem={renderPrediction}
        keyExtractor={(item) => item.place_id}
        contentContainerStyle={styles.predictionList}
      />
      <FlatList
        data={buttonData}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.buttonList}
      />
      <ScrollView>
        {routes && routes.map((route, index) => renderRoute({ item: route, index }))}
      </ScrollView>
      <Pressable style={styles.linkButton} onPress={handleSearchSubmit}>
        <Text style={styles.linkText}>Go</Text>
      </Pressable>
      <RouteDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onNavigate={handleNavigate}
        route={selectedRoute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  searchBar: {
    marginBottom: 20,
  },
  searchButton: {
    marginHorizontal: 10,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
  },
  buttonList: {
    marginTop: 4,
  },
  predictionList: {
    marginBottom: 10,
  },
  predictionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  predictionText: {
    fontSize: 16,
  },
  linkButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  linkText: {
    color: "white",
    fontSize: 16,
  },
  routeCard: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  routeText: {
    fontSize: 16,
  },
});

export default SearchPage;
