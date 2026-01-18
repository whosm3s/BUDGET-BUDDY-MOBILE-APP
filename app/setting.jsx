import React, { useState } from 'react';
import {StyleSheet,View,Text,ScrollView,Switch,Platform,StatusBar,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './component/header';

const SettingsScreen = () => {
  // State for the toggle switches
  const [budgetExceeded, setBudgetExceeded] = useState(true);
  const [budgetNearing, setBudgetNearing] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);

  // Reusable Component for the setting rows
  const SettingRow = ({ title, description, value, onValueChange }) => (
    <View style={styles.settingBox}>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: '#D1D1D1', true: '#9DB39B' }} // Sage green for 'on'
        thumbColor={'#FFFFFF'}
        ios_backgroundColor="#D1D1D1"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Common Header */}
      <Header />

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.content}>
        {/* Screen Title */}
        <Text style={styles.mainTitle}>Settings</Text>

        {/* Budget Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Budget alerts</Text>
          <SettingRow
            title="Budget exceeded"
            description="Get notified when you're close to exceeding your budget."
            value={budgetExceeded}
            onValueChange={setBudgetExceeded}
          />
          <SettingRow
            title="Budget nearing limit"
            description="Receive alerts when you're nearing your budget limit."
            value={budgetNearing}
            onValueChange={setBudgetNearing}
          />
        </View>

        {/* Daily Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Daily spending reminders</Text>
          <SettingRow
            title="Daily spending reminder"
            description="Get a daily reminder to track your expenses."
            value={dailyReminder}
            onValueChange={setDailyReminder}
          />
          <SettingRow
            title="Daily spending summary"
            description="Receive a summary of your daily spending."
            value={dailySummary}
            onValueChange={setDailySummary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 40,
  },
  section: {
    marginBottom: 35,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  settingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F0E6',
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5E7D5E',
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#607D8B',
    lineHeight: 18,
  },
});

export default SettingsScreen;
