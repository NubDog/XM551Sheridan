import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Product, Category, fetchCategories } from './database/database';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CategorySelector from './CategorySelector';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Định nghĩa các types cho navigation
type RootStackParamList = {
    ProductDetail: { product: Product };
    ProductsByCategory: { categoryId: number; categoryName?: string };
    Home: undefined;
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
    route: ProductDetailScreenRouteProp;
};

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = ({ route }: Props) => {
    const { product } = route.params;
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedSize, setSelectedSize] = useState('L'); // Default size L
    const navigation = useNavigation<ProductDetailScreenNavigationProp>();

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    const getCategoryName = (categoryId: number): string => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Không xác định';
    };

    // Xử lý hiển thị ảnh
    const renderProductImage = () => {
        if (product.img.startsWith('file://') || 
            product.img.startsWith('content://') || 
            product.img.startsWith('http')) {
            return <Image source={{ uri: product.img }} style={styles.image} />;
        } else {
            return <Image source={require('../../img/tank.jpg')} style={styles.image} />;
        }
    };

    // Xử lý khi người dùng chọn một danh mục
    const handleSelectCategory = (id: number) => {
        const selected = categories.find((c) => c.id === id);
        if (selected) {
            navigation.navigate('ProductsByCategory', {
                categoryId: selected.id,
                categoryName: selected.name,
            });
        }
    };

    const handleAddToCart = () => {
        Alert.alert('Thêm vào giỏ hàng', `Đã thêm sản phẩm ${product.name} size ${selectedSize} vào giỏ hàng`);
    };

    return (
        <ScrollView style={styles.container}>
            {renderProductImage()}
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                
                {/* Variant Icons */}
                <View style={styles.variantIconsContainer}>
                    <TouchableOpacity style={[styles.variantIcon, { backgroundColor: '#f5d5c0' }]}>
                        <Text style={styles.variantIconText}>●</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.variantIcon, { backgroundColor: '#5c8db9' }]}>
                        <Text style={styles.variantIconText}>●</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.variantIcon, { backgroundColor: '#e5e5e5' }]}>
                        <Text style={styles.variantIconText}>●</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Size Selector */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Size</Text>
                    <View style={styles.sizesContainer}>
                        {sizes.map(size => (
                            <TouchableOpacity 
                                key={size} 
                                style={[
                                    styles.sizeButton,
                                    selectedSize === size ? styles.selectedSizeButton : null
                                ]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[
                                    styles.sizeButtonText,
                                    selectedSize === size ? styles.selectedSizeButtonText : null
                                ]}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                
                {/* Price and Add to Cart */}
                <View style={styles.priceCartContainer}>
                    <Text style={styles.price}>${product.price.toLocaleString()}</Text>
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                        <Text style={styles.addToCartText}>Add To Cart</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Product Details */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Số lượng:</Text>
                        <Text style={styles.value}>{product.quantity}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Mã sản phẩm:</Text>
                        <Text style={styles.value}>{product.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Danh mục:</Text>
                        <Text style={styles.value}>{getCategoryName(product.categoryId)}</Text>
                    </View>
                </View>
                
                {/* Related Products */}
                <Text style={styles.sectionTitle}>Xem các sản phẩm cùng danh mục:</Text>
                <CategorySelector
                    categories={categories}
                    selectedId={product.categoryId}
                    onSelect={handleSelectCategory}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f8f4',
    },
    image: {
        width: '100%',
        height: 450,
        resizeMode: 'cover',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    detailsContainer: {
        padding: 16,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
        marginTop: 8,
    },
    variantIconsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    variantIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    variantIconText: {
        fontSize: 24,
        color: 'transparent',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    sizesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sizeButton: {
        width: 60,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    selectedSizeButton: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    sizeButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    selectedSizeButtonText: {
        color: '#fff',
    },
    priceCartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
        marginTop: 8,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    addToCartButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsSection: {
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#666',
        width: 100,
    },
    value: {
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
});

export default ProductDetail; 