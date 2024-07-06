import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, Button, Card, useTheme, TouchableRipple } from "react-native-paper";
import { NavigationContext } from "./NavigationContext";

interface Route {
  id: string;
  duration: string;
  distance: string;
  description: string;
}

interface RouteRecommendationsProps {
  onClose: () => void;
}

const RouteRecommendations: React.FC<RouteRecommendationsProps> = ({ onClose }) => {
  const context = useContext(NavigationContext);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  if (!context) {
    throw new Error('RouteRecommendations must be used within a NavigationProvider');
  }

  const { destination } = context;

  useEffect(() => {
    // Mock route recommendations for now
    setRoutes([
      {
        id: "1",
        duration: "24 min",
        distance: "27 km",
        description: "Safest route, typical traffic",
      },
      {
        id: "2",
        duration: "28 min",
        distance: "25 km",
        description: "Via Otto Du Plessis Dr (R27) Milnerton, Cape Town; Marine Dr (R27) Metro Industrial Township, Cape Town",
      },
      {
        id: "3",
        duration: "29 min",
        distance: "23 km",
        description: "Via Koeberg (M5) Milnerton, Cape Town; N1 W Typical traffic",
      },
    ]);
  }, [destination]);

  const renderRoute = (route: Route, index: number) => (
    <TouchableRipple
      key={route.id}
      onPress={() => {
        if (index === 0) {
          setModalVisible(true);
        }
      }}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <Card style={[styles.routeCard, index === 0 ? styles.greenBorder : styles.blueBorder]}>
        <Card.Content>
          <View style={styles.routeDetails}>
            <Text style={styles.routeText}>{route.duration}</Text>
            <Text style={styles.descriptionText}>{route.description}</Text>
            <Text style={styles.routeText}>{route.distance}</Text>
          </View>
        </Card.Content>
        <Card.Cover
          source={
            index === 0
              ? require("../../assets/images/Safe.png")
              : index === 1
              ? require("../../assets/images/Short.png")
              : undefined
          }
          style={styles.logo}
        />
      </Card>
    </TouchableRipple>
  );

  return (
    <Card style={styles.container}>
      <Card.Title
        title="Route Recommendations"
        right={(props) => (
          <Button {...props} onPress={onClose}>
            Close
          </Button>
        )}
      />
      <ScrollView style={styles.mainRoute}>
        {routes[0] && renderRoute(routes[0], 0)}
      </ScrollView>
      <ScrollView style={styles.additionalRoutes}>
        {routes.slice(1).map((route, index) => renderRoute(route, index + 1))}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  mainRoute: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  additionalRoutes: {
    padding: 16,
  },
  routeCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  greenBorder: {
    borderLeftWidth: 4,
    borderColor: "green",
  },
  blueBorder: {
    borderLeftWidth: 4,
    borderColor: "blue",
  },
  routeDetails: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "gray",
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default RouteRecommendations;
