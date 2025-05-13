import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProductManager from './ProductManager';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ProductManager />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default App; 