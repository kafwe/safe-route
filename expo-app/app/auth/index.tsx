import {
	GoogleAuthProvider,
	auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "@/lib/firebase/firebaseConfig";
import { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";

import AuthContext from "@/lib/contexts/authContext";
import { useToast } from "react-native-paper-toast";

export default function AuthScreen() {
	const [authType, setAuthType] = useState<"login" | "register">("login");

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.view}
		>
			{authType === "login" ? <Login setAuthType={setAuthType} /> : null}
			{authType === "register" ? (
				<Register setAuthType={setAuthType} />
			) : null}
		</KeyboardAvoidingView>
	);
}

function Login({
	setAuthType,
}: {
	setAuthType: (type: "login" | "register") => void;
}) {
	const { user, setUser } = useContext(AuthContext);
	const toaster = useToast();
	const { control, setFocus, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});
	const provider = new GoogleAuthProvider();

	const login = () => {
		signInWithEmailAndPassword(
			auth,
			control._formValues.email,
			control._formValues.password
		)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				setUser(user);
				toaster.show({
					message: "Login successful",
					duration: 2000,
					type: "success",
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				toaster.show({
					message: `${errorCode}: Login failed, ${errorMessage}`,
					duration: 2000,
					type: "error",
				});
			});
	};

	return (
		<View style={styles.centered}>
			<Text variant="titleLarge" style={styles.title}>
				Welcome Back!
			</Text>
			<Text variant="titleMedium" style={styles.subtitle}>
				Sign in to your account using email/password or Google.
			</Text>
			<View style={styles.fullWidth}>
				<FormBuilder
					control={control}
					setFocus={setFocus}
					formConfigArray={[
						{
							name: "email",
							type: "email",
							rules: {
								required: {
									value: true,
									message: "Email is required",
								},
								pattern: {
									value: /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
									message: "Email is invalid",
								},
							},
							textInputProps: {
								label: "Email",
							},
						},
						{
							name: "password",
							type: "password",
							rules: {
								required: {
									value: true,
									message: "Password is required",
								},
								minLength: {
									value: 8,
									message:
										"Password should be atleast 8 characters",
								},
								maxLength: {
									value: 30,
									message:
										"Password should be between 8 and 30 characters",
								},
							},
							textInputProps: {
								label: "Password",
							},
						},
					]}
				/>
			</View>
			<Button
				mode="contained"
				onPress={handleSubmit(() => login())}
				style={styles.fullWidth}
			>
				Login
			</Button>
			<Text
				style={{ marginTop: 16, marginBottom: 32, textAlign: "center" }}
			>
				Don't have an account?{" "}
				<Text
					style={{ textDecorationLine: "underline" }}
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
	const { control, setFocus, handleSubmit } = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});
	const { user, setUser } = useContext(AuthContext);
	const toaster = useToast();
	const provider = new GoogleAuthProvider();

	const register = () => {
		createUserWithEmailAndPassword(
			auth,
			control._formValues.email,
			control._formValues.password
		)
			.then((userCredential) => {
				// Signed up
				const user = userCredential.user;
				setUser(user);
				toaster.show({
					message: "Registration successful",
					duration: 2000,
					type: "success",
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				toaster.show({
					message: `${errorCode}: Registration failed, ${errorMessage}`,
					duration: 2000,
					type: "error",
				});
			});
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollView}>
			<View style={styles.centered}>
				<Text variant="titleLarge" style={styles.title}>
					Create an account
				</Text>
				<Text variant="titleMedium" style={styles.subtitle}>
					Sign up to get started with our platform.
				</Text>

				<View style={styles.fullWidth}>
					<FormBuilder
						control={control}
						setFocus={setFocus}
						formConfigArray={[
							{
								name: "firstName",
								type: "text",
								rules: {
									required: {
										value: true,
										message: "First name is required",
									},
								},
								textInputProps: {
									label: "First Name",
								},
							},
							{
								name: "lastName",
								type: "text",
								rules: {
									required: {
										value: true,
										message: "Last name is required",
									},
								},
								textInputProps: {
									label: "Last Name",
								},
							},
							{
								name: "email",
								type: "email",
								rules: {
									required: {
										value: true,
										message: "Email is required",
									},
									pattern: {
										value: /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
										message: "Email is invalid",
									},
								},
								textInputProps: {
									label: "Email",
								},
							},
							{
								name: "password",
								type: "password",
								rules: {
									required: {
										value: true,
										message: "Password is required",
									},
									minLength: {
										value: 8,
										message:
											"Password should be atleast 8 characters",
									},
									maxLength: {
										value: 30,
										message:
											"Password should be between 8 and 30 characters",
									},
								},
								textInputProps: {
									label: "Password",
								},
							},
							{
								name: "confirmPassword",
								type: "password",
								rules: {
									required: {
										value: true,
										message: "Confirm password is required",
									},
									validate: {
										value: (value: string) =>
											value ===
											control._formValues.password,
									},
								},
								textInputProps: {
									label: "Confirm Password",
								},
							},
						]}
					/>
				</View>
				<Button
					mode="contained"
					onPress={() => register()}
					style={styles.fullWidth}
				>
					Register
				</Button>
				<Text
					style={{
						marginTop: 16,
						marginBottom: 32,
						textAlign: "center",
					}}
				>
					Already have an account?{" "}
					<Text
						style={{ textDecorationLine: "underline" }}
						onPress={() => setAuthType("login")}
					>
						Login
					</Text>
				</Text>
			</View>
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
		paddingTop: "40%",
		paddingBottom: "25%",
	},
});
