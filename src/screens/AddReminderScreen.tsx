import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlatformSpecificFirestore } from '../utils/firebase';
import * as Notifications from 'expo-notifications'; // Import expo-notifications

// Import FieldValue helper if you created one for timestamps
// import { FieldValue } from '../utils/firebase'; // Example if you export FieldValue

const FieldValue = { // Copy FieldValue helper if not importing from utils
  serverTimestamp: () => Platform.OS === 'web'
    ? require('firebase/firestore').FieldValue.serverTimestamp()
    : require('@react-native-firebase/firestore').FieldValue.serverTimestamp(),
};


const AddReminderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  // Add state for repeat options later

  // Function to parse time string (e.g., "9:00 AM") into a Date object
  const parseReminderTime = (timeString: string): Date | null => {
    const [timeValue, period] = timeString.split(' ');
    const [hours, minutes] = timeValue.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return null; // Invalid time format
    }

    const date = new Date();
    date.setDate(date.getDate()); // Set to today's date

    let hour = hours;
    if (period && period.toLowerCase() === 'pm' && hour < 12) {
      hour += 12;
    }
    if (period && period.toLowerCase() === 'am' && hour === 12) {
      hour = 0; // 12 AM is midnight
    }

    date.setHours(hour, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds

    // If the parsed time is in the past, schedule for the next day
    if (date < new Date()) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  };


  // Function to handle saving the reminder
  const handleSaveReminder = async () => {
    if (task.trim() === '' || time.trim() === '') {
      Alert.alert("Missing Information", "Please enter both task and time.");
      return;
    }

    const reminderTimeDate = parseReminderTime(time.trim());

    if (!reminderTimeDate) {
       Alert.alert("Invalid Time", "Please enter a valid time (e.g., 9:00 AM).");
       return;
    }


    try {
      // Save reminder to Firestore
      const newReminderRef = await (getPlatformSpecificFirestore as any)
        .collection('reminders')
        .add({
          text: task,
          time: time.trim(), // Save original time string
          completed: false,
          createdAt: FieldValue.serverTimestamp(),
          // Add other reminder properties here (e.g., user ID for filtering)
        });

      const reminderId = newReminderRef.id; // Get the ID of the new document

      // Schedule a local notification
      const notificationContent = {
        title: 'Reminder',
        body: task,
        data: { reminderId: reminderId, reminderText: task, reminderTime: time.trim() }, // Pass reminder data
      };

      const trigger = {
        date: reminderTimeDate,
      };

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: trigger,
      });

      console.log("Reminder saved and notification scheduled:", reminderId);


      Alert.alert("Success", "Reminder saved successfully!");
      navigation.goBack(); // Navigate back to the previous screen (ReminderListScreen)
    } catch (error) {
      console.error("Error saving reminder: ", error);
      Alert.alert("Error", "Failed to save reminder.");
    }
  };

  // ... rest of your component ...

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Task"
        value={task}
        onChangeText={setTask}
      />

      <TextInput
        style={styles.input}
        placeholder="Time (e.g., 9:00 AM)"
        value={time}
        onChangeText={setTime}
        // Consider adding input masks or a time picker later
      />

      {/* Add input for repeat options later */}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveReminder}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddReminderScreen;
