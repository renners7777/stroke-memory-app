import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { account } from '@/lib/appwrite';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await account.createAnonymousSession();
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Welcome to Stroke Memory</ThemedText>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      <Button 
        onPress={handleAnonymousLogin}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Loading...' : 'Continue as Guest'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    minWidth: 200,
  },
});