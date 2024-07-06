// app/index.tsx
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { getGoogleMapsApiKey } from "@/utils/getGoogleMapsApiKey";
import {
	ActivityIndicator,
	IconButton,
	MD3Colors,
	Searchbar,
	useTheme,
} from "react-native-paper";
import MapComponent from "@/components/navigation/MapComponent";
import RouteRecommendations from "@/components/navigation/RouteRecommendations";
import Geocoder from "react-native-geocoding";
import authContext from "@/lib/contexts/authContext";

const MainPage: React.FC = () => {
	const { user, setUser } = useContext(authContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [destinationCoords, setDestinationCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const [showRoutes, setShowRoutes] = useState(false);
	const navigation = useNavigation();
	const { colors } = useTheme();
	const params = useLocalSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (params.searchQuery) {
			const query = Array.isArray(params.searchQuery)
				? params.searchQuery[0]
				: params.searchQuery;
			setSearchQuery(query);
			handleSearchLocation(query);
		}
	}, [params.searchQuery]);

	const handleSearchLocation = (location: string) => {
		setLoading(true);
		Geocoder.init(getGoogleMapsApiKey());
		Geocoder.from(location)
			.then((json) => {
				const location = json.results[0].geometry.location;
				setDestinationCoords({
					latitude: location.lat,
					longitude: location.lng,
				});
				setShowRoutes(true);
			})
			.catch((error) => console.warn(error))
			.finally(() => setLoading(false));
	};

	const handleSearchPress = () => {
		navigation.navigate("SearchPage");
	};

	const handleReportPress = () => {
		router.push("report");
	};

	const handleAccountPress = () => {
		router.push("account");
	};

	return (
		<SafeAreaView style={styles.container}>
			<MapComponent
				userLoc={{ latitude: -33.918861, longitude: 18.4233 }}
				resultsArr={[]}
				locationChosen={() => {}}
				locationDeChosen={() => {}}
				mode={1}
				destinationCoords={destinationCoords}
				setDestinationCoords={setDestinationCoords}
				loading={loading}
				setLoading={setLoading}
			/>

			<View style={styles.reportButton}>
				<IconButton
					icon="alert-octagon"
					iconColor={MD3Colors.error50}
					mode="contained"
					size={40}
					onPress={() => handleReportPress()}
				/>
			</View>

			<View style={styles.accountButton}>
				<IconButton
					icon="account"
					mode="contained"
					size={40}
					onPress={() => handleAccountPress()}
				/>
			</View>

			<View style={styles.iconButton}>
				<IconButton
					icon="menu"
					iconColor={colors.primary}
					size={30}
					onPress={handleSearchPress}
				/>
			</View>

			{loading && (
				<ActivityIndicator
					style={styles.loadingIndicator}
					animating={true}
					color={colors.primary}
				/>
			)}
			{showRoutes && (
				<RouteRecommendations onClose={() => setShowRoutes(false)} />
			)}
			<Searchbar
				placeholder="Where to?"
				onChangeText={setSearchQuery}
				value={searchQuery}
				onIconPress={handleSearchPress}
				onPress={handleSearchPress}
				style={styles.searchbar}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchbar: {
		position: "absolute",
		bottom: 10,
		left: 10,
		right: 10,
		marginHorizontal: 10,
		borderRadius: 10,
	},
	iconButton: {
		position: "absolute",
		top: 40,
		left: 10,
	},
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
	loadingIndicator: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -10 }, { translateY: -10 }],
	},
});

export default MainPage;
