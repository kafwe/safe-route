import React, { useState, useEffect, useContext } from "react";
import { Audio, AVPlaybackSource } from "expo-av";
import { View, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";
import {
	ActivityIndicator,
	IconButton,
	Button,
	Searchbar,
	useTheme,
	MD3Colors,
} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import MapComponent from "@/components/navigation/MapComponent";
import RouteRecommendations from "@/components/navigation/RouteRecommendations";
import Geocoder from "react-native-geocoding";
import { NavigationContext } from "@/components/navigation/NavigationContext";
import { ButtonGroup } from "react-native-elements";
import * as Location from "expo-location";
import { useToast } from "react-native-paper-toast";
import supabase from "@/lib/supabase/supabaseConfig";
import { set } from "react-hook-form";
import { streamAudio } from "@/lib/playHT/streamAudio";

const MainPage: React.FC = () => {
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [sounds, setSounds] = useState<Audio.Sound[]>([]);
	const [soundData, setSoundData] = useState<Uint8Array | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [destinationCoords, setDestinationCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const [showRoutes, setShowRoutes] = useState(false);
	const navigation = useNavigation();
	const { colors } = useTheme();
	const { setRoutes } = useContext(NavigationContext);
	const [incidents, setIncidents] = useState<
		| {
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
		  }[]
		| null
	>([]);
	const router = useRouter();
	const toaster = useToast();

	const [location, setLocation] = useState({
		latitude: 10,
		longitude: 10,
		latitudeDelta: 0.001,
		longitudeDelta: 0.001,
	});

	useEffect(() => {
		try {
			(async () => {
				let { status } =
					await Location.requestForegroundPermissionsAsync();
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
			})();
		} catch (error) {
			console.warn(error);
		}
	}, []);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				toaster.show({
					duration: 2000,
					message: "Permission to access location was denied",
					type: "error",
				});
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		})();
	}, []);

	const params = useLocalSearchParams();

	useEffect(() => {
		const init = async () => {
			const apiKey = await getGoogleMapsApiKey();
			Geocoder.init(apiKey);
		};
		init();

		(async () => {
			const { data, error } = await supabase.from("incidents").select();
			setIncidents(data);
		})();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			(async () => {
				const { data, error } = await supabase
					.from("incidents")
					.select();
				setIncidents(data);
			})();
		}, [])
	);

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
			console.log(
				`Destination coordinates: ${JSON.stringify(locationCoords)}`
			);
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

			const routesResponse = await fetch(
				"https://europe-west2-gradhack24jnb-608.cloudfunctions.net/my_route_function",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				}
			);
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
		navigation.navigate("SearchPage" as never);
	};

	// NOTE: This is a temporary function to test the audio directions
	const getDirectionsInstructions = async () => {
		const body = {
			origin: {
				location: {
					latLng: {
						latitude: 37.419734,
						longitude: -122.0827784,
					},
				},
			},
			destination: {
				location: {
					latLng: {
						latitude: 37.41767,
						longitude: -122.079595,
					},
				},
			},
			travelMode: "DRIVE",
			computeAlternativeRoutes: false,
			routeModifiers: {
				avoidTolls: false,
				avoidHighways: false,
				avoidFerries: false,
			},
			languageCode: "en-ZA",
			units: "METRIC",
		};

		const response = await fetch(
			"https://routes.googleapis.com/directions/v2:computeRoutes",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Goog-Api-Key":
						process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
					"X-Goog-FieldMask": "*",
				},
				body: JSON.stringify(body),
			}
		);

		const data = await response.json();

		// console.log(data);
		const steps = data.routes[0].legs[0].steps;
		const instructions = steps.map(
			(step: any) => step.navigationInstruction
		);
		const instructionsText = instructions.map(
			(instruction: any) => instruction.instructions
		);
		console.log(instructionsText);
		return instructionsText;
	};

	const preFetchAudio = async () => {
		try {
			// An array of instruction strings
			const instructions = await getDirectionsInstructions();

			const audioBody = {
				text: "",
				voice: "s3://voice-cloning-zero-shot/65ccc48d-fc0b-479b-83ae-2e146e17f850/original/manifest.json",
				output_format: "mp3",
				quality: "high",
				speed: 0.9,
				voice_engine: "PlayHT2.0-turbo",
			};

			const audios: Audio.Sound[] = await Promise.all(
				(instructions as string[]).map(async (instruction: string) => {
					audioBody.text = instruction;
					const audioResponse = await fetch(
						"https://api.play.ht/api/v2/tts/stream",
						{
							method: "POST",
							headers: {
								Authorization: `6adec69ee40a468098d587cad52e4faa`, // TODO: Use environment variable
								"X-USER-ID": "OOXo1w0q1FUb7x2WHwyv9Wj5QrB2", // TODO: Use environment variable
								"Content-Type": "application/json",
								Accept: "application/json",
							},
							body: JSON.stringify(audioBody),
						}
					);
					const audio = (await audioResponse.json()).href;

					const { sound } = await Audio.Sound.createAsync({
						uri: audio,
						headers: {
							Authorization: `6adec69ee40a468098d587cad52e4faa`, // TODO: Use environment variable
							"X-USER-ID": "OOXo1w0q1FUb7x2WHwyv9Wj5QrB2", // TODO: Use environment variable
						},
					});
					return sound;
				})
			);
			setSounds(() => audios);
		} catch (error) {
			console.error(error);
		}
	};

	// TODO: Find a way to index the audio directions correctly based on the user's current location
	const startAudioDirections = async (index: number = 0) => {
		await preFetchAudio(); //NOTE: This should be called when we receive the navigation data (not in this function)
		// this function should be called when the user presses a button to start the audio directions
		try {
			setSound(sounds[index]);
			console.log("Playing Sound");
			await sounds[index].playAsync();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	return (
		<View style={styles.container}>
			<MapComponent
				userLoc={{
					// latitude: location?.latitude || -33.918861,
					// longitude: location?.longitude || 18.4233
					latitude: -33.918861,
					longitude: 18.4233,
				}}
				resultsArr={
					incidents
						? incidents.map((incident) => {
								// { coords: { latitude: number; longitude: number }; title: string }
								return {
									coords: {
										latitude: incident.latitude || 0,
										longitude: incident.longitude || 0,
									},
									title: incident.type || "Unknown",
								};
						  })
						: []
				}
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
					onPress={() => navigation.navigate("SearchPage" as never)}
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
			{loading && (
				<ActivityIndicator
					style={styles.loadingIndicator}
					animating={true}
					color={colors.primary}
				/>
			)}
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
			<Button
				mode="contained"
				icon="magnify"
				onPress={() => startAudioDirections(0)}
				style={{
					position: "absolute",
					bottom: 200,
					right: 10,
					marginHorizontal: 10,
					borderRadius: 10,
				}}
			>
				Temp, Read directions aloud
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
    borderRadius: 10,
  },
});

export default MainPage;
