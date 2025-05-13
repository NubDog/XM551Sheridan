import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type ProductCardProps = {
  image: string;
  name: string;
  price: string;
  onBuy: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ image, name, price, onBuy }) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.image} />
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.price}>{price}</Text>
    <TouchableOpacity style={styles.button} onPress={onBuy}>
      <Text style={styles.buttonText}>Mua ngay</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: 160,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
    textAlign: 'center',
  },
  price: {
    color: '#e63946',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#457b9d',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductCard;
