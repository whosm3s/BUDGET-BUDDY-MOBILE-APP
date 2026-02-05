import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../component/header';
import { router } from 'expo-router';
import { saveIncome } from '../utils/api';

const MonthlyIncomeScreen = () => {
  const [income, setIncome] = useState('');
  const [loading, setLoading] = useState(false);

  // Only allow numbers and one decimal point
   const formatIncome = (text) => {
    let cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      cleanedText = parts[0] + '.' + parts[1];
    }
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleanedText = parts[0] + '.' + parts[1].substring(0, 2);
    }
    setIncome(cleanedText);
  };

  const handleNext = async () => {
    if (!income || parseFloat(income) <= 0) {
      Alert.alert('Error', 'Please enter a valid income amount');
      return;
    }

    setLoading(true);
    
    try {
      const incomeAmount = parseFloat(income);
      console.log('💵 Monthly Income:', incomeAmount);
      
      // Get current month in YYYY-MM format
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7); // "2026-02"
      
      // Save income to backend
      const result = await saveIncome({
        amount: incomeAmount,
        month: currentMonth
      });
      
      console.log('✅ Income saved successfully:', result);
      setLoading(false);
      setIncome('');
      
      // Auto-navigate to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ Error saving income:', error);
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to save income. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Common Header */}
      <Header />
    
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.questionText}>What's your monthly income?</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.incomeInput}
            value={income}
            onChangeText={formatIncome}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#888"
             editable={!loading}
          />
          <Text style={styles.currencyPrefix}>ETB</Text>
        </View>

        
        <TouchableOpacity style={[styles.nextButton, loading && styles.nextButtonDisabled]} onPress={handleNext} disabled={loading}>
        {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
                <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => {
            console.log('=== DEBUG ===');
            console.log('Income value:', income);
            console.log('Token in localStorage:', localStorage.getItem('auth_token'));
            console.log('User in localStorage:', localStorage.getItem('user'));
          }}
        >
          <Text style={styles.debugButtonText}>Debug Info</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E5E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incomeInput: {
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    flex: 1,
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#333333',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  debugButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#888888',
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default MonthlyIncomeScreen;
