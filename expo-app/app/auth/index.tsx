import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";

export default function AuthScreen() {
	const [authType, setAuthType] = useState<"login" | "register">("login");

	return (
		<View style={styles.view}>
			{authType === "login" ? <Login setAuthType={setAuthType} /> : null}
			{authType === "register" ? (
				<Register setAuthType={setAuthType} />
			) : null}
		</View>
	);
}

function Login({
	setAuthType,
}: {
	setAuthType: (type: "login" | "register") => void;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View style={styles.centered}>
			<Text variant="titleLarge" style={styles.title}>
				Welcome Back!
			</Text>
			<Text variant="titleMedium" style={styles.subtitle}>
				Sign in to your account using email/password or Google.
			</Text>
			<Button
				icon="google"
				mode="contained"
				onPress={() => console.log("Pressed")}
				style={styles.fullWidth}
			>
				Sign in with Google
			</Button>
			<Divider style={styles.divider} />
			<TextInput
				label="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
			/>
			<TextInput
				label="Password"
				value={password}
				onChangeText={(text) => setPassword(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
				secureTextEntry
			/>
			<Button
				mode="contained"
				onPress={() => console.log("Pressed")}
				style={styles.fullWidth}
			>
				Login
			</Button>
			<Text
				style={{ marginTop: 16, marginBottom: 32, textAlign: "center" }}
			>
				Don't have an account?{" "}
				<Text
					style={{ color: "black", textDecorationLine: "underline" }}
					onPress={() => setAuthType("register")}
				>
					Register
				</Text>
			</Text>
		</View>
	);
}

function Register({
	setAuthType,
}: {
	setAuthType: (type: "login" | "register") => void;
}) {
	const [firstName, setfirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<ScrollView contentContainerStyle={styles.scrollView}>
			<Text variant="titleLarge" style={styles.title}>
				Create an account
			</Text>
			<Text variant="titleMedium" style={styles.subtitle}>
				Sign up to get started with our platform.
			</Text>
			<Button
				icon="google"
				mode="contained"
				onPress={() => console.log("Pressed")}
				style={styles.fullWidth}
			>
				Sign up with Google
			</Button>
			<Divider style={styles.divider} />
			<TextInput
				label="First Name"
				value={firstName}
				onChangeText={(text) => setfirstName(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
			/>
			<TextInput
				label="Last Name"
				value={lastName}
				onChangeText={(text) => setlastName(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
			/>
			<TextInput
				label="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
			/>
			<TextInput
				label="Password"
				value={password}
				onChangeText={(text) => setPassword(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
				secureTextEntry
			/>
			<TextInput
				label="Confirm Password"
				value={password}
				onChangeText={(text) => setPassword(text)}
				style={[styles.fullWidth, styles.input]}
				mode="outlined"
				secureTextEntry
			/>
			<Button
				mode="contained"
				onPress={() => console.log("Pressed")}
				style={styles.fullWidth}
			>
				Login
			</Button>
			<Text
				style={{ marginTop: 16, marginBottom: 32, textAlign: "center" }}
			>
				Already have an account?{" "}
				<Text
					style={{ color: "black", textDecorationLine: "underline" }}
					onPress={() => setAuthType("login")}
				>
					Login
				</Text>
			</Text>
		</ScrollView>
	);
}

function Divider({ style }: { style?: any }) {
	return (
		<View style={{ flexDirection: "row", alignItems: "center", ...style }}>
			<View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
			<View>
				<Text
					style={{ width: 200, textAlign: "center", color: "gray" }}
				>
					Or continue with
				</Text>
			</View>
			<View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		padding: 32,
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
	},
	subtitle: {
		color: "gray",
		marginBottom: 32,
	},
	fullWidth: {
		width: "100%",
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
		paddingTop: "25%",
		paddingBottom: "25%",
	},
});
