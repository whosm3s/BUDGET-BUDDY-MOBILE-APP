import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Header from '../component/header';
import { getIncomes, getExpenses, getBudgets } from '../utils/api';

const ReportScreen = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchReportData();
    }, [])
  );

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [incomesData, expensesData] = await Promise.all([
        getIncomes(),
        getExpenses()
      ]);

      console.log('📊 Incomes data:', incomesData);
      console.log('📊 Expenses data:', expensesData);

      const income = incomesData.total_income || 0;
      const expenses = expensesData.total_spending || 0;
      const remainingAmount = income - expenses;

      console.log('💰 Report - Income:', income, 'Expenses:', expenses, 'Remaining:', remainingAmount);

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setRemaining(remainingAmount);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Monthly Report</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#80b78a" style={styles.loader} />
        ) : (
          <>
            <View style={styles.reportCard}>
              <Text style={styles.cardTitle}>Total Income</Text>
              <Text style={styles.cardValue}>{formatCurrency(totalIncome)}</Text>
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.cardTitle}>Total Expenses</Text>
              <Text style={styles.cardValue}>{formatCurrency(totalExpenses)}</Text>
            </View>

            <View style={[styles.reportCard, remaining >= 0 ? styles.positiveCard : styles.negativeCard]}>
              <Text style={styles.cardTitle}>Remaining</Text>
              <Text style={[styles.cardValue, remaining < 0 && styles.negativeText]}>{formatCurrency(remaining)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positiveCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#80b78a',
  },
  negativeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  negativeText: {
    color: '#ff6b6b',
  },
  loader: {
    marginTop: 50,
  },
});

export default ReportScreen;

