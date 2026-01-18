import React from 'react';
import {StyleSheet,View,Text,ScrollView,TouchableOpacity,StatusBar,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from './component/header';

// Simple Bar Chart Component
const BarChart = ({ data, labels }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  const chartHeight = 100; // Max height of a bar in pixels

  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => {
        const barHeight = maxVal > 0 ? (item.value / maxVal) * chartHeight : 0;
        return (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: barHeight,
                  backgroundColor: item.color || '#A0C4E9',
                },
              ]}
            />
            <Text style={styles.barLabel}>{labels[index]}</Text>
          </View>
        );
      })}
    </View>
  );
};

const DashboardScreen = () => {
  const summaryData = {
    totalIncome: 0,
    remainingBudget: 0,
    totalSpending: 0,
  };

  const spendingBreakdownData = [
    { value: 0, color: '#A0C4E9' }, // Needs
    { value: 0, color: '#B2C2A9' }, // Wants
    { value: 0, color: '#A0C4E9' }, // Savings
  ];

  const spendingLabels = ['Needs', 'Wants', 'Savings'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Shared Header */}
      <Header />

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryCardsContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.cardTitle}>Total Income</Text>
            <Text style={styles.cardValue}>ETB {summaryData.totalIncome.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.remainingCard]}>
            <Text style={styles.cardTitle}>Remaining Budget</Text>
            <Text style={styles.cardValue}>ETB {summaryData.remainingBudget.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.summaryCardsContainer}>
          <View style={[styles.summaryCard, styles.spendingCard]}>
            <Text style={styles.cardTitle}>Total Spending</Text>
            <Text style={styles.cardValue}>ETB {summaryData.totalSpending.toFixed(2)}</Text>
          </View>
        </View>

        {/* Dashboard Section */}
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionHeader}>Dashboard</Text>
          <TouchableOpacity 
            style={styles.inputIncomeButton}
            onPress={() => router.push('/income')}
          >
            <Text style={styles.inputIncomeButtonText}>INPUT INCOME</Text>
          </TouchableOpacity>
        </View>

        {/* Spending Breakdown Section */}
        <View style={styles.spendingSection}>
          <Text style={styles.sectionHeader}>Spending Breakdown</Text>
          <View style={styles.spendingByCategory}>
            <Text style={styles.categoryTitle}>Spending by Category</Text>
            <Text style={styles.categoryValue}>ETB {summaryData.totalSpending.toFixed(2)}</Text>
            <Text style={styles.categoryLabel}>This Month</Text>

            {/* Bar Chart Component */}
            <BarChart data={spendingBreakdownData} labels={spendingLabels} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  mainScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeCard: {
    backgroundColor: '#D3E5C9',
  },
  remainingCard: {
    backgroundColor: '#C0D8ED',
  },
  spendingCard: {
    backgroundColor: '#C0D8ED',
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dashboardSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  inputIncomeButton: {
    backgroundColor: '#C7D6BF',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIncomeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  spendingSection: {
    marginTop: 10,
  },
  spendingByCategory: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  categoryValue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 30,
    borderRadius: 5,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 12,
    color: '#555',
  },
});

export default DashboardScreen;
