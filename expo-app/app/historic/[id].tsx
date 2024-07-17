import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

const TripDetailsScreen = ({ route }) => {
	const { trip } = route.params;

	return (
		<View style={styles.container}>
			<Image source={{ uri: trip.image }} style={styles.mapImage} />
			<Text>{trip.date}</Text>
			<Text>{trip.time}</Text>
			<Text>{trip.route}</Text>
			<Text style={styles.price}>$25.00</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	mapImage: {
		width: "100%",
		height: 200,
		borderRadius: 4,
		marginBottom: 16,
	},
	price: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 16,
	},
});

export default TripDetailsScreen;