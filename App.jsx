import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import LinearEquation from './src/components/LinearEquation';
import QuadraticEquation from './src/components/QuadraticEquation';
import HelloWord0 from './src/components/HelloWord0';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HelloWord0 
          name="Nguyễn Văn A" 
          age={25} 
          address="Hà Nội, Việt Nam" 
        />
        <LinearEquation />
        <QuadraticEquation />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App; 