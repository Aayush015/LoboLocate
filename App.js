import React from 'react';

// React Navigation Stack
import RootStack from './navigators/RootStack';

// Import MenuProvider
import { MenuProvider } from 'react-native-popup-menu'; 

export default function App() {
  return (
    <MenuProvider>
      <RootStack/>
    </MenuProvider>
  );
}