import firebase from '@react-native-firebase/app';
import firestoreNative from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

// Keep type imports
import type { Firestore as FirestoreWeb } from 'firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import * as firebaseWeb from 'firebase/app';
// Import Firestore as a namespace
import * as firebaseFirestoreWeb from 'firebase/firestore'; // Change this import


type PlatformFirestore = FirestoreWeb | FirebaseFirestoreTypes.Module;


const getPlatformSpecificFirestore = (): PlatformFirestore => {
  console.log("getPlatformSpecificFirestore: Platform.OS", Platform.OS);
  if (Platform.OS === 'web') {
    console.log("getPlatformSpecificFirestore: Checking web app initialization...");
    if (firebaseWeb.getApps().length === 0) {
      console.error("getPlatformSpecificFirestore: Firebase Web App not initialized!");
      throw new Error("Firebase Web App not initialized.");
    }
    console.log("getPlatformSpecificFirestore: Web app initialized. Getting Firestore instance...");
    try {
      // Access getFirestore from the namespace import
      const firestoreInstance = firebaseFirestoreWeb.getFirestore(firebaseWeb.getApps()[0]);
      const firestoreInstanceAny: any = firestoreInstance; // Cast to any for checks

      console.log("getPlatformSpecificFirestore: Web Firestore instance obtained:", firestoreInstanceAny);
       if (typeof firestoreInstanceAny.collection !== 'function') {
         console.error("getPlatformSpecificFirestore: Web Firestore instance does NOT have .collection method!", firestoreInstanceAny);
      }
      return firestoreInstanceAny;
    } catch (error) {
       console.error("getPlatformSpecificFirestore: Error getting Web Firestore instance:", error);
       throw error;
    }
  } else {
    console.log("getPlatformSpecificFirestore: Checking native app initialization...");
    if (firebase.apps.length === 0) {
       console.error("getPlatformSpecificFirestore: React Native Firebase App not initialized.");
       throw new Error("React Native Firebase App not initialized.");
    }
    console.log("getPlatformSpecificFirestore: Native app initialized. Getting Firestore instance...");
    try {
      const firestoreInstance = firestoreNative();
      const firestoreInstanceAny: any = firestoreInstance;

      console.log("getPlatformSpecificFirestore: Native Firestore instance obtained:", firestoreInstanceAny);
       if (typeof firestoreInstanceAny.collection !== 'function') {
         console.error("getPlatformSpecificFirestore: Native Firestore instance does NOT have .collection method!", firestoreInstanceAny);
      }
      return firestoreInstanceAny;
    } catch (error) {
       console.error("getPlatformSpecificFirestore: Error getting Native Firestore instance:", error);
       throw error;
    }
  }
};

export { getPlatformSpecificFirestore };
