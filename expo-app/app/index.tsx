import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "react-native-paper";

export default function HomeScreen() {
	return (
		<View style={styles.view}>
			<Button
				icon="camera"
				mode="contained"
				onPress={() => console.log("Pressed")}
			>
				Press me
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		display: "flex",
		justifyContent: "center",
		alignContent: "center",
		height: "100%",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
