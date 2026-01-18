import React, { useState } from 'react';
import {StyleSheet,View,Text,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,Linking,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const openLinkedIn = () => {Linking.openURL('https://www.linkedin.com');};

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com');
  };

  const openGoogle = () => {
    Linking.openURL('https://www.google.com');

    
  };
 

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        {/* Header Title */}
        <Text style={styles.title}>Sign In to budget buddy</Text>

        {/* Social Media Icons Row */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIconContainer} onPress={openInstagram}>
            <AntDesign name="instagram" size={35} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconContainer} onPress={openLinkedIn}>
            <AntDesign name="linkedin-square" size={35} color="#0A66C2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconContainer} onPress={openGoogle}>
            <FontAwesome name="google" size={35} color="#DB4437" />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>or use your email account</Text>

        {/* Input Fields Container */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Text style={styles.icon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="EMAIL"
              placeholderTextColor="#BDBDBD"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.icon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="PASSWORD"
              placeholderTextColor="#BDBDBD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot your password ?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push('/income')} // Navigate to Monthly Income Screen
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE', // Light gray background
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
    marginBottom: 40,
  },
  socialIconContainer: {
    padding: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 40,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 15,
    // Shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 18,
    color: '#888',
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 60,
  },
  signInButton: {
    backgroundColor: '#99AF96', // Sage green color
    width: '100%',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7A8C78',
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
  },
});

export default SignInScreen;
