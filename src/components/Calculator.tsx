import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

// Kích thước màn hình
const { width } = Dimensions.get('window');

// Màu sắc rực rỡ cho giao diện
const colors = {
  background: '#1A1A2E',
  inputBackground: '#0F3460',
  inputText: '#FFFFFF',
  radioActive: '#E94560',
  radioInactive: '#16213E',
  buttonBackground: '#533483',
  buttonText: '#FFFFFF',
  resultBackground: '#0F3460',
  resultText: '#E94560',
  border: '#5D8BF4',
  shadow: '#5D8BF4',
};

// Định nghĩa type cho operation
interface Operation {
  label: string;
  value: string;
}

// Các phép tính toán
const operations: Operation[] = [
  { label: '+', value: 'add' },
  { label: '-', value: 'subtract' },
  { label: '×', value: 'multiply' },
  { label: '÷', value: 'divide' },
  { label: '%', value: 'percentage' },
  { label: 'x²', value: 'square' },
];

const Calculator = () => {
  // State cho các giá trị nhập và kết quả
  const [firstNumber, setFirstNumber] = useState<string>('');
  const [secondNumber, setSecondNumber] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('add');
  const [result, setResult] = useState<string>('');
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(1));
  
  // Animation effect for result changes
  useEffect(() => {
    if (result) {
      // Fade and scale animation for result
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.elastic(1.2),
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start(() => {
        rotateAnim.setValue(0);
      });
    }
  }, [result]);
  
  // Hàm tính toán kết quả
  const calculateResult = () => {
    // Animate the button
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.elastic(1.5),
      }),
    ]).start();
    
    // Parse input values
    const first = parseFloat(firstNumber);
    const second = parseFloat(secondNumber);
    
    // Check if inputs are valid
    if (isNaN(first)) {
      setResult('Vui lòng nhập số thứ nhất');
      return;
    }
    
    // For operations that need only one number
    if (selectedOperation === 'square') {
      setResult(`${first * first}`);
      return;
    }
    
    // For operations that need two numbers
    if (isNaN(second)) {
      setResult('Vui lòng nhập số thứ hai');
      return;
    }
    
    let calculatedResult: number;
    
    switch (selectedOperation) {
      case 'add':
        calculatedResult = first + second;
        break;
      case 'subtract':
        calculatedResult = first - second;
        break;
      case 'multiply':
        calculatedResult = first * second;
        break;
      case 'divide':
        if (second === 0) {
          setResult('Không thể chia cho 0');
          return;
        }
        calculatedResult = first / second;
        break;
      case 'percentage':
        calculatedResult = (first * second) / 100;
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(`${calculatedResult}`);
  };
  
  // Animation cho kết quả
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Hàm render nút radio
  const renderRadioButton = (op: Operation, index: number) => {
    const isSelected = selectedOperation === op.value;
    
    return (
      <TouchableOpacity
        key={op.value}
        style={styles.radioContainer}
        onPress={() => setSelectedOperation(op.value)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.radioButton,
            {
              backgroundColor: isSelected ? colors.radioActive : colors.radioInactive,
              transform: [
                { scale: isSelected ? 1 : 0.9 },
              ],
            },
          ]}
        >
          <View style={[
            styles.radioInner,
            {
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            },
          ]}>
            <Text style={styles.radioText}>{op.label}</Text>
          </View>
        </Animated.View>
        <Text style={styles.radioLabel}>{op.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Máy Tính</Text>
      
      {/* Input fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Số thứ nhất:</Text>
        <TextInput
          style={styles.input}
          value={firstNumber}
          onChangeText={setFirstNumber}
          keyboardType="numeric"
          placeholder="Nhập số thứ nhất"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Số thứ hai:</Text>
        <TextInput
          style={styles.input}
          value={secondNumber}
          onChangeText={setSecondNumber}
          keyboardType="numeric"
          placeholder="Nhập số thứ hai"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
      </View>
      
      {/* Radio buttons for operations */}
      <Text style={styles.sectionTitle}>Phép tính:</Text>
      <View style={styles.radioGroup}>
        {operations.map((op, index) => renderRadioButton(op, index))}
      </View>
      
      {/* Calculate button */}
      <TouchableOpacity
        onPress={calculateResult}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.calculateButton,
            { transform: [{ scale: buttonAnim }] },
          ]}
        >
          <Text style={styles.calculateButtonText}>Tính</Text>
        </Animated.View>
      </TouchableOpacity>
      
      {/* Result display */}
      <Text style={styles.resultLabel}>Kết quả:</Text>
      <Animated.View
        style={[
          styles.resultContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        <Text style={styles.resultText}>{result || '...'}</Text>
      </Animated.View>
    </View>
  );
};

// Styles cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.inputText,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    marginTop: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  radioContainer: {
    alignItems: 'center',
    marginBottom: 15,
    width: '30%', // 3 buttons per row
  },
  radioButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  radioInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  radioLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  calculateButton: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  calculateButtonText: {
    color: colors.buttonText,
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: colors.resultBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  resultText: {
    color: colors.resultText,
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default Calculator; 