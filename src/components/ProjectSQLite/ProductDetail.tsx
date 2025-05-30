import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Product, Category, fetchCategories } from './database/database';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CategorySelector from './CategorySelector';

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

const ProductDetail = ({ route }: Props) => {
    const { product } = route.params;
    const [categories, setCategories] = useState<Category[]>([]);
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

    return (
        <ScrollView style={styles.container}>
            {renderProductImage()}
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
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
                
                {/* Thêm CategorySelector component */}
                <Text style={styles.sectionTitle}>Xem các sản phẩm cùng danh mục:</Text>
                <CategorySelector
                    categories={categories}   // mảng categories do ProductDetail fetch được
                    selectedId={product.categoryId}  // ID của loại sản phẩm hiện tại (dùng để highlight)
                    onSelect={handleSelectCategory}  // Hàm callback khi người dùng chọn một danh mục
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        color: '#28a',
        fontWeight: 'bold',
        marginBottom: 16,
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
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
});

export default ProductDetail; 