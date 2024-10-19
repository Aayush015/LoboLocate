import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';

export default function App() {
  return <Welcome/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
