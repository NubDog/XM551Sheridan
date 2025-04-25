import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HelloWorld from './components/HelloWorld';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HelloWorld />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;