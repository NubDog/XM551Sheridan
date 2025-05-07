import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const QuadraticEquation = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState('');

  const solveEquation = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setResult('Vui lòng nhập số hợp lệ');
      return;
    }

    if (numA === 0) {
      setResult('Đây không phải là phương trình bậc 2');
      return;
    }

    const delta = numB * numB - 4 * numA * numC;

    if (delta < 0) {
      setResult('Phương trình vô nghiệm');
    } else if (delta === 0) {
      const x = -numB / (2 * numA);
      setResult(`Phương trình có nghiệm kép x = ${x}`);
    } else {
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA);
      setResult(`Phương trình có 2 nghiệm:\nx₁ = ${x1}\nx₂ = ${x2}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc 2: ax² + bx + c = 0</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số a"
        value={a}
        onChangeText={setA}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số b"
        value={b}
        onChangeText={setB}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số c"
        value={c}
        onChangeText={setC}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={solveEquation}>
        <Text style={styles.buttonText}>Giải</Text>
      </TouchableOpacity>
      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuadraticEquation; 