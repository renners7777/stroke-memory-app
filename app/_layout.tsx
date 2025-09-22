import { account } from '@/lib/appwrite';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // Check if we have a valid session
        await account.getSession('current');
      } catch (e) {
        // No valid session, that's okay
        console.log('No active session');
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}