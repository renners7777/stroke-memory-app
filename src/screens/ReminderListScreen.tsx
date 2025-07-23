import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Platform } from 'react-native';
import ReminderItem from '../components/ReminderItem';
import { firestore } from '../utils/firebase'; // Import firestore from the helper file
import { useNavigation } from '@react-navigation/native'; // Make sure this line is present

// Import necessary types from the Firebase web SDK
import type {
  QuerySnapshot,
  DocumentSnapshot,
  FirestoreError,
} from 'firebase/firestore';

// Import serverTimestamp from the correct SDK based on platform
const FieldValue = {
  serverTimestamp: () => Platform.OS === 'web'
    ? require('firebase/firestore').FieldValue.serverTimestamp() // Use web SDK FieldValue
    : require('@react-native-firebase/firestore').FieldValue.serverTimestamp(), // Use native SDK FieldValue
};

interface Reminder {
  id: string;
  text: string;
  time: string; // Or a Date type
  completed: boolean; // Add a completed status field
  // Add other reminder properties as needed
}

const ReminderListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders from Firestore
  useEffect(() => {
    const subscriber = (firestore as any) // Explicitly cast to any
  .collection('reminders')
      .orderBy('time')
      .onSnapshot(
        (querySnapshot: QuerySnapshot) => { // Add type annotation
          const fetchedReminders: Reminder[] = [];
          querySnapshot.forEach((documentSnapshot: DocumentSnapshot) => { // Add type annotation
            fetchedReminders.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            } as Reminder);
          });
          setReminders(fetchedReminders);
          setLoading(false);
        },
        (error: FirestoreError) => { // Add type annotation
          console.error("Error fetching reminders: ", error);
          setLoading(false);
          Alert.alert("Error", "Failed to fetch reminders.");
        }
      );

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  // Function to handle completing/uncompleting a reminder
  const handleToggleCompleteReminder = async (reminderId: string, currentStatus: boolean) => {
    try {
      await (firestore as any) // Explicitly cast to any
  .collection('reminders')
        .doc(reminderId)
        .update({
          completed: !currentStatus,
          completedAt: !currentStatus ? FieldValue.serverTimestamp() : null,
        });
    } catch (error) {
      console.error("Error toggling reminder completion: ", error);
      Alert.alert("Error", "Failed to update reminder status.");
    }
  };

  // Function to navigate to the Add Reminder screen
  const goToAddReminder = () => {
    navigation.navigate('AddReminder' as never);
  };


  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  if (reminders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's Reminders</Text>
        <Text style={styles.noRemindersText}>No reminders yet. Tap + to add one.</Text>
        <TouchableOpacity style={styles.addButton} onPress={goToAddReminder}>
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReminderItem
            reminder={item}
            onComplete={() => handleToggleCompleteReminder(item.id, item.completed)}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={goToAddReminder}>
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noRemindersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReminderListScreen;
