import { account } from '@/lib/appwrite';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Check if we have a valid session
        const session = await account.getSession('current');
        console.log('Session status:', session ? 'Active' : 'None');
        
        if (!session) {
          // No valid session, redirect to auth
          router.replace('/auth');
        } else {
          // Valid session, go to home
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error('Session check failed:', e);
        // On error, redirect to auth
        router.replace('/auth');
      } finally {
        // Hide splash screen and mark as ready
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    }

    prepare();
  }, [router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}