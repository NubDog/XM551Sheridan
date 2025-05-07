import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GiaoDiennangcao = () => (
  <View style={styles.container}>

    <View style={styles.rowHeader}>
      <View style={styles.logo}><Text style={styles.text}>Logo ở đây</Text></View>
      <View style={styles.header}><Text style={styles.text}>Phần header ở đây</Text></View>
    </View>

    <View style={styles.rowContent}>
      <View style={styles.sidebar}><Text style={styles.text}>Side bar ở đây</Text></View>
      <View style={styles.main}><Text style={styles.text}>Main content ở đây</Text></View>
    </View>
    
    <View style={styles.footer}><Text style={styles.text}>Footer ở đây</Text></View>
  </View>
  
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
    padding: 8,
    borderWidth: 3,
    borderColor: '#222',
  },
  rowHeader: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 3,
    borderColor: '#222',
  },
  logo: {
    flex: 1,
    backgroundColor: '#FFD166',
    borderRightWidth: 3,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 2,
    backgroundColor: '#06D6A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    flex: 3,
    borderBottomWidth: 3,
    borderColor: '#222',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#118AB2',
    borderRightWidth: 3,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 2,
    backgroundColor: '#EF476F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 0.7,
    backgroundColor: '#073B4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GiaoDiennangcao;
