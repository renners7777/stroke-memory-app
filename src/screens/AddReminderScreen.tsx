import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


const AddReminderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  // Add state for repeat options later

  // Function to handle saving the reminder
  const handleSaveReminder = async () => {
    if (task.trim() === '' || time.trim() === '') {
      Alert.alert("Missing Information", "Please enter both task and time.");
      return;
    }

    try {
      await firestore()
        .collection('reminders')
        .add({
          text: task,
          time: time, // You might want to store time in a more structured format (e.g., Date object)
          completed: false, // New reminders are not completed
          createdAt: firestore.FieldValue.serverTimestamp(), // Add a creation timestamp
          // Add other reminder properties here (e.g., user ID for filtering)
        });

      Alert.alert("Success", "Reminder saved successfully!");
      navigation.goBack(); // Navigate back to the previous screen (ReminderListScreen)
    } catch (error) {
      console.error("Error saving reminder: ", error);
      Alert.alert("Error", "Failed to save reminder.");
    }
  };

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
    backgroundColor: '#28A745', // Green background for save button
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
    backgroundColor: '#6C757D', // Gray background for cancel button
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
