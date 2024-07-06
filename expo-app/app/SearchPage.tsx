import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Pressable, Text, Alert, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { TextInput, Button, Card, useTheme } from "react-native-paper";
import axios from "axios";
import Constants from 'expo-constants';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import * as Location from 'expo-location';

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

const GOOGLE_MAPS_API_KEY = 'AIzaSyDPzWN903NrP9Yac5m-Th9SJ3z847pkAbU'

const SearchPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const { setRoutes, setDestination, routes } = useContext(NavigationContext) || {};
  const { colors } = useTheme();

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
  <Card key={index} style={styles.routeCard}>
      <Card.Content>
        <Text style={styles.routeText}>Summary: {item.summary}</Text>
        <Text style={styles.routeText}>Duration: {item.duration}</Text>
        <Text style={styles.routeText}>Distance: {item.distance}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        style={styles.searchBar}
        placeholder="Where to?"
        onChangeText={setSearch}
        value={search}
        onSubmitEditing={handleSearchSubmit}
      />
      <FlatList
        data={buttonData}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.buttonList}
      />
      <Pressable style={styles.linkButton} onPress={handleSearchSubmit}>
        <Text style={styles.linkText}>Go</Text>
      </Pressable>
      <ScrollView>
        {routes && routes.map((route, index) => renderRoute({ item: route }))}
      </ScrollView>
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
  linkButton: {
    marginTop: 20,
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
