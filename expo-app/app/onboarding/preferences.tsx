import authContext from "@/lib/contexts/authContext";
import { firestore } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";

export default function PreferencesOnboarding() {
	const { user, setUser } = useContext(authContext);
	const toaster = useToast();
	const router = useRouter();

	const submitPreferences = (preference: string) => {
		if (!preference) {
			toaster.show({
				message: "Please select a preference",
				type: "error",
			});
		} else {
			const update = {
				preferences: {
					distance: preference === "distance" ? 1 : 0,
					crime: preference === "crime" ? 1 : 0,
					loadshedding: preference === "loadshedding" ? 1 : 0,
				},
			};
			const docRef = doc(firestore, "users", user?.uid);
			updateDoc(docRef, update);

			setUser({ ...user, ...update });
			toaster.show({
				message: "Preferences saved successfully",
				type: "success",
			});
			router.replace("/");
		}
	};

	return (
		<View style={{ ...styles.centered, ...styles.fullWidthPadded }}>
			<Text variant="titleLarge" style={styles.title}>
				Personalise Your Navigation
			</Text>
			<Text variant="titleMedium" style={styles.subtitle}>
				Choose your preferences to get the best route recommendations.
			</Text>
			<View>
				<Card
					onPress={() => submitPreferences("distance")}
					style={styles.card}
				>
					<Card.Title
						title="Shortest Distance"
						left={(props: any) => (
							<Avatar.Icon
								{...props}
								icon="map-marker-distance"
							/>
						)}
					/>
					<Card.Content>
						<Text>Find the quickest route to your destination</Text>
					</Card.Content>
				</Card>
				<Card
					onPress={() => submitPreferences("crime")}
					style={styles.card}
				>
					<Card.Title
						title="Avoid Crime"
						left={(props: any) => (
							<Avatar.Icon {...props} icon="robber" />
						)}
					/>
					<Card.Content>
						<Text>
							Steer clear of high-crime areas on your route
						</Text>
					</Card.Content>
				</Card>
				<Card
					onPress={() => submitPreferences("loadshedding")}
					style={styles.card}
				>
					<Card.Title
						title="Avoid Loadshedding"
						left={(props: any) => (
							<Avatar.Icon {...props} icon="lightning-bolt" />
						)}
					/>
					<Card.Content>
						<Text>
							Find routes that avoid areas with loadshedding
						</Text>
					</Card.Content>
				</Card>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		padding: 24,
		width: "100%",
		height: "100%",
	},
	centered: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	title: {
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		color: "gray",
		marginBottom: 32,
		textAlign: "center",
	},
	fullWidthPadded: {
		width: "100%",
		padding: 32,
	},
	divider: {
		marginTop: 32,
		marginBottom: 32,
		color: "gray",
	},
	input: {
		marginBottom: 32,
	},
	scrollView: {
		paddingTop: "40%",
		paddingBottom: "25%",
	},
	card: {
		marginBottom: 16,
	},
});
