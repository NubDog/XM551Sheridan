import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageSourcePropType, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'

type Product = {
    id: string,
    name: string,
    price: number,
    img: ImageSourcePropType,
}

const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Áo sơ mi',
        price: 250000,
        img: require('../img/tank.jpg'),
    },
    {
        id: '2',
        name: 'Giày sneaker',
        price: 1100000,
        img: require('../img/tank.jpg'),
    },
    {
        id: '3',
        name: 'Balo thời trang',
        price: 490000,
        img: require('../img/tank.jpg'),
    },
    {
        id: '4',
        name: 'Mũ lưỡi trai',
        price: 120000,
        img: require('../img/tank.jpg'),
    }
]

const Buoi8 = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddProduct = () => {
        if (!name || !price) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm')
            return
        }

        const newProduct: Product = {
            id: Date.now().toString(),
            name: name,
            price: Number(price),
            img: require('../img/tank.jpg'), // Default image
        }

        setProducts([...products, newProduct])
        setName('')
        setPrice('')
    }

    const handleEditProduct = (product: Product) => {
        setEditingId(product.id)
        setName(product.name)
        setPrice(product.price.toString())
    }

    const handleUpdateProduct = () => {
        if (!name || !price) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm')
            return
        }

        const updatedProducts = products.map(product => {
            if (product.id === editingId) {
                return {
                    ...product,
                    name: name,
                    price: Number(price)
                }
            }
            return product
        })

        setProducts(updatedProducts)
        setEditingId(null)
        setName('')
        setPrice('')
    }

    const handleDeleteProduct = (id: string) => {
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
                    onPress: () => {
                        setProducts(products.filter(product => product.id !== id))
                    },
                    style: 'destructive'
                }
            ]
        )
    }

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
                <TouchableOpacity
                    style={styles.button}
                    onPress={editingId ? handleUpdateProduct : handleAddProduct}
                >
                    <Text style={styles.buttonText}>
                        {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                {products.map((product) => (
                    <View key={product.id} style={styles.card}>
                        <Image source={product.img} style={styles.image} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>
                                {product.price.toLocaleString()} đ
                            </Text>
                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={() => handleEditProduct(product)}>
                                    <Text style={styles.icon}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
                                    <Text style={styles.icon}>❌</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default Buoi8

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