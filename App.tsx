import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { Text, Platform, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import * as Notifications from 'expo-notifications';

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
import 'firebase/firestore';

import ReminderListScreen from './src/screens/ReminderListScreen';
import AddReminderScreen from './src/screens/AddReminderScreen';
import ReminderAlertScreen from './src/screens/ReminderAlertScreen'; // Import ReminderAlertScreen


console.log("App.tsx: Before firebaseConfig");

console.log("App.tsx: Module loaded and executing."); // Very early log

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


// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show alert
    shouldPlaySound: true, // Play sound
    shouldSetBadge: false, // Don't set badge count
  }),
});

// Import React Navigation components and types
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // NativeStackNavigationProp is no longer needed


// Define the types for your root stack navigator
export type RootStackParamList = {
  Reminders: undefined;
  AddReminder: undefined;
  ReminderAlert: { reminderId: string; reminderText: string; reminderTime: string };
};

// Define the type for the navigation container ref - No longer needed as we type directly


const App = () => {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [areNotificationsPermitted, setAreNotificationsPermitted] = useState(false);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Declare navigationRef with the type annotation INSIDE the component
  const navigationRef = useNavigationContainerRef<RootStackParamList>();


  useEffect(() => {
    console.log("App.tsx useEffect: Checking Firebase initialization status...");
    const initializeFirebaseAndNotifications = async () => {
      // Firebase Initialization Logic (keep the existing logic here)
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

      // Check if a Firebase app is available after initialization attempt
      if (firebase.apps.length > 0 || (Platform.OS === 'web' && firebaseWeb.getApps().length > 0)) {
        setIsFirebaseInitialized(true);
        console.log("App.tsx useEffect: Setting isFirebaseInitialized to true.");

        // Request Notification Permissions AFTER Firebase is initialized (optional but good practice)
        console.log("App.tsx useEffect: Requesting notification permissions...");
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Permission required', 'Please grant notification permissions to receive reminders.');
          setAreNotificationsPermitted(false);
          return;
        }
        setAreNotificationsPermitted(true);
        console.log("App.tsx useEffect: Notification permissions granted.");

      } else {
        console.error("App.tsx useEffect: Firebase not initialized after attempt. Cannot request notifications.");
      }
    };

    initializeFirebaseAndNotifications();

    // Set up notification listeners AFTER permissions are granted (or after component mounts)
    // Listens for notifications received while the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received in foreground:", notification);
      // You might want to do something when a notification is received in the foreground,
      // but usually, tapping it is handled by the response listener.
    });

    // Listens for users' interaction with notifications (taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response received (tapped):", response);
      const { notification } = response;
      const reminderData = notification.request.content.data; // Get reminder data from notification

      if (reminderData && navigationRef.isReady()) { // Check if navigation is ready
        // Navigate to the ReminderAlertScreen with reminder data
        // 'ReminderAlert' is the screen name in your navigator
        navigationRef.navigate('ReminderAlert', reminderData as RootStackParamList['ReminderAlert']);
      }
    });

    // Clean up listeners on component unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };

  },);

  console.log("App component rendering. isFirebaseInitialized:", isFirebaseInitialized, "areNotificationsPermitted:", areNotificationsPermitted);

  if (!isFirebaseInitialized || !areNotificationsPermitted) {
    console.log("App component: Waiting for initialization and permissions, rendering loading/null.");
    return <Text>Loading...</Text>;
  }

  console.log("App component: Firebase initialized and permissions granted, rendering NavigationContainer.");
  return (
    <NavigationContainer ref={navigationRef}>
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
        {/* Add the ReminderAlertScreen to the stack */}
         <Stack.Screen
          name="ReminderAlert"
          component={ReminderAlertScreen}
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

console.log("App.tsx: After App component definition");

export default App;
