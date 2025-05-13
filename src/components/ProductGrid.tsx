import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import ProductCard from './TrangSanPham';

const products = [
  {
    id: '1',
    name: 'Sản phẩm 1',
    price: '120.000đ',
    image: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    name: 'Sản phẩm 2',
    price: '150.000đ',
    image: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: '3',
    name: 'Sản phẩm 3',
    price: '99.000đ',
    image: 'https://picsum.photos/200/200?random=3',
  },
  {
    id: '4',
    name: 'Sản phẩm 4',
    price: '200.000đ',
    image: 'https://picsum.photos/200/200?random=4',
  },
  {
    id: '5',
    name: 'Sản phẩm 5',
    price: '180.000đ',
    image: 'https://picsum.photos/200/200?random=5',
  },
  {
    id: '6',
    name: 'Sản phẩm 6',
    price: '210.000đ',
    image: 'https://picsum.photos/200/200?random=6',
  },
  {
    id: '7',
    name: 'Sản phẩm 7',
    price: '130.000đ',
    image: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: '8',
    name: 'Sản phẩm 8',
    price: '170.000đ',
    image: 'https://picsum.photos/200/200?random=8',
  },
];

const ProductGrid = () => (
  <View style={styles.container}>
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          image={item.image}
          name={item.name}
          price={item.price}
          onBuy={() => Alert.alert('Mua ngay', `Bạn đã chọn mua ${item.name}`)}
        />
      )}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1faee',
    padding: 8,
  },
  list: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ProductGrid; 