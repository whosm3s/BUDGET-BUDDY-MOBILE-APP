import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './component/header';
import { router } from 'expo-router';

const MonthlyIncomeScreen = () => {
  const [income, setIncome] = useState('');

  // Only allow numbers and one decimal point
  const formatIncome = (text) => {
    let cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      cleanedText = parts[0] + '.' + parts[1];
    }
    setIncome(cleanedText);
  };

  const handleNext = () => {
    console.log('Monthly Income:', income ? parseFloat(income) : 0);
    router.push('/expense');
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
          />
          <Text style={styles.currencyPrefix}>ETB</Text>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
});

export default MonthlyIncomeScreen;
