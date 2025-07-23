import firebase from '@react-native-firebase/app';
import firestoreNative from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import type { Firestore as FirestoreWeb } from 'firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Import the web app functions
import * as firebaseWeb from 'firebase/app'; // Add this line


type PlatformFirestore = FirestoreWeb | FirebaseFirestoreTypes.Module;


const getPlatformSpecificFirestore = (): PlatformFirestore => {
  if (Platform.OS === 'web') {
    if (firebaseWeb.getApps().length === 0) {
      console.error("Firebase Web App not initialized when trying to get Firestore.");
      throw new Error("Firebase Web App not initialized.");
    }
    return require('firebase/firestore').getFirestore(firebaseWeb.getApps()[0]) as FirestoreWeb;
  } else {
    if (firebase.apps.length === 0) {
       console.error("React Native Firebase App not initialized when trying to get Firestore.");
       throw new Error("React Native Firebase App not initialized.");
    }
    return firestoreNative();
  }
};

export { getPlatformSpecificFirestore };
