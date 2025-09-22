import { account } from '@/lib/appwrite';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Try to get the current session
        await account.get();
      } catch (e) {
        // If there's no session, redirect to sign-in
        router.replace('/sign-in');
      } finally {
        setInitialized(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}