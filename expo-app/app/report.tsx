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
import { Button, Text } from "react-native-paper";
import * as Location from "expo-location";
import { useToast } from "react-native-paper-toast";
import {
	GooglePlacesAutocomplete,
	GooglePlaceData,
	GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import Incident from "@/lib/types/incident";
import { set, useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import supabase from "@/lib/supabase/supabaseConfig";
import "react-native-get-random-values";
import {v4 as uuidv4} from 'uuid';
import { router } from "expo-router";

// Declare the API key directly
const GOOGLE_PLACES_API_KEY = "AIzaSyCuosz_XkI9j-EPgWHnuXDAo1mEMYDEN_k";

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
	const {control, handleSubmit, setValue} = useForm({
		defaultValues: {
			incidentType: "",
		},
	});
	const toaster = useToast();
	const [focus, setFocus] = useState();

	const [address, setAddress] = useState(null);
	const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
		try {
		  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`);
		  const data = await response.json();
	
		  if (data.results && data.results.length > 0) {
			setAddress(data.results[0].formatted_address);
		  } else {
			setAddress('No address found');
		  }
		} catch (error) {
		  console.error(error);
		  setAddress('Error fetching address');
		}
	  };

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
					getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
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
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		});
		getAddressFromCoordinates(location.latitude, location.longitude);
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
		getAddressFromCoordinates(location.latitude, location.longitude);
	};

	useEffect(() => {
		changeRegion();
		getAddressFromCoordinates(location.latitude, location.longitude);
	}, [setIncidentLocation]);

	return (
		<KeyboardAvoidingView>
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
						key: GOOGLE_PLACES_API_KEY,
						language: "en",
						components: "country:za",
					}}
				/>
			</KeyboardAvoidingView>
			<View style={styles.container}>
				
			<MapView
				ref={mapRef}
				style={styles.map}
				// initialRegion={location}
				showsUserLocation={true}
				showsMyLocationButton={true}
				showsCompass={true}
				scrollEnabled={true}
				zoomEnabled={true}
				pitchEnabled={true}
				rotateEnabled={true}
			>
				{location && (
					<Marker
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
						// title="Incident Location"
						// description="This is where the incident occurred"
						draggable
						onDragEnd={(e) => {
							setIncidentLocation({
								latitude: e.nativeEvent.coordinate.latitude,
								longitude: e.nativeEvent.coordinate.longitude,
							});
						}}
					/>	
				)}	
			</MapView>
			<KeyboardAvoidingView style={styles.formContainer}
				behavior="padding"
			>
				<Text variant="titleLarge">Report an Incident</Text>
				<Text>
					Please select the location of the incident on the map. Tip: you can drag the marker to the exact location.
				</Text>
				<FormBuilder
					
					control={control}
					setFocus={setFocus}
					formConfigArray={[
						{
							type: "select",
							name: "incidentType",
							textInputProps: {
								label: "Incident Type",
							},
							rules: {
								required: "Incident type is required",
							},
							options: [
								{
									label: "Carjacking",
									value: "Carjacking",
								},
								{
									label: "Theft out of or from motor vehicle",
									value: "Theft out of or from motor vehicle",
								},
								{
									label: "Murder",
									value: "Murder"
								},
								{
									label: "Theft of motor vehicle and motorcycle",
									value: "Theft of motor vehicle and motorcycle"
								}
							],
						},
					]}
				/>
				<Button
					mode="contained"
					onPress={handleSubmit(async (data) => {
						await getAddressFromCoordinates(location.latitude, location.longitude)
						setIncident({
							address: address,
							carMake: null,
							carModel: null,
							carYear: null,
							description: null,
							incidentId: uuidv4() as string,
							latitude: location.latitude,
							licensePlate: null,
							location_name: address,
							longitude: location.longitude,
							timestamp: new Date().toISOString(),
							type: data.incidentType
						});
						if (incident) {
							const {error} = await supabase.from('incidents')
								.insert(incident)
							
							if (error){
								console.log(error)
								toaster.show({
									message: "There was an error. Please try again later.",
									type: "error"
								})
							} else {
								toaster.show({
									message: "The incident was reported successfully.",
									type: "success"
								})
								router.back()
							}
						}
					})}
				>
					Submit
				</Button>
			</KeyboardAvoidingView>
			</View>

		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
	map: {
		width: "100%",
		height: "50%",
	},
	formContainer: {
		width: "100%",
		padding: 20,
		height: "100%",
		flex: 1,
		gap: 20,
	},
	autocomplete: {
		position: "absolute",
		top: 10,
		width: "100%",
		height: "100%",
		padding: 20,
		zIndex: 5
	},
});
