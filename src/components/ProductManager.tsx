import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const ProductManager = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Áo sơ mi',
      price: '250.000',
      image: 'https://picsum.photos/200/200?random=1'
    },
    {
      id: '2',
      name: 'Giày sneaker',
      price: '1.100.000',
      image: 'https://picsum.photos/200/200?random=2'
    },
    {
      id: '3',
      name: 'Balo thời trang',
      price: '490.000',
      image: 'https://picsum.photos/200/200?random=3'
    }
  ]);

  const addProduct = () => {
    if (productName.trim() === '' || productPrice.trim() === '') return;
    
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price: productPrice,
      image: `https://picsum.photos/200/200?random=${Date.now()}`
    };
    
    setProducts([...products, newProduct]);
    setProductName('');
    setProductPrice('');
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} đ</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="pencil" size={20} color="#777" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => deleteProduct(item.id)}>
          <Icon name="times" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quản lý sản phẩm</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={productName}
        onChangeText={setProductName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
      
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  addButton: {
    backgroundColor: '#00b4d8',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  list: {
    flex: 1
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5
  },
  productInfo: {
    flex: 1,
    marginLeft: 12
  },
  productName: {
    fontSize: 16,
    fontWeight: '500'
  },
  productPrice: {
    color: '#666',
    marginTop: 4
  },
  actionButtons: {
    flexDirection: 'row'
  },
  actionButton: {
    padding: 8,
    marginLeft: 5
  }
});

export default ProductManager; 