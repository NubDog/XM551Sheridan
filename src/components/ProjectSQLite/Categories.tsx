import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchProductsByCategory, Category, Product } from './database/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
    ProductsByCategory: { categoryId: number; categoryName?: string };
    Categories: undefined;
    Login: undefined;
    Search: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Categories = () => {
    const navigation = useNavigation<NavigationProp>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState('categories');

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            loadProductsByCategory(selectedCategoryId);
        }
    }, [selectedCategoryId]);

    const loadCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) {
            setSelectedCategoryId(data[0].id);
        }
    };

    const loadProductsByCategory = async (categoryId: number) => {
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
    };

    const handleCategoryPress = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    const getCategoryName = (categoryId: number): string => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Không xác định';
    };

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
        >
            <View style={styles.imageContainer}>
                {item.img.startsWith('file://') || item.img.startsWith('content://') ? (
                    <Image source={{ uri: item.img }} style={styles.productImage} />
                ) : (
                    <Image source={require('../../img/tank.jpg')} style={styles.productImage} />
                )}
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
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                            <Ionicons name="arrow-back-outline" size={24} color="#000" />
                        </TouchableOpacity> */}
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                <Ionicons name="search-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categories.map((category) => (
                            <TouchableOpacity 
                                key={category.id}
                                style={[
                                    styles.categoryTab,
                                    selectedCategoryId === category.id && styles.activeTab
                                ]}
                                onPress={() => handleCategoryPress(category.id)}
                            >
                                <Text style={selectedCategoryId === category.id ? styles.activeTabText : styles.tabText}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products */}
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.productRow}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có sản phẩm nào trong danh mục này</Text>
                        </View>
                    }
                />

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
                        onPress={() => setActiveTab('categories')}
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
                            navigation.navigate('Login');
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

export default Categories;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f8f4',
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
    headerLeft: {},
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerRight: {},
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
    },
    categoriesScroll: {
        paddingHorizontal: 16,
    },
    categoryTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#FF7A00',
    },
    tabText: {
        color: '#333',
    },
    activeTabText: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
}); 