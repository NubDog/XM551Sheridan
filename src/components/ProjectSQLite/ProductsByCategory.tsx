import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, Category, fetchCategories, fetchProductsByCategory } from './database/database';
import CategorySelector from './CategorySelector';

// Định nghĩa kiểu cho navigation và route
type RootStackParamList = {
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProductsByCategory'>;

const ProductsByCategory = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  // Lấy categoryId và categoryName từ params
  const { categoryId, categoryName } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  // Tải danh sách các danh mục
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  // Tải danh sách sản phẩm theo danh mục được chọn
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsByCategory(selectedCategoryId);
      setProducts(data);
    };
    loadProducts();
  }, [selectedCategoryId]);

  // Xử lý hiển thị ảnh sản phẩm
  const renderProductImage = (img: string) => {
    if (img.startsWith('file://') || img.startsWith('content://')) {
      // Nếu là đường dẫn file từ thư viện ảnh
      return <Image source={{ uri: img }} style={styles.image} />;
    } else {
      // Nếu là tên file mặc định
      return <Image source={require('../../img/tank.jpg')} style={styles.image} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {categoryName || 'Sản phẩm theo danh mục'}
      </Text>
      
      {/* Component CategorySelector */}
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={(id) => setSelectedCategoryId(id)} // Cập nhật danh mục được chọn
      />

      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            {renderProductImage(item.img)}
            <View style={styles.cardInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {item.price.toLocaleString()} đ
              </Text>
              <Text style={styles.productCategory}>
                {categoryName || 'Danh mục sản phẩm'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm nào trong danh mục này</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  image: {
    width: 80,
    height: 80,
  },
  cardInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  productPrice: {
    color: 'green',
    fontSize: 14,
    marginBottom: 4
  },
  productCategory: {
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  }
});

export default ProductsByCategory; 