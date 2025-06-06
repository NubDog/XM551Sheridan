import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { 
  Product, 
  Category, 
  fetchProducts, 
  fetchCategories, 
  fetchProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from './database/database';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ProductManagement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number | null>(null);
  const [productImage, setProductImage] = useState<string>('hinh1.jpg');
  const [productQuantity, setProductQuantity] = useState('0');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Apply filters when search or category changes
  useEffect(() => {
    filterProducts();
  }, [products, selectedCategoryId, searchQuery]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  
  const filterProducts = async () => {
    let result = products;
    
    // Apply category filter
    if (selectedCategoryId !== null) {
      result = result.filter(product => product.categoryId === selectedCategoryId);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  };
  
  const handleAddProduct = () => {
    // Reset form
    setEditingProduct(null);
    setProductName('');
    setProductPrice('');
    setProductCategoryId(categories.length > 0 ? categories[0].id : null);
    setProductImage('hinh1.jpg');
    setProductQuantity('0');
    setFormVisible(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductCategoryId(product.categoryId);
    setProductImage(product.img);
    setProductQuantity(product.quantity.toString());
    setFormVisible(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              // Refresh product list
              const updatedProducts = await fetchProducts();
              setProducts(updatedProducts);
              Alert.alert('Thành công', 'Đã xóa sản phẩm');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          }
        }
      ]
    );
  };
  
  const handleSaveProduct = async () => {
    // Validate form
    if (!productName || !productPrice || !productCategoryId) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm');
      return;
    }
    
    try {
      const productData = {
        name: productName,
        price: parseFloat(productPrice),
        img: productImage,
        categoryId: productCategoryId,
        quantity: parseInt(productQuantity, 10) || 0
      };
      
      if (editingProduct) {
        // Update existing product
        await updateProduct({
          ...productData,
          id: editingProduct.id
        });
        Alert.alert('Thành công', 'Cập nhật sản phẩm thành công');
      } else {
        // Add new product
        await addProduct(productData);
        Alert.alert('Thành công', 'Thêm sản phẩm mới thành công');
      }
      
      // Close form and refresh product list
      setFormVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
    }
  };
  
  // Image handling
  const handleSelectImage = () => {
    setShowImageOptions(true);
  };
  
  const handleTakePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProductImage(asset.uri);
        }
      }
      setShowImageOptions(false);
    });
  };
  
  const handleChooseFromLibrary = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProductImage(asset.uri);
        }
      }
      setShowImageOptions(false);
    });
  };
  
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Không xác định';
  };
  
  const renderProductImage = (imageSource: string) => {
    if (imageSource.startsWith('file://') || imageSource.startsWith('content://')) {
      return <Image source={{ uri: imageSource }} style={styles.productImage} />;
    } else {
      return <Image source={require('../../img/tank.jpg')} style={styles.productImage} />;
    }
  };
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {renderProductImage(item.img)}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <Text style={styles.productCategory}>{getCategoryName(item.categoryId)}</Text>
        <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEditProduct(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteProduct(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="person-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryFilterButton,
              selectedCategoryId === null && styles.activeCategoryFilterButton
            ]}
            onPress={() => setSelectedCategoryId(null)}
          >
            <Text
              style={[
                styles.categoryFilterText,
                selectedCategoryId === null && styles.activeCategoryFilterText
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryFilterButton,
                selectedCategoryId === category.id && styles.activeCategoryFilterButton
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategoryId === category.id && styles.activeCategoryFilterText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
        />
      )}
      
      {/* Product Form Modal */}
      <Modal
        visible={formVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </Text>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              <TextInput
                style={styles.formInput}
                placeholder="Tên sản phẩm"
                value={productName}
                onChangeText={setProductName}
              />
              
              <TextInput
                style={styles.formInput}
                placeholder="Giá sản phẩm"
                value={productPrice}
                onChangeText={setProductPrice}
                keyboardType="numeric"
              />
              
              <TouchableOpacity
                style={styles.formDropdown}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text>
                  {productCategoryId ? getCategoryName(productCategoryId) : 'Chọn danh mục'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownOptions}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setProductCategoryId(category.id);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <TextInput
                style={styles.formInput}
                placeholder="Số lượng"
                value={productQuantity}
                onChangeText={setProductQuantity}
                keyboardType="numeric"
              />
              
              <TouchableOpacity
                style={styles.imageSelector}
                onPress={handleSelectImage}
              >
                <View style={styles.imageSelectorPreview}>
                  {renderProductImage(productImage)}
                </View>
                <Text style={styles.imageSelectorText}>
                  {productImage === 'hinh1.jpg' ? 'Chọn ảnh sản phẩm' : 'Thay đổi ảnh'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProduct}
              >
                <Text style={styles.saveButtonText}>
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.imageOptionsContainer}>
          <View style={styles.imageOptionsContent}>
            <Text style={styles.imageOptionsTitle}>Chọn ảnh</Text>
            
            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="#333" />
              <Text style={styles.imageOptionText}>Chụp ảnh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={handleChooseFromLibrary}
            >
              <Ionicons name="images-outline" size={24} color="#333" />
              <Text style={styles.imageOptionText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.imageOptionButton, styles.cancelButton]}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  categoryFilterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  activeCategoryFilterButton: {
    backgroundColor: '#6200ee',
  },
  categoryFilterText: {
    color: '#333',
  },
  activeCategoryFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
  },
  productActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  formDropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 150,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageSelector: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageSelectorPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  imageSelectorText: {
    color: '#6200ee',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageOptionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageOptionsContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  imageOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  cancelButton: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProductManagementScreen; 