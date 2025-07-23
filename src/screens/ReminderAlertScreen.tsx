import React, { useState, useEffect } from 'react'; // Import useEffect
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

// Define the type for the route parameters
type ReminderAlertRouteParamList = {
  ReminderAlert: { reminderId: string; reminderText: string; reminderTime: string };
};

type ReminderAlertRouteProp = RouteProp<ReminderAlertRouteParamList, 'ReminderAlert'>;


const ReminderAlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ReminderAlertRouteProp>();

  const { reminderId, reminderText, reminderTime } = route.params;

  const [showConfirmation, setShowConfirmation] = useState(false); // State to show confirmation prompt

  // Function to handle marking reminder as complete
  const handleComplete = async () => {
    try {
      // TODO: Implement Firebase update: set completed: true and completedAt timestamp
      console.log("Marking reminder as complete:", reminderId); // Placeholder
      // await firestore().collection('reminders').doc(reminderId).update({...});

      // Show confirmation prompt after marking as complete
      setShowConfirmation(true);

    } catch (error) {
      console.error("Error marking reminder as complete: ", error);
      Alert.alert("Error", "Failed to mark reminder as complete.");
    }
  };

  // Function to handle snoozing the reminder
  const handleSnooze = async () => {
    // TODO: Implement snooze logic:
    // - Schedule a new local notification for a later time using expo-notifications
    // - Log interaction: 'snoozed' in Firebase
    console.log("Snoozing reminder:", reminderId); // Placeholder
    Alert.alert("Snooze", "Reminder snoozed for 10 minutes (placeholder).");
    navigation.goBack(); // Close the alert screen after action
  };

  // Function to handle confirmation prompt response
  const handleConfirmationResponse = async (completedTask: boolean) => {
    try {
      // TODO: Implement Firebase update: Log confirmation response ('confirmed' or 'failed_confirmation')
      console.log("Confirmation response for", reminderId, ":", completedTask); // Placeholder
      // await firestore().collection('reminders').doc(reminderId).update({...});

      if (!completedTask) {
        // If user says they didn't complete, potentially re-trigger reminder or escalate
        console.log("User indicated task not completed."); // Placeholder
        Alert.alert("Action Needed", "Please complete the task.");
        // TODO: Implement adaptive logic: Re-trigger reminder or escalate reminder notification
      } else {
        console.log("User confirmed task completed."); // Placeholder
        Alert.alert("Thank you", "Task confirmed.");
      }
      navigation.goBack(); // Close the alert screen after action
    } catch (error) {
      console.error("Error handling confirmation response: ", error);
      Alert.alert("Error", "Failed to record confirmation response.");
    }
  };

  // Close the alert screen if navigated away or after a certain time (optional)
  useEffect(() => {
    // You might want to automatically close this screen after a period
    // or if the user interacts with another part of the app
    const unsubscribe = navigation.addListener('blur', () => {
      // Optional: Handle what happens when the screen loses focus
      console.log("ReminderAlertScreen blurred");
    });

    return unsubscribe;
  }, [navigation]);


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
          <TouchableOpacity style={[styles.button, styles.snoozeButton]} onPress={handleSnooze}>
            <Text style={styles.buttonText}>Snooze 10 min</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Confirmation prompt buttons (Yes, No)
        <View>
          <Text style={styles.confirmationText}>Did you complete this task?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={() => handleConfirmationResponse(true)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => handleConfirmationResponse(false)}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF', // Default button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  snoozeButton: {
    backgroundColor: '#FFC107', // Warning yellow
  },
  confirmationText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  yesButton: {
    backgroundColor: '#28A745', // Success green
  },
  noButton: {
    backgroundColor: '#DC3545', // Danger red
  },
});

export default ReminderAlertScreen;
