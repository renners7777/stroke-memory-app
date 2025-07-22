/**
 * @format
 */

// Import the setimmediate polyfill at the very top
import 'setimmediate';

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import appJson from './app.json'; // Import the entire app.json object

// Access the app name from the imported object
const appName = appJson.expo.name;

// Explicitly register the component BEFORE running the application
AppRegistry.registerComponent(appName, () => App);

// For web, explicitly run the application
if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
