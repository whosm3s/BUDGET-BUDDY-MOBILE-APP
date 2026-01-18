import React, { useState } from 'react';
import {StyleSheet,View,Text,TextInput,TouchableOpacity,Platform,StatusBar,ScrollView,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from './component/header';

const BudgetSettingsScreen = () => {
  const [selectedRule, setSelectedRule] = useState('503020');
  const [needsPercentage, setNeedsPercentage] = useState('50');
  const [wantsPercentage, setWantsPercentage] = useState('30');
  const [savingsPercentage, setSavingsPercentage] = useState('20');

  const total = parseInt(needsPercentage || 0) + parseInt(wantsPercentage || 0) + parseInt(savingsPercentage || 0);
  const exceedsLimit = total > 100;

  const handleSave = () => {
    console.log('Budget Settings Saved:');
    if (selectedRule === 'custom') {
      console.log({
        needs: needsPercentage,
        wants: wantsPercentage,
        savings: savingsPercentage,
      });
    } else {
      console.log('Using 50/30/20 Rule');
    }
    router.push('/setting');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Common Header */}
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Screen Title */}
        <Text style={styles.title}>Budget Settings</Text>

        {/* Budgeting Rule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budgeting Rule</Text>

          {/* 50/30/20 Rule Option */}
          <TouchableOpacity
            style={[
              styles.ruleOption,
              selectedRule === '503020' && styles.ruleOptionSelected,
            ]}
            onPress={() => setSelectedRule('503020')}
          >
            <Text style={styles.ruleTitle}>The 50/30/20 Rule</Text>
            <Text style={styles.ruleSubtitle}>Needs: 50%, Wants: 30%, Savings: 20%</Text>
          </TouchableOpacity>

          {/* Custom Budgeting Option */}
          <TouchableOpacity
            style={[
              styles.ruleOption,
              styles.customRuleOption,
              selectedRule === 'custom' && styles.ruleOptionSelected,
            ]}
            onPress={() => setSelectedRule('custom')}
          >
            <Text style={styles.ruleTitle}>Custom Budgeting</Text>
            <Text style={styles.ruleSubtitle}>Customize your budget allocation percentages</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Budget Allocation Section (only visible when Custom is selected) */}
        {selectedRule === 'custom' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Custom Budget Allocation</Text>
            
            <View style={styles.customAllocationRow}>
              <Text style={styles.label}>Needs (%)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={needsPercentage}
                  onChangeText={setNeedsPercentage}
                  placeholder="50"
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            <View style={styles.customAllocationRow}>
              <Text style={styles.label}>Wants (%)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={wantsPercentage}
                  onChangeText={setWantsPercentage}
                  placeholder="30"
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            <View style={styles.customAllocationRow}>
              <Text style={styles.label}>Savings (%)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={savingsPercentage}
                  onChangeText={setSavingsPercentage}
                  placeholder="20"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            
            {exceedsLimit && (
              <Text style={styles.errorText}>Budget allocation can't exceed 100 percent</Text>
            )}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  ruleOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customRuleOption: {
    backgroundColor: '#B2C2A9',
    borderColor: '#7A8C78',
  },
  ruleOptionSelected: {
    borderColor: '#557A58',
    borderWidth: 2,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  ruleSubtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 5,
  },
  customAllocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
    width: 100,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#E8EDE5',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#333333',
    width: '70%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BudgetSettingsScreen;
