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
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Task" component={TaskScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
