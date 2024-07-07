// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";

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
	const router = useRouter();


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
      <ToastProvider>
        <NavigationProvider>
          <Stack>
            <Stack.Screen
              name="auth/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="index"
              options={{
                title: "SafeRoute",
                headerShown: false,
              }}
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
            <Stack.Screen
              name="report"
              options={{ title: "Report an incident" }}
            />
            {/* <Stack.Screen
              name="account"
              options={{ title: "Account" }}
            /> */}
            <Stack.Screen name="+not-found" />
          </Stack>
        </NavigationProvider>
        </ToastProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
