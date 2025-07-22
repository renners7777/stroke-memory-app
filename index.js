/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native'; // Import Platform
import App from './App';
import { name as appName } from './app.json';

// For web, explicitly render the app
if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
} else {
  // For native platforms, just register the component
  AppRegistry.registerComponent(appName, () => App);
}
