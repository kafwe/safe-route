import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, Text } from "react-native-paper";
import MapView, { Polyline } from "react-native-maps";
import { useRouter } from "expo-router";

const PastTripsScreen = () => {
	const router = useRouter();
	const trips = [
		{
			id: 1,
			date: "25 Jun",
			time: "09:35",
			route: "Jack’s House - White Field",
			coordinates: [
				{ latitude: 37.78825, longitude: -122.4324 },
				{ latitude: 37.75825, longitude: -122.4424 },
			],
		},
		{
			id: 2,
			date: "24 Jun",
			time: "06:28",
			route: "Koramangala - Bigade Road",
			coordinates: [
				{ latitude: 37.76825, longitude: -122.4324 },
				{ latitude: 37.74825, longitude: -122.4524 },
			],
		},
		{
			id: 3,
			date: "20 Jun",
			time: "09:00",
			route: "Malleswaram - ISKON",
			coordinates: [
				{ latitude: 37.72825, longitude: -122.4224 },
				{ latitude: 37.71825, longitude: -122.4824 },
			],
		},
	];

	return (
		<View style={styles.container}>
			{trips.map((trip) => (
				<View key={trip.id} style={styles.tripContainer}>
					<List.Item
						title={`${trip.date} • ${trip.time}`}
						description={trip.route}
						onPress={() => router.navigate(`historic/${trip.id}`)}
					/>
					<MapView
						style={styles.map}
						initialRegion={{
							latitude: trip.coordinates[0].latitude,
							longitude: trip.coordinates[0].longitude,
							latitudeDelta: 0.0922,
							longitudeDelta: 0.0421,
						}}
					>
						<Polyline
							coordinates={trip.coordinates}
							strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
							strokeColors={["#7F0000"]}
							strokeWidth={6}
						/>
					</MapView>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	tripContainer: {
		marginBottom: 16,
	},
	map: {
		height: 200,
		marginVertical: 16,
		borderRadius: 8,
	},
});

export default PastTripsScreen;
