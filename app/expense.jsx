import React, { useState } from 'react';
import { StyleSheet,View,Text,TextInput,TouchableOpacity,Platform,StatusBar,ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from './component/header';

const AddExpenseScreen = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    console.log('Saved:', { amount, category, note });
    router.push('/budget');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Use common header */}
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Screen Title */}
        <Text style={styles.title}>Add Your Daily Expense Here</Text>

        {/* Form Container */}
        <View style={styles.form}>
          {/* Amount Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ETB 0.00"
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          {/* Category Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          {/* Note Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Note</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 50,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 60,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#000',
    width: 90,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#D3D9CE',
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2B2B2B',
    width: '60%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
  },
});

export default AddExpenseScreen;
