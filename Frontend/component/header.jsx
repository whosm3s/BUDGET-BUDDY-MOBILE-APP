import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Header = () => {
  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Navigation Items */}
      <View style={styles.navItems}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}><Text style={styles.navText}>Dashboard</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/expense')}><Text style={styles.navText}>Tracking</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/budget')}><Text style={styles.navText}>Budget</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/report')}><Text style={styles.navText}>Reports</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/setting')}><Text style={styles.navText}>Settings</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.userIcon}>👤</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:10,
    paddingVertical: 17,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d1d1ff',
    
  },
  logo: {
    width:60,   // Adjust size to fit your header
    height: 70,
    paddingLeft:75,
    position:'relative',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position:'relative',
  },
  navText: {
    fontSize:12,
    color: '#555',
  },
  userIcon: {
    fontSize: 12,
    color: '#555',

  },
});

export default Header;
