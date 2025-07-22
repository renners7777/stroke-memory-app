import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Import TouchableOpacity

interface ReminderItemProps {
  reminder: {
    id: string;
    text: string;
    time: string; // Or a Date type
    completed: boolean; // <-- This was added
    // Add other reminder properties as needed (e.g., type, recurrence)
  };
  // Add a prop for the complete action
  onComplete: (reminderId: string, currentStatus: boolean) => void; // <-- Handler expects current status
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onComplete }) => {
  // Function to handle toggling reminder completion
  const handleToggleComplete = () => { // <-- Renamed function for clarity
    onComplete(reminder.id, reminder.completed); // <-- Passing current status
    // Later: Add logic here to update the reminder status in Firebase
  };

  return (
    <View style={[styles.container, reminder.completed && styles.completedContainer]}> {/* <-- Conditional style */}
      <View style={styles.reminderDetails}>
        <Text style={[styles.reminderText, reminder.completed && styles.completedText]}>{reminder.text}</Text> {/* <-- Conditional style */}
        <Text style={styles.reminderTime}>{reminder.time}</Text>
        {/* Add more UI elements here for reminder type, etc. */}
      </View>
      {/* Change button text based on completion status */}
      <TouchableOpacity
        style={[styles.completeButton, reminder.completed && styles.completedButton]} // <-- Conditional style
        onPress={handleToggleComplete} // <-- Using the updated handler
      >
        <Text style={styles.completeButtonText}>
          {reminder.completed ? 'Mark as Incomplete' : 'Mark as Complete'} {/* <-- Conditional text */}
        </Text>
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
  completedContainer: { // Style for completed reminders container <-- Added
    backgroundColor: '#d4edda', // Light green background
    borderColor: '#28a745', // Green border
    borderWidth: 1,
  },
  reminderDetails: {
    flex: 1, // Allow details to take up available space
    marginRight: 10, // Add some space between details and button
  },
  reminderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: { // Style for completed reminder text <-- Added
    textDecorationLine: 'line-through', // Strikethrough text
    color: '#666', // Gray out text
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
  completedButton: { // Style for completed reminder button <-- Added
    backgroundColor: '#6c757d', // Gray background
  },
  completeButtonText: {
    color: '#fff', // White text color
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReminderItem;
