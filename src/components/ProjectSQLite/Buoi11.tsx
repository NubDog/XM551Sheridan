import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageSourcePropType, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { fetchProducts, addProduct, updateProduct, deleteProduct, Product, fetchCategories, Category, fetchProductsByCategory } from './database/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker';

type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Buoi11 = () => {
    const navigation = useNavigation<NavigationProp>();
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [filterByCategoryId, setFilterByCategoryId] = useState<number | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [showImageOptions, setShowImageOptions] = useState(false)

    const loadProducts = async () => {
        if (filterByCategoryId) {
            // Nếu có bộ lọc danh mục, lấy sản phẩm theo danh mục
            const data = await fetchProductsByCategory(filterByCategoryId);
            setProducts(data);
        } else {
            // Nếu không có bộ lọc, lấy tất cả sản phẩm
            const data = await fetchProducts();
            setProducts(data);
        }
    }

    const loadCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, [])

    // Gọi lại loadProducts khi filterByCategoryId thay đổi
    useEffect(() => {
        loadProducts();
    }, [filterByCategoryId])

    const handleAddProduct = async () => {
        if (!name || !price || !selectedCategoryId) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm và chọn danh mục')
            return
        }
        const newProduct = {
            name: name,
            price: Number(price),
            img: selectedImage || 'hinh1.jpg', // Sử dụng ảnh đã chọn hoặc mặc định
            categoryId: selectedCategoryId,
            quantity: 0 // hoặc giá trị mặc định phù hợp
        }
        await addProduct(newProduct)
        await loadProducts()
        setName('')
        setPrice('')
        setSelectedCategoryId(null)
        setSelectedImage(null)
    }

    const handleEditProduct = (product: Product) => {
        setEditingId(product.id)
        setName(product.name)
        setPrice(product.price.toString())
        setSelectedCategoryId(product.categoryId)
        setSelectedImage(product.img)
    }

    const handleUpdateProduct = async () => {
        if (!name || !price || editingId === null || !selectedCategoryId) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm và chọn danh mục')
            return
        }
        const updatedProduct = {
            id: editingId,
            name: name,
            price: Number(price),
            img: selectedImage || 'hinh1.jpg',
            categoryId: selectedCategoryId,
            quantity: 0 // hoặc giá trị phù hợp
        }
        await updateProduct(updatedProduct)
        await loadProducts()
        setEditingId(null)
        setName('')
        setPrice('')
        setSelectedCategoryId(null)
        setSelectedImage(null)
    }

    const handleDeleteProduct = (id: number) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa sản phẩm này?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel'
                },
                {
                    text: 'Xóa',
                    onPress: async () => {
                        await deleteProduct(id)
                        await loadProducts()
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const getCategoryName = (categoryId: number): string => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Không xác định';
    }

    const handleFilterByCategory = (categoryId: number | null) => {
        setFilterByCategoryId(categoryId);
    }

    // Xử lý chọn ảnh từ thư viện
    const handleSelectFromLibrary = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        }, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                if (asset.uri) {
                    setSelectedImage(asset.uri);
                }
            }
            setShowImageOptions(false);
        });
    };

    // Xử lý chụp ảnh từ camera
    const handleTakePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        }, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                Alert.alert('Lỗi', 'Không thể chụp ảnh: ' + response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                if (asset.uri) {
                    setSelectedImage(asset.uri);
                }
            }
            setShowImageOptions(false);
        });
    };

    // Hiển thị ảnh sản phẩm
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
            <Text style={styles.title}>Quản lý sản phẩm</Text>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder='Tên sản phẩm'
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Giá'
                    value={price}
                    onChangeText={setPrice}
                    keyboardType='numeric'
                />
                
                {/* Dropdown chọn danh mục */}
                <TouchableOpacity 
                    style={styles.dropdown}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                    <Text>{selectedCategoryId ? getCategoryName(selectedCategoryId) : 'Chọn danh mục'}</Text>
                </TouchableOpacity>
                
                {showCategoryDropdown && (
                    <View style={styles.dropdownList}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedCategoryId(category.id);
                                    setShowCategoryDropdown(false);
                                }}
                            >
                                <Text>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Chọn ảnh sản phẩm */}
                <TouchableOpacity 
                    style={styles.imageSelector}
                    onPress={() => setShowImageOptions(true)}
                >
                    <View style={styles.imageSelectorContent}>
                        {selectedImage ? (
                            <View style={styles.selectedImageContainer}>
                                {renderProductImage(selectedImage)}
                                <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                            </View>
                        ) : (
                            <Text style={styles.selectImageText}>Chọn ảnh sản phẩm</Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Modal lựa chọn nguồn ảnh */}
                {showImageOptions && (
                    <View style={styles.imageOptionsContainer}>
                        <TouchableOpacity 
                            style={styles.imageOption}
                            onPress={handleTakePhoto}
                        >
                            <Text style={styles.imageOptionText}>Chụp ảnh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.imageOption}
                            onPress={handleSelectFromLibrary}
                        >
                            <Text style={styles.imageOptionText}>Chọn từ thư viện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.imageOption, styles.cancelOption]}
                            onPress={() => setShowImageOptions(false)}
                        >
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={editingId ? handleUpdateProduct : handleAddProduct}
                >
                    <Text style={styles.buttonText}>
                        {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bộ lọc sản phẩm theo danh mục */}
            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Lọc theo danh mục:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    <TouchableOpacity 
                        style={[
                            styles.filterItem,
                            filterByCategoryId === null && styles.filterItemActive
                        ]}
                        onPress={() => handleFilterByCategory(null)}
                    >
                        <Text style={filterByCategoryId === null ? styles.filterTextActive : styles.filterText}>
                            Tất cả
                        </Text>
                    </TouchableOpacity>
                    
                    {categories.map((category) => (
                        <TouchableOpacity 
                            key={category.id}
                            style={[
                                styles.filterItem,
                                filterByCategoryId === category.id && styles.filterItemActive
                            ]}
                            onPress={() => handleFilterByCategory(category.id)}
                        >
                            <Text style={filterByCategoryId === category.id ? styles.filterTextActive : styles.filterText}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {products.map((product) => (
                    <TouchableOpacity
                        key={product.id} 
                        style={styles.card}
                        onPress={() => handleProductPress(product)}
                    >
                        {renderProductImage(product.img)}
                        <View style={styles.cardInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>
                                {product.price.toLocaleString()} đ
                            </Text>
                            <Text style={styles.productCategory}>
                                {getCategoryName(product.categoryId)}
                            </Text>
                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={(e) => {
                                    e.stopPropagation();
                                    handleEditProduct(product);
                                }}>
                                    <Text style={styles.icon}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProduct(product.id);
                                }}>
                                    <Text style={styles.icon}>❌</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default Buoi11

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 8
    },
    dropdown: {
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 8,
        justifyContent: 'center'
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 8,
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    imageSelector: {
        height: 100,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSelectorContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedImageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectImageText: {
        color: '#666',
    },
    changeImageText: {
        color: '#28a',
        marginTop: 5,
        fontSize: 12,
    },
    imageOptionsContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 1000,
    },
    imageOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    imageOptionText: {
        fontSize: 16,
    },
    cancelOption: {
        backgroundColor: '#f8f8f8',
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#28a',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 16
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    filterScroll: {
        flexDirection: 'row',
    },
    filterItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    filterItemActive: {
        backgroundColor: '#28a',
    },
    filterText: {
        color: '#333',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
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
        marginBottom: 4
    },
    iconRow: {
        flexDirection: 'row',
        gap: 12,
    },
    icon: {
        fontSize: 20,
    },
    scroll: {
        paddingTop: 8,
    }
});