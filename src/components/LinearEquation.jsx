import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LinearEquation = () => {
  // Biến lưu hệ số và kết quả
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  // Hàm kiểm tra input có phải số không
  const isNumber = (val) => val !== '' && !isNaN(Number(val));

  // Hàm giải phương trình ax + b = 0
  const solve = () => {
    if (!isNumber(a) || !isNumber(b)) {
      setResult('Vui lòng nhập số cho cả a và b');
      return;
    }
    const numA = Number(a);
    const numB = Number(b);
    if (numA === 0 && numB === 0) {
      setResult('Phương trình có vô số nghiệm');
    } else if (numA === 0) {
      setResult('Phương trình vô nghiệm');
    } else {
      setResult('Nghiệm x = ' + (-numB / numA));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc 1: ax + b = 0</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập a"
        value={a}
        onChangeText={setA}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập b"
        value={b}
        onChangeText={setB}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={solve}>
        <Text style={styles.buttonText}>Giải</Text>
      </TouchableOpacity>
      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#007AFF',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  result: {
    marginTop: 20,
    fontSize: 17,
    textAlign: 'center',
    color: '#333',
    minHeight: 24,
  },
});

export default LinearEquation; 