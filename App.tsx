import React from 'react';
import firebase from '@react-native-firebase/app'; // Import firebase core
// Import FirebaseOptions type from the appropriate location if needed,
// but often it's inferred or part of the global Firebase types after import.
// If you still get a FirebaseOptions error, you might need a specific type import or declaration.

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
import AddReminderScreen from './src/screens/AddReminderScreen';


console.log("App.tsx: Before firebaseConfig"); // Log 1

// Use 'any' or a more specific type if FirebaseOptions is not directly exportable
const firebaseConfig: any = { // Using 'any' temporarily if FirebaseOptions import fails
  apiKey: API_KEY || null,
  authDomain: AUTH_DOMAIN || null,
  projectId: PROJECT_ID || null,
  storageBucket: STORAGE_BUCKET || null,
  messagingSenderId: MESSAGING_SENDER_ID || null,
  appId: APP_ID || null,
  measurementId: MEASUREMENT_ID || null,
  databaseURL: undefined, // Keep this as undefined
};

console.log("App.tsx: After firebaseConfig", firebaseConfig); // Log 2

const isFirebaseConfigValid = (config: any): boolean => {
  const isValid = (
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
  console.log("App.tsx: isFirebaseConfigValid", isValid, config); // Log 3
  return isValid;
};


console.log("App.tsx: Before Firebase initialization check"); // Log 4
// Initialize Firebase ONLY if config is valid and not already initialized
if (!firebase.apps.length && isFirebaseConfigValid(firebaseConfig)) {
  console.log("App.tsx: Initializing Firebase..."); // Log 5
  const webFirebaseConfig: any = { // Using 'any' temporarily here too
    ...firebaseConfig,
    databaseURL: firebaseConfig.databaseURL === undefined ? '' : firebaseConfig.databaseURL,
  };
  try {
    firebase.initializeApp(webFirebaseConfig);
    console.log("App.tsx: Firebase initialized successfully!"); // Log 6
  } catch (error) {
    console.error("App.tsx: Error during Firebase initialization:", error); // Log 7
  }
} else if (firebase.apps.length > 0) {
  console.log("App.tsx: Firebase already initialized."); // Log 8
  firebase.app();
} else {
  console.error("App.tsx: Firebase configuration is missing or invalid, skipping initialization."); // Log 9
}
console.log("App.tsx: After Firebase initialization logic"); // Log 10


// Create a Stack Navigator
const Stack = createNativeStackNavigator();

console.log("App.tsx: Before App component return"); // Log 11

const App = () => {
  console.log("App component rendering..."); // Log 12
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Reminders"
          component={ReminderListScreen}
          options={{ title: 'My Reminders' }}
        />
        <Stack.Screen
          name="AddReminder"
          component={AddReminderScreen}
          options={{ title: 'Add Reminder' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

console.log("App.tsx: After App component definition"); // Log 17

export default App;
