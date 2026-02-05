import React, {useState, useEffect} from 'react';
import {StyleSheet,View,Text,ScrollView,TouchableOpacity,StatusBar,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from '../component/header';
import { getCurrentUser } from '../utils/api.js';
import { getIncomes, getExpenses, getBudgets } from '../utils/api';
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [budget, setBudget] = useState(null);
  const [expensesByCategory, setExpensesByCategory] = useState({
    Need: 0,
    Want: 0,
    Saving: 0,
  });

// Load user on mount
useEffect(() => {
  const fetchUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        console.log("📦 Loaded user from storage:", parsedUser.name);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

// Refresh user whenever dashboard focuses
useFocusEffect(
  React.useCallback(() => {
    const fetchFreshUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log("✅ Loaded fresh user from backend:", currentUser.name);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching fresh user:", error);
      }
    };

    fetchFreshUser();
  }, [])
);


      useFocusEffect(
  React.useCallback(() => {
    const loadDashboard = async () => {
      try {
        // Reset data while loading
        console.log("🔄 Refreshing dashboard data...");
        
        const incomeRes = await getIncomes();
        const income = incomeRes.total_income || 0;
        console.log("📊 Total Income:", income);
        setTotalIncome(income);

        const expenseRes = await getExpenses();
        const spending = expenseRes.total_spending || 0;
        console.log("💸 Total Spending:", spending);
        setTotalSpending(spending);

        // Calculate remaining budget
        const remaining = income - spending;
        console.log("💰 Remaining Budget:", remaining);

        // Calculate expenses by category
        if (expenseRes.summary) {
          const categoryTotals = {
            Need: expenseRes.summary['Need'] || 0,
            Want: expenseRes.summary['Want'] || 0,
            Saving: expenseRes.summary['Saving'] || 0,
          };
          setExpensesByCategory(categoryTotals);
          console.log("📊 Expenses by category:", categoryTotals);
        } else {
          setExpensesByCategory({
            Need: 0,
            Want: 0,
            Saving: 0,
          });
        }

        const budgetRes = await getBudgets();
        console.log("💰 Loaded budgets:", budgetRes);
        if (budgetRes && budgetRes.length > 0) {
          const latestBudget = budgetRes[budgetRes.length - 1];
          setBudget(latestBudget);
          console.log("✅ Budget set:", latestBudget);
        } else {
          setBudget(null);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setTotalIncome(0);
        setTotalSpending(0);
        setExpensesByCategory({
          Need: 0,
          Want: 0,
          Saving: 0,
        });
        setBudget(null);
      }
    };

    loadDashboard();
  }, [])
);

      
      if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const summaryData = {
    totalIncome: parseFloat(totalIncome) || 0,
    totalSpending: parseFloat(totalSpending) || 0,
    remainingBudget: parseFloat(totalIncome) - parseFloat(totalSpending) || 0,
  };

  console.log('Dashboard Summary:', {
    income: summaryData.totalIncome,
    spending: summaryData.totalSpending,
    remaining: summaryData.remainingBudget,
  });

  // Show budget allocations based on percentages
  const needsAmount = budget ? (totalIncome * budget.needs_percent) / 100 : 0;
  const wantsAmount = budget ? (totalIncome * budget.wants_percent) / 100 : 0;
  const savingsAmount = budget ? (totalIncome * budget.savings_percent) / 100 : 0;

  const spendingBreakdownData = [
    { value: needsAmount, color: '#A0C4E9' }, // Needs (Budget)
    { value: wantsAmount, color: '#B2C2A9' }, // Wants (Budget)
    { value: savingsAmount, color: '#FF9F43' }, // Savings (Budget)
  ];

  const spendingLabels = ['Needs', 'Wants', 'Savings'];

  return (
    
    
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Shared Header */}
      <Header />

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.content}>
         {user ? (
          <Text style={styles.welcomeText}>Welcome {user.name}!</Text>
        ): (<Text style = {styles.welcomeText}>Welcome Guest!</Text>)}
           
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
   welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
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
