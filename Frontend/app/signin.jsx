import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signIn } from '../utils/api'; // Import the signIn function

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const openLinkedIn = () => { Linking.openURL('https://www.linkedin.com'); };
  const openInstagram = () => { Linking.openURL('https://www.instagram.com'); };
  const openGoogle = () => { Linking.openURL('https://www.google.com'); };

  const handleSignIn = async () => {
    // Basic validation
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting sign in with email:', email.trim());
      
      // Use the signIn function from utils/api.js
      const user = await signIn(email, password);
      
      console.log('✅ Sign in successful, user:', user.name);
      
      // Navigate to dashboard
      router.replace("/dashboard");
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      Alert.alert(
        'Sign In Failed', 
        'Invalid email or password. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Direct fetch version (if you prefer not to use utils/api.js)
  const handleSignInDirect = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Signing in with:', { email: email.trim(), password: '***' });
      
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('Token stored:', data.token.substring(0, 20) + '...');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User stored:', data.user);
      }

      console.log("Signed in user:", data.user);
      
      // Navigate to dashboard
      router.replace("/dashboard");

    } catch (error) {
      console.error('Sign in error details:', error);
      Alert.alert('Sign In Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
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
              autoComplete="email"
              editable={!loading}
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
              editable={!loading}
            />
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => Alert.alert('Info', 'Forgot password feature coming soon!')}>
          <Text style={styles.forgotPasswordText}>Forgot your password ?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={[styles.signInButton, loading && styles.signInButtonDisabled]}
          onPress={handleSignIn} // or handleSignInDirect
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => router.push('/signup')}
          disabled={loading}
        >
          <Text style={styles.signUpLinkText}>
            Don't have an account? <Text style={styles.signUpLinkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        {/* Debug Button (remove in production) */}
        {__DEV__ && (
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              console.log('=== DEBUG INFO ===');
              console.log('Email:', email);
              console.log('Password length:', password.length);
              console.log('Token in localStorage:', localStorage.getItem('auth_token'));
              console.log('User in localStorage:', localStorage.getItem('user'));
            }}
          >
            <Text style={styles.debugButtonText}>Debug</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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
    backgroundColor: '#99AF96',
    width: '100%',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7A8C78',
  },
  signInButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpLinkText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLinkBold: {
    fontWeight: 'bold',
    color: '#0A66C2',
  },
  debugButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  debugButtonText: {
    fontSize: 12,
    color: '#666',
  },
});

export default SignInScreen;