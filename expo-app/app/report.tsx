import { createRef, useEffect, useState } from "react";
import {
	SafeAreaView,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	TextInput,
	TextInputProps,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Text } from "react-native-paper";
import * as Location from "expo-location";
import { useToast } from "react-native-paper-toast";
import {
	GooglePlacesAutocomplete,
	GooglePlaceData,
	GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import Incident from "@/lib/types/incident";

export default function Report() {
	const [location, setLocation] = useState({
		latitude: 10,
		longitude: 10,
		latitudeDelta: 0.001,
		longitudeDelta: 0.001,
	});
	const [incident, setIncident] = useState<Incident | undefined>(undefined);
	const [height, setHeight] = useState("0%");
	const mapRef = createRef<MapView>();
	const toaster = useToast();

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

	const changeRegion = () => {
		if (!mapRef.current) return;
		mapRef.current.animateToRegion({
			latitude: location.latitude,
			longitude: location.longitude,
			latitudeDelta: 0.1,
			longitudeDelta: 0.1,
		});
	};

	const setIncidentLocation = (location: {
		latitude: number;
		longitude: number;
	}) => {
		setLocation({
			...location,
			latitudeDelta: 0.001,
			longitudeDelta: 0.001,
		});
		changeRegion();
	};

	return (
		<SafeAreaView style={styles.container}>
			<MapView
				// ref={mapRef}
				style={styles.map}
				initialRegion={location}
				showsUserLocation={true}
				showsMyLocationButton={true}
				showsCompass={true}
				scrollEnabled={true}
				zoomEnabled={true}
				pitchEnabled={true}
				rotateEnabled={true}
			>
				<Marker
					title="Yor are here"
					description="This is a description"
					coordinate={location}
				/>
			</MapView>
			<KeyboardAvoidingView
				style={{
					...styles.autocomplete,
					height,
				}}
			>
				<GooglePlacesAutocomplete
					placeholder="Search"
					fetchDetails={true}
					enableHighAccuracyLocation={true}
					enablePoweredByContainer={false}
					textInputProps={{
						onFocus: () => {
							console.log("focus");
							setHeight("100%");
						},
						onBlur: () => {
							console.log("blur");
							setHeight("0%");
						},
					}}
					onPress={(
						data: GooglePlaceData,
						details: GooglePlaceDetail
					) => {
						// 'details' is provided when fetchDetails = true
						setIncidentLocation({
							latitude: details.geometry.location.lat,
							longitude: details.geometry.location.lng,
						});
					}}
					query={{
						key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
						language: "en",
						components: "country:za",
					}}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	map: {
		flexBasis: "50%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		height: "50%",
	},
	formContainer: {
		flexBasis: "50%",
		width: "100%",
		padding: 20,
	},
	autocomplete: {
		position: "absolute",
		top: 10,
		width: "100%",
		height: "100%",
		padding: 20,
	},
});
