import React from 'react';
import firebase from '@react-native-firebase/app';

import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from '@env';

// Import React Navigation components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import ReminderListScreen from './src/screens/ReminderListScreen';
import AddReminderScreen from './src/screens/AddReminderScreen'; // Import AddReminderScreen
// Import other screens as you create them


// Your Firebase project configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  databaseURL: undefined
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

// Create a Stack Navigator
const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Define your screens */}
        <Stack.Screen
          name="Reminders"
          component={ReminderListScreen}
          options={{ title: 'My Reminders' }}
        />
        {/* Add the AddReminderScreen to the stack */}
        <Stack.Screen
          name="AddReminder" // Name of the screen (matches the navigation.navigate call)
          component={AddReminderScreen} // The component to render
          options={{ title: 'Add Reminder' }} // Options for the header title
        />
        {/* Add other screens here as you create them */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Removed: const styles = StyleSheet.create({...}); // Already removed in previous step


export default App;
