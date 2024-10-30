// React Navigation 
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {colors} from './../components/styles';

const {primary, tertiary} = colors;

// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import ReportLostItem from '../screens/ReportLostItem';
import ReportfoundItem from '../screens/ReportFoundItem';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'transparent'
                    },
                    headerTintColor: tertiary,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeftContainerStyle: {
                        paddingLeft: 20,
                    }
                }}
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen options={{headerTintColor: primary}} name="Welcome" component={Welcome}/>
                <Stack.Screen name="ReportLostItem" component={ReportLostItem}/>
                <Stack.Screen name="ReportFoundItem" component={ReportfoundItem}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;