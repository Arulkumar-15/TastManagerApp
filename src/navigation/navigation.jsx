// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/loginScreen';
import TaskScreen from '../screens/TaskScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RegisterScreen from '../screens/RegisterScreen';



const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
