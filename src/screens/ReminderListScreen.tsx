import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import ReminderItem from '../components/ReminderItem';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook


interface Reminder {
  id: string;
  text: string;
  time: string; // Or a Date type
  completed: boolean; // Add a completed status field
  // Add other reminder properties as needed
}

const ReminderListScreen: React.FC = () => {
  const navigation = useNavigation(); // Get navigation object
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders from Firestore
  useEffect(() => {
    const subscriber = firestore()
      .collection('reminders')
      // Add queries here to filter or order reminders (e.g., by user ID, by date)
      .orderBy('time') // Order by time, for example
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
      }, error => {
        console.error("Error fetching reminders: ", error);
        setLoading(false);
        Alert.alert("Error", "Failed to fetch reminders.");
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  // Function to handle completing/uncompleting a reminder
  const handleToggleCompleteReminder = async (reminderId: string, currentStatus: boolean) => {
    try {
      await firestore()
        .collection('reminders')
        .doc(reminderId)
        .update({
          completed: !currentStatus,
          completedAt: !currentStatus ? firestore.FieldValue.serverTimestamp() : null,
        });
      // UI will automatically update due to onSnapshot listener
    } catch (error) {
      console.error("Error toggling reminder completion: ", error);
      Alert.alert("Error", "Failed to update reminder status.");
    }
  };

  // Function to navigate to the Add Reminder screen
  const goToAddReminder = () => {
    // 'AddReminder' is the name of the screen in your navigator, which we'll define later
    navigation.navigate('AddReminder' as never);
  };


  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Reminders</Text> {/* Updated title */}
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

      {/* Add the "+ Add Reminder" button */}
      <TouchableOpacity style={styles.addButton} onPress={goToAddReminder}>
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      {/* Placeholder for Voice Command button */}
      {/* <TouchableOpacity style={styles.voiceButton} onPress={() => { /* handle voice command */ /* }}>
        <Text style={styles.voiceButtonText}>Voice Command</Text>
      </TouchableOpacity> */}

      {/* Placeholder for Caregiver Status */}
      {/* <View style={styles.caregiverStatus}>
        <Text>Caregiver Status:</Text>
        <Text>- Reminders completed: ...</Text>
        <TouchableOpacity><Text>Send Message</Text></TouchableOpacity>
      </View> */}

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
  // Add styles for voice command and caregiver sections later
});

export default ReminderListScreen;
