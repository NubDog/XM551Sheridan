import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, SafeAreaView, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { fetchProducts, addProduct, updateProduct, deleteProduct, Product, fetchCategories, Category, fetchProductsByCategory } from './database/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
    ProductsByCategory: { categoryId: number; categoryName?: string };
    Categories: undefined;
    Login: undefined;
    Search: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type UserRole = 'admin' | 'user';

interface UserInfo {
    id: number;
    email: string;
    phone?: string;
    role: UserRole;
}

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
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [activeTab, setActiveTab] = useState('home')
    const [activeSection, setActiveSection] = useState('home')
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Load user info from AsyncStorage
        const loadUserInfo = async () => {
            try {
                const userInfoString = await AsyncStorage.getItem('userInfo');
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    setCurrentUser(userInfo);
                    setIsAdmin(userInfo.role === 'admin');
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        };

        loadUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userInfo');
            setCurrentUser(null);
            setIsAdmin(false);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất, vui lòng thử lại sau.');
        }
    };

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
        if (!isAdmin) {
            Alert.alert('Không có quyền', 'Bạn không có quyền thêm sản phẩm');
            return;
        }
        
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
        setShowAddProduct(false)
    }

    const handleEditProduct = (product: Product) => {
        if (!isAdmin) {
            Alert.alert('Không có quyền', 'Bạn không có quyền sửa sản phẩm');
            return;
        }
        
        setEditingId(product.id)
        setName(product.name)
        setPrice(product.price.toString())
        setSelectedCategoryId(product.categoryId)
        setSelectedImage(product.img)
        setShowAddProduct(true)
    }

    const handleUpdateProduct = async () => {
        if (!isAdmin) {
            Alert.alert('Không có quyền', 'Bạn không có quyền cập nhật sản phẩm');
            return;
        }
        
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
        setShowAddProduct(false)
    }

    const handleDeleteProduct = (id: number) => {
        if (!isAdmin) {
            Alert.alert('Không có quyền', 'Bạn không có quyền xóa sản phẩm');
            return;
        }
        
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
        if (!isAdmin) return;
        
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
        if (!isAdmin) return;
        
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
            return <Image source={{ uri: img }} style={styles.productImage} />;
        } else {
            // Nếu là tên file mặc định
            return <Image source={require('../../img/tank.jpg')} style={styles.productImage} />;
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
        >
            <View style={styles.imageContainer}>
                {renderProductImage(item.img)}
                <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert('Thêm vào giỏ hàng', 'Đã thêm sản phẩm vào giỏ hàng');
                    }}
                >
                    <Ionicons name="cart-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
                <Text style={styles.productCategory}>{getCategoryName(item.categoryId)}</Text>
            </View>
            {isAdmin && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={(e) => {
                            e.stopPropagation();
                            handleEditProduct(item);
                        }}
                    >
                        <Ionicons name="create-outline" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(item.id);
                        }}
                    >
                        <Ionicons name="trash-outline" size={16} color="#ff3b30" />
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderAddProductForm = () => (
        <View style={styles.addProductForm}>
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</Text>
                <TouchableOpacity onPress={() => setShowAddProduct(false)}>
                    <Ionicons name="close-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
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
                <Ionicons name="chevron-down-outline" size={18} color="#666" />
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
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={36} color="#ccc" />
                            <Text style={styles.selectImageText}>Chọn ảnh sản phẩm</Text>
                        </View>
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
                        <Ionicons name="camera-outline" size={24} color="#333" style={styles.optionIcon} />
                        <Text style={styles.imageOptionText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.imageOption}
                        onPress={handleSelectFromLibrary}
                    >
                        <Ionicons name="images-outline" size={24} color="#333" style={styles.optionIcon} />
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
                style={styles.submitButton}
                onPress={editingId ? handleUpdateProduct : handleAddProduct}
            >
                <Text style={styles.submitButtonText}>
                    {editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="grid-outline" size={24} color="#000" />
                        </View>
                        <Text style={styles.headerTitle}>Trang chủ cửa hàng</Text>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                <Ionicons name="search-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.headerBanner}>
                        <Image source={require('../../img/banner.png')} style={styles.bannerImage} />
                    </View>
                    <View style={styles.headerHelloUser}>
                        <Text style={styles.subtitle}>
                            {currentUser ? 
                                `Xin chào ${isAdmin ? 'Admin' : currentUser.email}` : 
                                'Xin chào bạn'}
                        </Text>
                        {currentUser ? (
                            <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
                                <Text style={styles.buttonText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={styles.buttonLogin} 
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.buttonText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Main Navigation Tabs - Replacing Category Tabs */}
                <View style={styles.mainTabs}>
                    <TouchableOpacity 
                        style={[styles.mainTab, activeSection === 'home' && styles.activeMainTab]} 
                        onPress={() => setActiveSection('home')}
                    >
                        <Text style={activeSection === 'home' ? styles.activeMainTabText : styles.mainTabText}>
                            Trang chủ
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.mainTab, activeSection === 'intro' && styles.activeMainTab]}
                        onPress={() => setActiveSection('intro')}
                    >
                        <Text style={activeSection === 'intro' ? styles.activeMainTabText : styles.mainTabText}>
                            Giới thiệu
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.mainTab, activeSection === 'categories' && styles.activeMainTab]}
                        onPress={() => navigation.navigate('Categories')}
                    >
                        <Text style={activeSection === 'categories' ? styles.activeMainTabText : styles.mainTabText}>
                            Danh mục sản phẩm
                        </Text>
                    </TouchableOpacity>
                </View>

                {showAddProduct ? (
                    renderAddProductForm()
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.productRow}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productList}
                    />
                )}

                {/* Floating Action Button - Only show for admins */}
                {!showAddProduct && isAdmin && (
                    <TouchableOpacity 
                        style={styles.fab} 
                        onPress={() => {
                            setEditingId(null);
                            setName('');
                            setPrice('');
                            setSelectedCategoryId(null);
                            setSelectedImage(null);
                            setShowAddProduct(true);
                        }}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                {/* Bottom Navigation Bar */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity 
                        style={styles.navItem} 
                        onPress={() => setActiveTab('home')}
                    >
                        <Ionicons 
                            name={activeTab === 'home' ? "home" : "home-outline"} 
                            size={24} 
                            color={activeTab === 'home' ? "#FF7A00" : "#666"} 
                        />
                        <Text style={[
                            styles.navText,
                            activeTab === 'home' && styles.activeNavText
                        ]}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.navItem} 
                        onPress={() => {
                            navigation.navigate('Search');
                            setActiveTab('search');
                        }}
                    >
                        <Ionicons 
                            name={activeTab === 'search' ? "search" : "search-outline"} 
                            size={24} 
                            color={activeTab === 'search' ? "#FF7A00" : "#666"} 
                        />
                        <Text style={[
                            styles.navText,
                            activeTab === 'search' && styles.activeNavText
                        ]}>Search</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.navItem} 
                        onPress={() => {
                            navigation.navigate('Categories');
                            setActiveTab('categories');
                        }}
                    >
                        <Ionicons 
                            name={activeTab === 'categories' ? "grid" : "grid-outline"} 
                            size={24} 
                            color={activeTab === 'categories' ? "#FF7A00" : "#666"} 
                        />
                        <Text style={[
                            styles.navText,
                            activeTab === 'categories' && styles.activeNavText
                        ]}>Categories</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.navItem} 
                        onPress={() => {
                            if (!currentUser) {
                                navigation.navigate('Login');
                            }
                            setActiveTab('settings');
                        }}
                    >
                        <Ionicons 
                            name={activeTab === 'settings' ? "settings" : "settings-outline"} 
                            size={24} 
                            color={activeTab === 'settings' ? "#FF7A00" : "#666"} 
                        />
                        <Text style={[
                            styles.navText,
                            activeTab === 'settings' && styles.activeNavText
                        ]}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Buoi11;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f8f4', // Ivory white background
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerBanner: {
        width: '100%',
        height: 200,
        marginTop: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    headerLeft: {},
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerRight: {},
    subtitle: {
        color: '#666',
        marginTop: 4,
        marginBottom: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },
    mainTabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    mainTab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    activeMainTab: {
        backgroundColor: '#FF7A00',
    },
    mainTabText: {
        color: '#333',
        fontWeight: '500',
    },
    activeMainTabText: {
        color: '#fff',
        fontWeight: 'bold',
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
        position: 'relative',
        height: 160,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    addToCartButton: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF7A00',
        justifyContent: 'center',
        alignItems: 'center',
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    editButton: {
        padding: 6,
        marginRight: 8,
    },
    deleteButton: {
        padding: 6,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF7A00',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
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
    addProductForm: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        backgroundColor: '#f9f8f4',
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    dropdown: {
        height: 50,
        backgroundColor: '#f9f8f4',
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 12,
        maxHeight: 150,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    imageSelector: {
        height: 120,
        backgroundColor: '#f9f8f4',
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
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
    imagePlaceholder: {
        alignItems: 'center',
    },
    selectImageText: {
        color: '#666',
        marginTop: 8,
    },
    changeImageText: {
        position: 'absolute',
        bottom: 10,
        color: '#FF7A00',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        fontSize: 12,
    },
    imageOptionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        zIndex: 1000,
    },
    imageOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 10,
    },
    imageOptionText: {
        fontSize: 16,
    },
    cancelOption: {
        justifyContent: 'center',
        backgroundColor: '#f9f8f4',
    },
    cancelText: {
        color: '#FF3B30',
        fontSize: 16,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonLogout: {
        backgroundColor: '#FF7A00',
        padding: 10,
        borderRadius: 10,
    },
    buttonLogin: {
        backgroundColor: '#FF7A00',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerHelloUser: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        // backgroundColor: 'red',
    },
});