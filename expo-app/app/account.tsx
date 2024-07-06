import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Avatar, Text, List, Button } from "react-native-paper";
import PastTripsScreen from "./historic/trips";
import authContext from "@/lib/contexts/authContext";

const Account = () => {
	const router = useRouter();
	const { user, setUser } = useContext(authContext);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.profileContainer}>
				<Avatar.Image
					size={100}
					source={{
						uri:
							user?.photoURL || "https://example.com/profile.jpg",
					}}
				/>
				<Text style={styles.name}>
					{user?.firstName} {user?.lastName}
				</Text>
				<Text>{user?.email}</Text>
			</View>
			<Button
				mode="contained"
				onPress={() => {
					/* Handle logout */
				}}
			>
				Logout
			</Button>
			<PastTripsScreen />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	profileContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 8,
	},
});

export default Account;
