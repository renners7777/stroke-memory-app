import React from 'react';
import { Platform } from 'react-native'; // Import Platform
import firebase from '@react-native-firebase/app'; // Import react-native-firebase core

import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from '@env';

// Import Firebase modules from the web SDK for web builds
import * as firebaseWeb from 'firebase/app';
import 'firebase/firestore'; // Import Firestore from the web SDK

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReminderListScreen from './src/screens/ReminderListScreen';
import AddReminderScreen from './src/screens/AddReminderScreen';


console.log("App.tsx: Before firebaseConfig");

const firebaseConfig: any = {
  apiKey: API_KEY || null,
  authDomain: AUTH_DOMAIN || null,
  projectId: PROJECT_ID || null,
  storageBucket: STORAGE_BUCKET || null,
  messagingSenderId: MESSAGING_SENDER_ID || null,
  appId: APP_ID || null,
  measurementId: MEASUREMENT_ID || null,
  databaseURL: undefined,
};

console.log("App.tsx: After firebaseConfig", firebaseConfig);

const isFirebaseConfigValid = (config: any): boolean => {
  const isValid = (
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
  console.log("App.tsx: isFirebaseConfigValid", isValid, config);
  return isValid;
};


console.log("App.tsx: Before Firebase initialization check");
if (!firebase.apps.length && (!('__FIREBASE_WEB_INITIALIZED__' in global) || !(global as any).__FIREBASE_WEB_INITIALIZED__) && isFirebaseConfigValid(firebaseConfig)) { // Add web check
  console.log("App.tsx: Initializing Firebase...");

  if (Platform.OS === 'web') {
    try {
      firebaseWeb.initializeApp(firebaseConfig);
      (global as any).__FIREBASE_WEB_INITIALIZED__ = true; // Mark web initialized
      console.log("App.tsx: Firebase Web SDK initialized successfully!");
    } catch (error) {
      console.error("App.tsx: Error during Firebase Web SDK initialization:", error);
    }
  } else {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log("App.tsx: React Native Firebase initialized successfully!");
    } catch (error) {
      console.error("App.tsx: Error during React Native Firebase initialization:", error);
    }
  }

} else if (firebase.apps.length > 0 || (Platform.OS === 'web' && ('__FIREBASE_WEB_INITIALIZED__' in global) && (global as any).__FIREBASE_WEB_INITIALIZED__)) { // Update check
  console.log("App.tsx: Firebase already initialized.");
  // No need to call .app() here unless you specifically need a non-default app instance
} else {
  console.error("App.tsx: Firebase configuration is missing or invalid, skipping initialization.");
}
console.log("App.tsx: After Firebase initialization logic");


const Stack = createNativeStackNavigator();

console.log("App.tsx: Before App component return");

const App = () => {
  console.log("App component rendering...");
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

console.log("App.tsx: After App component definition");

export default App;
