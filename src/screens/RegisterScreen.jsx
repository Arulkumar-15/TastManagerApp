import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {auth} from '../firebase/firebase'; // Import Firebase auth

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      // Create user with email and password
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Registration Successful');

      // Save email to AsyncStorage
      await AsyncStorage.setItem('userEmail', email);

      // Navigate to the Task screen after successful registration
      navigation.navigate('Task');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.blodText}>Lets Register </Text>
        <Text style={styles.blodText}>Account</Text>
        <View style={{marginTop:10}}>
          <Text style={styles.text}>Hello user,you have </Text>
          <Text style={styles.text}>a greatful journey</Text>
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
          placeholderTextColor="black"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="black"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="black"
        />
          <View>
        <TouchableOpacity style={styles.loginBTN} onPress={handleRegister}>
          <Text style={{color:"white",fontWeight:"600"}}>Sign in</Text>
        </TouchableOpacity>
       </View>
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login here
        </Text>
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
  loginBTN:{
    backgroundColor:'#6d64fd',
    height:50,
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10
  }
});

export default RegisterScreen;
