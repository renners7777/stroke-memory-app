import firebase from '@react-native-firebase/app'; // Keep this import
import firestoreNative from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import { getFirestore, Firestore } from 'firebase/firestore'; // Import Firestore type
import * as firebaseWeb from 'firebase/app';


// Get the Firestore instance based on the platform and cast to Firestore type
const firestore: Firestore = Platform.OS === 'web'
  ? getFirestore(firebaseWeb.getApps()[0]) as Firestore // Cast web instance
  : firestoreNative() as Firestore; // Cast native instance

export { firestore };
