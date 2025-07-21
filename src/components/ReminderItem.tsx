import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Import TouchableOpacity

interface ReminderItemProps {
  reminder: {
    id: string;
    text: string;
    time: string; // Or a Date type
    // Add other reminder properties as needed (e.g., type, recurrence, completed status)
  };
  // Add a prop for the complete action
  onComplete: (reminderId: string) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onComplete }) => {
  // Placeholder function to handle reminder completion
  const handleComplete = () => {
    onComplete(reminder.id); // Call the onComplete prop with the reminder ID
    // Later: Add logic here to update the reminder status in Firebase
  };

  return (
    <View style={styles.container}>
      <View style={styles.reminderDetails}> {/* Add a View to separate details and button */}
        <Text style={styles.reminderText}>{reminder.text}</Text>
        <Text style={styles.reminderTime}>{reminder.time}</Text>
        {/* Add more UI elements here for reminder type, completion status, etc. */}
      </View>
      {/* Add the "Mark as Complete" button */}
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>Mark as Complete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Distribute space between items
    alignItems: 'center', // Align items vertically
  },
  reminderDetails: {
    flex: 1, // Allow details to take up available space
    marginRight: 10, // Add some space between details and button
  },
  reminderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666', // Gray text color
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50', // Green background color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#fff', // White text color
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReminderItem;
