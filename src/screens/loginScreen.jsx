import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../firebase/firebase';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Login Successful');

      await AsyncStorage.setItem('userEmail', email);

      navigation.navigate('Task');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  GoogleSignin.configure({
    webClientId:"568453445836-vl9odcq1e15md8ss5595ggfa5l3ko9eu.apps.googleusercontent.com", 
   offlineAccess:true,

  });
  const handleGoogleLogin = async () => {
    try {
      console.log("Checking for Play Services");
      await GoogleSignin.hasPlayServices();
      console.log("Play Services available");
      
      const googleUser = await GoogleSignin.signIn();
      console.log("Google User:", googleUser);
  
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Sign in error:", JSON.stringify(error)); // Log full error
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available");
      } else {
        console.error("Sign in error:", error);
      }
    }
  };
  


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.blodText}> Lets Sign you in </Text>
        <View style={{marginTop: 5, marginLeft: 5}}>
          <Text style={styles.text}>Welcome Back,</Text>
          <Text style={styles.text}>You have been missed</Text>
        </View>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={'black'}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={'black'}
        />
        <View>
          <TouchableOpacity style={styles.loginBTN} onPress={handleLogin}>
            <Text style={{color: 'white', fontWeight: '600'}}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register here
        </Text>
      <View>
        <TouchableOpacity style={styles.googlebtn} onPress={handleGoogleLogin}>
        <Image style={styles.google} source={require("../../Assets/google_login.png")}/>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 50,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: 'black',
    borderRadius: 5,
    height: 50,
  },
  link: {
    marginTop: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: '700',
  },
  blodText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '700',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 50,
  },
  loginBTN: {
    backgroundColor: '#6d64fd',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  google:{
    width:40,
    height:40
  },
  googlebtn:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40
  }
});

export default LoginScreen;
