// app/index.tsx
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";
import { ActivityIndicator, IconButton, Button, Searchbar, useTheme, MD3Colors } from "react-native-paper";
import MapComponent from "@/components/navigation/MapComponent";
import RouteRecommendations from "@/components/navigation/RouteRecommendations";
import Geocoder from 'react-native-geocoding';
import { NavigationContext } from "@/components/navigation/NavigationContext";
import { ButtonGroup } from "react-native-elements";
import * as Location from 'expo-location';
import { useToast } from "react-native-paper-toast";
import supabase from "@/lib/supabase/supabaseConfig";
import { set } from "react-hook-form";


const MainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setRoutes } = useContext(NavigationContext);
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
    }[] | null
  >([]);
	const router = useRouter();
  const toaster = useToast();

  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toaster.show({
          duration: 2000,
          message: "Permission to access location was denied",
          type: "error",
        })
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const init = async () => {
      const apiKey = await getGoogleMapsApiKey();
      Geocoder.init(apiKey);
    };
    init();

    (async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select()
      setIncidents(data);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const { data, error } = await supabase
          .from('incidents')
          .select()
          setIncidents(data);
        })();
    }, [])
  );



  const handleSearchLocation = (location: string) => {
    setLoading(true);
    Geocoder.from(location)
      .then(json => {
        const location = json.results[0].geometry.location;
        setDestinationCoords({
          latitude: location.lat,
          longitude: location.lng,
        });
        setShowRoutes(true);
      })
      .catch(error => console.warn(error))
      .finally(() => setLoading(false));
  };

  const handleSearchPress = () => {
      navigation.navigate('SearchPage' as never);
    
  };

  const handleRouteSelect = (route: any) => {
    // Update the map to show the selected route
    // You might need to pass this information to your MapComponent
    console.log("Selected route:", route);
  };

  return (
    <View style={styles.container}>
      <MapComponent
        userLoc={{ latitude: -33.918861, longitude: 18.4233 }}
        resultsArr={incidents ? 
          incidents.map(incident => {
            // { coords: { latitude: number; longitude: number }; title: string }
            return {
              coords: {
                latitude: incident.latitude || 0,
                longitude: incident.longitude || 0,
              },
              title: incident.type || "Unknown",
            };
          })
          : []}
        locationChosen={() => {}}
        locationDeChosen={() => {}}
        mode={1}
        destinationCoords={destinationCoords}
        setDestinationCoords={setDestinationCoords}
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
      <View style={styles.reportButton}>
        <IconButton
          icon="alert-octagon"
          iconColor={MD3Colors.error50}
          mode="contained"
          size={40}
          onPress={() => router.push("report")}
        />
      </View>

      {/* <View style={styles.accountButton}>
        <IconButton
          icon="account"
          mode="contained"
          size={40}
          onPress={() => router.push("account")}
        />
      </View> */}
      {loading && <ActivityIndicator style={styles.loadingIndicator} animating={true} color={colors.primary} />}
      {showRoutes && (
        <RouteRecommendations 
          onClose={() => setShowRoutes(false)} 
          onRouteSelect={handleRouteSelect}
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
    borderRadius: 10,  },
  reportButton: {
    position: "absolute",
    bottom: 80,
    right: 10,
  },
  accountButton: {
    position: "absolute",
    bottom: 80,
    left: 10,
  },
});

export default MainPage;
