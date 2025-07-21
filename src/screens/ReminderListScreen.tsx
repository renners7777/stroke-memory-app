import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native'; // Import Alert for feedback
import ReminderItem from '../components/ReminderItem';
import firestore from '@react-native-firebase/firestore';


interface Reminder {
  id: string;
  text: string;
  time: string; // Or a Date type
  completed: boolean; // Add a completed status field
  // Add other reminder properties as needed
}

const ReminderListScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders from Firestore
  useEffect(() => {
    const subscriber = firestore()
      .collection('reminders')
      // Add queries here to filter or order reminders (e.g., by user ID, by date)
      .onSnapshot(querySnapshot => {
        const fetchedReminders: Reminder[] = [];
        querySnapshot.forEach(documentSnapshot => {
          fetchedReminders.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          } as Reminder);
        });
        setReminders(fetchedReminders);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  // Function to handle completing a reminder
  const handleCompleteReminder = async (reminderId: string) => {
    try {
      await firestore()
        .collection('reminders')
        .doc(reminderId)
        .update({
          completed: true,
          completedAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert("Success", "Reminder marked as complete!");
    } catch (error) {
      console.error("Error marking reminder as complete: ", error);
      Alert.alert("Error", "Failed to mark reminder as complete.");
    }
  };

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReminderItem
            reminder={item}
            onComplete={handleCompleteReminder}
          />
        )}
      />
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
});

export default ReminderListScreen;
