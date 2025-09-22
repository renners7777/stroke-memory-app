import { account } from '@/lib/appwrite';
import { sendTestMessage, testCompanionConnection } from '@/lib/companionSync';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export function CompanionSiteStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    loading: boolean;
    error?: string;
    lastSync?: string;
  }>({
    connected: false,
    loading: true
  });

  const checkConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      const result = await testCompanionConnection();
      
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStatus({
          connected: true,
          loading: false,
          lastSync: result.timestamp
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setStatus({
          connected: false,
          loading: false,
          error: result.error,
          lastSync: result.timestamp
        });
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStatus({
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const sendTest = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      const user = await account.get();
      const result = await sendTestMessage(user.$id);
      
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStatus(prev => ({
          ...prev,
          loading: false,
          lastSync: result.timestamp
        }));
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: result.error
        }));
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.statusRow}>
        <ThemedText style={styles.title}>Companion Site Status</ThemedText>
        {status.loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={[
            styles.statusIndicator,
            { backgroundColor: status.connected ? '#4CAF50' : '#F44336' }
          ]} />
        )}
      </View>

      {status.lastSync && (
        <ThemedText style={styles.timestamp}>
          Last sync: {new Date(status.lastSync).toLocaleTimeString()}
        </ThemedText>
      )}

      {status.error && (
        <ThemedText style={styles.error}>{status.error}</ThemedText>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.checkButton]}
          onPress={checkConnection}
          disabled={status.loading}
        >
          <ThemedText style={styles.buttonText}>Check Connection</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={sendTest}
          disabled={status.loading}
        >
          <ThemedText style={styles.buttonText}>Send Test Message</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  error: {
    color: '#F44336',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  checkButton: {
    backgroundColor: '#2196F3',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});