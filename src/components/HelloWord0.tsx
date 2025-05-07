import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';

// Định nghĩa kiểu dữ liệu cho props của component
type Props = {
    name: string,      // Tên người dùng
    age: number;       // Tuổi người dùng
    address: string;   // Địa chỉ người dùng
    onUpdateInfo?: (newName: string, newAge: number, newAddress: string) => void;  // Callback function để gửi dữ liệu lên component cha
}

const HelloWord0 = ({ name, age, address, onUpdateInfo }: Props) => {
    // State để lưu trữ thông tin mới được nhập từ người dùng
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newAddress, setNewAddress] = useState('');

    // Hàm hiển thị thông báo với thông tin hiện tại
    const showAlert = () => {
        console.log('Ấn vào nút này nè!');
        Alert.alert(
            'Thông tin cá nhân',
            `Tên: ${name}\nTuổi: ${age}\nĐịa chỉ: ${address}`,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    }

    // Hàm cập nhật thông tin và gửi lên component cha
    const updateInfo = () => {
        if (onUpdateInfo) {
            // Gọi callback với thông tin mới hoặc giữ nguyên thông tin cũ nếu không nhập
            onUpdateInfo(
                newName || name,
                newAge ? parseInt(newAge) : age,
                newAddress || address
            );
            // Reset các ô input về trống
            setNewName('');
            setNewAge('');
            setNewAddress('');
        }
    }
    
    return (
        <View style={styles.container}>
            {/* Phần hiển thị thông tin từ cha */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin từ cha</Text>
                <Text style={styles.text}>Tên: {name}</Text>
                <Text style={styles.text}>Tuổi: {age}</Text>
                <Text style={styles.text}>Địa chỉ: {address}</Text>
            </View>

            {/* Phần hiển thị thông tin từ con (thông tin mới được nhập) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin từ con</Text>
                <Text style={styles.text}>Tên mới: {newName || 'Chưa nhập'}</Text>
                <Text style={styles.text}>Tuổi mới: {newAge || 'Chưa nhập'}</Text>
                <Text style={styles.text}>Địa chỉ mới: {newAddress || 'Chưa nhập'}</Text>
            </View>

            {/* Phần nhập thông tin mới */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nhập thông tin mới</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên mới"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tuổi mới"
                        value={newAge}
                        onChangeText={setNewAge}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập địa chỉ mới"
                        value={newAddress}
                        onChangeText={setNewAddress}
                    />
                </View>
            </View>
            
            {/* Nút hiển thị thông báo */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={showAlert}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Hiển thị thông báo</Text>
            </TouchableOpacity>

            {/* Nút cập nhật thông tin */}
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: 'green', marginTop: 10 }]} 
                onPress={updateInfo}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Cập nhật thông tin</Text>
            </TouchableOpacity>
        </View>
    );    
};

// Styles cho component
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFD700', // Màu vàng hoàng kim
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
    },
    section: {
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        width: '100%',
        marginVertical: 10,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HelloWord0;

