import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import  { useState } from 'react';
import { signUp } from '../utils/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

// const openURL = (url) => {
//   Linking.canOpenURL(url)
//     .then((supported) => {
//       if (supported) {
//         Linking.openURL(url);
//       } else {
//         console.log("Don't know how to open URI: " + url);
//       }
//     })
//     .catch((err) => console.error('An error occurred', err));
// };
 
export default function SignUp() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Attempting signup with:', { 
        name: name.trim(),
        email: email.trim(),
        passwordLength: password.length
      });
      
      const user = await signUp({
        name: name.trim(),
        email: email.trim(),
        password: password
      });
      
      console.log('✅ Signed up user:', user);
      
      if (!user || !user.id) {
        throw new Error('Invalid response from server');
      }
      
      // Clear old storage to ensure fresh data
      await AsyncStorage.removeItem('user');
      
      // Navigate to sign in
      router.replace("/signin");
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('Error message:', error.message);
      Alert.alert(
        'Sign Up Failed', 
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Social Media Icons */}
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity onPress={() => openURL('https://www.instagram.com')}>
          <AntDesign name="instagram" size={40} color="#d81212ff" style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openURL('https://www.linkedin.com')}>
          <AntDesign name="linkedin-square" size={40} color="#0A66C2" style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openURL('https://www.google.com')}>
          <FontAwesome name="google" size={40} color="#DB4437" style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>or use your email for registration</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value = {email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Sign In */}
     
      <TouchableOpacity
        style={styles.signInLinkContainer}
        onPress={() => router.push('/signin')} // Navigate to Sign In
      >
        <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 15,
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signUpButton: {
    backgroundColor: '#80b78a',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInLinkContainer: {
    marginTop: 15,
  },
  signInLinkText: {
    color: '#0A66C2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
});
