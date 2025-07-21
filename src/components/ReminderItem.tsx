import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReminderItemProps {
  reminder: {
    id: string;
    text: string;
    time: string; // Or a Date type
    // Add other reminder properties as needed (e.g., type, recurrence)
  };
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.reminderText}>{reminder.text}</Text>
      <Text style={styles.reminderTime}>{reminder.time}</Text>
      {/* Add more UI elements here for reminder type, completion status, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
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
});

export default ReminderItem;
