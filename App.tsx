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
          name="Reminders" // Name of the screen
          component={ReminderListScreen} // The component to render
          options={{ title: 'My Reminders' }} // Options for the screen (e.g., header title)
        />
        {/* Add other screens here as you create them */}
        {/* <Stack.Screen name="AddReminder" component={AddReminderScreen} /> */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// You might still have some global styles, but most screen-specific styles
// will be within the screen components themselves.



export default App;
