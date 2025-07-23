import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { Platform } from 'react-native';
import { Text } from 'react-native'; // Keep Text for the loading indicator
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

import * as firebaseWeb from 'firebase/app';
// Add this direct import for the Firestore module
import 'firebase/firestore'; // Ensure the side effects of this import are processed

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


console.log("App.tsx: Before App component definition");

const Stack = createNativeStackNavigator();

const App = () => {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false); // State for initialization status

  useEffect(() => {
    console.log("App.tsx useEffect: Checking Firebase initialization status...");
    const initializeFirebase = async () => {
      if (!firebase.apps.length && (!('__FIREBASE_WEB_INITIALIZED__' in global) || !(global as any).__FIREBASE_WEB_INITIALIZED__) && isFirebaseConfigValid(firebaseConfig)) {
        console.log("App.tsx useEffect: Initializing Firebase...");
        if (Platform.OS === 'web') {
          try {
            firebaseWeb.initializeApp(firebaseConfig);
            (global as any).__FIREBASE_WEB_INITIALIZED__ = true;
            console.log("App.tsx useEffect: Firebase Web SDK initialized successfully!");
          } catch (error) {
            console.error("App.tsx useEffect: Error during Firebase Web SDK initialization:", error);
          }
        } else {
          try {
            firebase.initializeApp(firebaseConfig);
            console.log("App.tsx useEffect: React Native Firebase initialized successfully!");
          } catch (error) {
            console.error("App.tsx useEffect: Error during React Native Firebase initialization:", error);
          }
        }
      } else {
        console.log("App.tsx useEffect: Firebase already initialized or config invalid.");
      }

      // After initialization attempt, check if an app is available
      if (firebase.apps.length > 0 || (Platform.OS === 'web' && firebaseWeb.getApps().length > 0)) {
        setIsFirebaseInitialized(true); // Set state to true if initialized
        console.log("App.tsx useEffect: Setting isFirebaseInitialized to true.");
      } else {
        console.error("App.tsx useEffect: Firebase not initialized after attempt.");
        // Handle the case where initialization failed (e.g., show an error screen)
      }
    };

    initializeFirebase();
  }, []); // Run this effect only once on mount

  console.log("App component rendering. isFirebaseInitialized:", isFirebaseInitialized);

  if (!isFirebaseInitialized) {
    console.log("App component: Firebase not initialized, rendering loading/null.");
    // You could render a loading spinner or splash screen here
    return <Text>Loading...</Text>; // Or return null
  }

  console.log("App component: Firebase initialized, rendering NavigationContainer.");
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
