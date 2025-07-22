/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import appJson from './app.json'; // Import the entire app.json object

// Access the app name from the imported object
const appName = appJson.expo.name;

// For web, explicitly render the app
if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
} else {
  // For native platforms, just register the component
  AppRegistry.registerComponent(appName, () => App);
}
