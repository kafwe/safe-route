// app/_layout.tsx
import React, { useEffect, useState } from "react";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";

import AuthContext from "@/lib/contexts/authContext";
import User from "@/lib/types/user";
import { NavigationProvider } from "@/components/navigation/NavigationContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	const [user, setUser] = useState<User | undefined>(undefined);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<PaperProvider>
				<ToastProvider>
					<AuthContext.Provider value={{ user, setUser }}>
						<Stack>
							<Stack.Screen
								name="index"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="onboarding/car"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="onboarding/preferences"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="SearchPage"
								options={{ title: "Search" }}
							/>
							<Stack.Screen name="+not-found" />
						</Stack>
					</AuthContext.Provider>
				</ToastProvider>
			</PaperProvider>
		</ThemeProvider>
	);
}
