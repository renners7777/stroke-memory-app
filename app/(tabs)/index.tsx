import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CompanionSiteStatus } from '@/components/CompanionSiteStatus';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { account, databases, UserDocument } from '@/lib/appwrite';

export default function HomeScreen() {
  const [user, setUser] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#333333' }, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        const userData = await databases.getDocument(
          APPWRITE_DATABASE_ID,
          USERS_COLLECTION_ID,
          currentUser.$id
        );
        setUser(userData as UserDocument);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Don't throw the error, just log it and set user to null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <CompanionSiteStatus />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <ThemedText type="subtitle">Your Shareable ID</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color={textColor} />
        ) : user ? (
          <ThemedText style={styles.shareableId} selectable>
            {user.shareable_id}
          </ThemedText>
        ) : (
          <ThemedText>Could not load Shareable ID. Please try again later.</ThemedText>
        )}
        <ThemedText style={styles.cardDescription}>
          Share this ID with your companion to connect your accounts.
        </ThemedText>
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareableId: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    letterSpacing: 2,
  },
  cardDescription: {
    textAlign: 'center',
    color: 'gray',
  },
});
