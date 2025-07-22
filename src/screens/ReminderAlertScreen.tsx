import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


// Define the type for the route parameters
type ReminderAlertRouteParamList = {
  ReminderAlert: { reminderId: string; reminderText: string; reminderTime: string };
};

type ReminderAlertRouteProp = RouteProp<ReminderAlertRouteParamList, 'ReminderAlert'>;


const ReminderAlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ReminderAlertRouteProp>(); // Get route parameters

  const { reminderId, reminderText, reminderTime } = route.params;

  const [showConfirmation, setShowConfirmation] = useState(false); // State to show confirmation prompt

  // Function to handle marking reminder as complete
  const handleComplete = async () => {
    try {
      await firestore()
        .collection('reminders')
        .doc(reminderId)
        .update({
          completed: true,
          completedAt: firestore.FieldValue.serverTimestamp(),
          // Log interaction: 'completed'
        });
      // Optionally schedule a confirmation prompt based on reminder type
      // For now, just show the confirmation prompt directly
      setShowConfirmation(true);
      // Close the alert screen after a delay or user interaction
      // navigation.goBack();
    } catch (error) {
      console.error("Error marking reminder as complete: ", error);
      Alert.alert("Error", "Failed to mark reminder as complete.");
    }
  };

  // Function to handle snoozing the reminder
  const handleSnooze = async () => {
    // TODO: Implement snooze logic:
    // - Schedule a new local notification for a later time
    // - Log interaction: 'snoozed'
    Alert.alert("Snooze", "Reminder snoozed for 10 minutes (placeholder).");
    navigation.goBack(); // Close the alert screen
  };

  // Function to handle confirmation prompt response
  const handleConfirmationResponse = async (completedTask: boolean) => {
    try {
      await firestore()
        .collection('reminders')
        .doc(reminderId)
        .update({
          // Log confirmation response: 'confirmed' or 'failed_confirmation'
          confirmationResponse: completedTask,
          confirmationRespondedAt: firestore.FieldValue.serverTimestamp(),
        });

      if (!completedTask) {
        // If user says they didn't complete, potentially re-trigger reminder or escalate
        Alert.alert("Action Needed", "Please complete the task.");
        // TODO: Implement adaptive logic: Re-trigger reminder or escalate
      } else {
        Alert.alert("Thank you", "Task confirmed.");
      }
      navigation.goBack(); // Close the alert screen
    } catch (error) {
      console.error("Error handling confirmation response: ", error);
      Alert.alert("Error", "Failed to record confirmation response.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      <Text style={styles.reminderTitle}>Reminder:</Text>
      <Text style={styles.reminderText}>{reminderText}</Text>
      <Text style={styles.reminderTime}>Time: {reminderTime}</Text>

      {!showConfirmation ? (
        // Initial buttons (Completed, Snooze)
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSnooze}>
            <Text style={styles.buttonText}>Snooze 10 min</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Confirmation prompt buttons (Yes, No)
        <View>
          <Text style={styles.confirmationText}>Did you complete this task?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleConfirmationResponse(true)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleConfirmationResponse(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  closeButton: {
    position: 'absolute', // Position absolutely
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  reminderTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-around', // Distribute space around buttons
    width: '100%', // Take full width
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1, // Allow buttons to grow and shrink
    marginHorizontal: 5, // Add horizontal margin
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
});

export default ReminderAlertScreen;
