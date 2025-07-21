import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ReminderItem from '../components/ReminderItem';
import firestore from '@react-native-firebase/firestore'; // Import firestore


interface Reminder {
  id: string;
  text: string;
  time: string; // Or a Date type
  // Add other reminder properties as needed
}

const ReminderListScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]); // 'reminders' state variable
  const [loading, setLoading] = useState(true);

  // Fetch reminders from Firestore
  useEffect(() => {
    const subscriber = firestore()
      .collection('reminders') // Assuming you have a 'reminders' collection
      // Add queries here to filter or order reminders (e.g., by user ID, by date)
      .onSnapshot(querySnapshot => {
        const fetchedReminders: Reminder[] = []; // Use a different name, e.g., 'fetchedReminders'
        querySnapshot.forEach(documentSnapshot => {
          fetchedReminders.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          } as Reminder);
        });
        setReminders(fetchedReminders); // Update the state with 'fetchedReminders'
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReminderItem reminder={item} />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // White background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ReminderListScreen;
