import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import authContext, { SafeRouteUser } from "@/lib/contexts/authContext";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { doc, firestore, setDoc } from "../../lib/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { useToast } from "react-native-paper-toast";
import { updateDoc } from "firebase/firestore";

const carMakes = [
	"BMW",
	"Mercedes",
	"Volkswagen",
	"Ford",
	"Toyota",
	"Honda",
	"Chevrolet",
	"Hyundai",
	"Nissan",
	"Renault",
];

const carModels = [
	["X1", "X2", "X3", "X4", "X5", "X6", "X7"],
	["A-Class", "C-Class", "E-Class", "S-Class"],
	["Golf", "Polo", "Passat", "Tiguan"],
	["Fiesta", "Focus", "Mustang", "Ranger"],
	["Corolla", "Camry", "Yaris", "RAV4"],
	["Civic", "Accord", "CR-V", "HR-V"],
	["Spark", "Cruze", "Malibu", "Equinox"],
	["i10", "i20", "i30", "i40"],
	["Micra", "Qashqai", "Juke", "X-Trail"],
	[
		"Clio",
		"Megane",
		"Captur",
		"Kadjar",
		"Talisman",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
		"Avantime",
		"Espace",
		"Scenic",
		"Grand Scenic",
		"Kadjar",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
		"Avantime",
		"Espace",
		"Scenic",
		"Grand Scenic",
		"Kadjar",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
		"Avantime",
		"Espace",
		"Scenic",
		"Grand Scenic",
		"Kadjar",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
		"Avantime",
		"Espace",
		"Scenic",
		"Grand Scenic",
		"Kadjar",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
		"Avantime",
		"Espace",
		"Scenic",
		"Grand Scenic",
		"Kadjar",
		"Koleos",
		"Arkana",
		"Duster",
		"Sandero",
		"Logan",
		"Twingo",
		"Zoe",
		"Kangoo",
		"Master",
		"Trafic",
		"Alaskan",
		"Express",
		"Fluence",
		"Latitude",
		"Wind",
		"Vel Satis",
	],
];

export default function CarOnboarding() {
	const { user, setUser } = useContext(authContext);
	const { control, setFocus, handleSubmit, getValues, watch } = useForm({
		defaultValues: {
			carMake: 0,
			carModel: "",
		},
		mode: "onChange",
	});
	const router = useRouter();
	const toaster = useToast();

	const submit = async () => {
		const values = getValues();
		//creating an object with user data
		const userData = {
			carMake: carMakes[values.carMake],
			carModel: carModels[values.carMake][Number(values.carModel)],
		};

		try {
			console.log("User data", userData);
			//adding the users data to the 'Users' collection
			const userRef = doc(firestore, "users", user?.uid); //getting a reference to the document
			const setDocResponse = await updateDoc(userRef, userData); //setting the document with userData

			setUser({ ...user, ...userData } as SafeRouteUser);

			toaster.show({
				message: "Car selected successfully",
				type: "success",
			});

			router.replace("onboarding/preferences");
		} catch (error) {
			console.error(error);
			toaster.show({
				message: "An error occurred. Please try again.",
				type: "error",
			});
		}
	};

	return (
		<View style={styles.container}>
			<Text variant="titleLarge">Select your car</Text>
			<Text variant="titleMedium" style={styles.subtitle}>
				Select your car and car make so that we can provide you with
				safer routes.
			</Text>
			<View style={styles.form}>
				<FormBuilder
					control={control}
					setFocus={setFocus}
					formConfigArray={[
						{
							type: "select",
							name: "carMake",
							rules: {
								required: {
									value: true,
									message: "Car make is required",
								},
							},
							textInputProps: {
								label: "Car Make",
							},
							options: carMakes.map((make, index) => ({
								label: make,
								value: index,
							})),
						},
						{
							type: "select",
							name: "carModel",
							rules: {
								required: {
									value: true,
									message: "Car model is required",
								},
							},
							textInputProps: {
								label: "Car Model",
							},
							options: carModels[watch().carMake || 0].map(
								(model, index) => ({
									label: model,
									value: index,
								})
							),
						},
					]}
				></FormBuilder>
				<Button onPress={handleSubmit(submit)} mode="contained">
					Next
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	subtitle: {
		color: "gray",
	},
	form: {
		width: "100%",
		padding: 20,
	},
});
