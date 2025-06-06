import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchProducts, Product, fetchCategories, Category } from './database/database';

type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Categories: undefined;
  Login: undefined;
  Search: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('search');

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Không xác định';
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductImage = (img: string) => {
    if (img.startsWith('file://') || img.startsWith('content://') || img.startsWith('http')) {
      return <Image source={{ uri: img }} style={styles.productImage} />;
    } else {
      return <Image source={require('../../img/tank.jpg')} style={styles.productImage} />;
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
      <View style={styles.imageContainer}>{renderProductImage(item.img)}</View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <Text style={styles.productCategory}>{getCategoryName(item.categoryId)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#ddd" />
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.initialContainer}>
          <Ionicons name="search" size={80} color="#eee" />
          <Text style={styles.initialText}>Nhập từ khóa để tìm kiếm sản phẩm</Text>
        </View>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate('Home');
            setActiveTab('home');
          }}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? '#FF7A00' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('search')}>
          <Ionicons
            name={activeTab === 'search' ? 'search' : 'search-outline'}
            size={24}
            color={activeTab === 'search' ? '#FF7A00' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'search' && styles.activeNavText]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate('Categories');
            setActiveTab('categories');
          }}
        >
          <Ionicons
            name={activeTab === 'categories' ? 'grid' : 'grid-outline'}
            size={24}
            color={activeTab === 'categories' ? '#FF7A00' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'categories' && styles.activeNavText]}>
            Categories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate('Login');
            setActiveTab('settings');
          }}
        >
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={activeTab === 'settings' ? '#FF7A00' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'settings' && styles.activeNavText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f8f4',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  productList: {
    padding: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  imageContainer: {
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  productPrice: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  productCategory: {
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    color: '#FF7A00',
    fontWeight: 'bold',
  },
});

export default SearchScreen; 