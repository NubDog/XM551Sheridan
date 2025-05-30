import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

type User = {
    id: number;
    name: string;
    phone: number;
}

const initialUsers: User[] = [
    { id: 1, name: 'Linh', phone: 1234567890 },
    { id: 2, name: 'Hưng', phone: 9876543210 },
    { id: 3, name: 'Thành', phone: 1122334455 },
]

const UserItem = ({ user, onEdit, onDelete, style }: {
    user: User,
    onEdit: (user: User) => void,
    onDelete: (id: number) => void,
    style?: any
}) => (
    <View style={[styles.userCard, style]}>
        <View style={styles.userInfo}>
            <Text style={styles.userName}>👤 {user.name}</Text>
            <Text style={styles.line}> - </Text>
            <Text style={styles.userPhone}> {user.phone}</Text>
        </View>
        <View style={styles.userActions}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => onEdit(user)}
            >
                <Text style={styles.actionText}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => onDelete(user.id)}
            >
                <Text style={styles.actionText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const UserManager = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Lọc danh sách người dùng khi searchQuery thay đổi
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const searchText = searchQuery.toLowerCase();
            const results = users.filter(
                user => 
                    user.name.toLowerCase().includes(searchText) || 
                    user.phone.toString().includes(searchText)
            );
            setFilteredUsers(results);
        }
    }, [searchQuery, users]);

    const resetForm = () => {
        setName('');
        setPhone('');
        setEditingId(null);
    };

    const handleAddUser = () => {
        if (!name || !phone) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const phoneNum = Number(phone);

        const newUser: User = {
            id: Math.max(0, ...users.map(u => u.id)) + 1,
            name: name,
            phone: phoneNum
        };

        setUsers([...users, newUser]);
        resetForm();
    };

    const handleEditUser = (user: User) => {
        setEditingId(user.id);
        setName(user.name);
        setPhone(user.phone.toString());
    };

    const handleUpdateUser = () => {
        if (!name || !phone) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const phoneNum = Number(phone);

        setUsers(users.map(user =>
            user.id === editingId
                ? { ...user, name, phone: phoneNum }
                : user
        ));
        resetForm();
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
        resetForm();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#fff0f5" barStyle="dark-content" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>📘 Danh Bạ Cute</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="🌸 Nhập Tên"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="📱 Nhập SĐT"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="numeric"
                />

                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={editingId ? handleUpdateUser : handleAddUser}
                >
                    <Text style={styles.addButtonText}>{editingId ? '✏️ Cập nhật' : '➕ Thêm'}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Tìm kiếm..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <ScrollView style={styles.userList}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <UserItem
                                key={user.id}
                                user={user}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                style={styles.userItem}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyResult}>
                            <Text style={styles.emptyResultText}>Không tìm thấy liên hệ nào</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff0f5',
        width: width,
        height: height,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#fff0f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff69b4',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffd5dd',
        fontSize: 24,
    },
    addButton: {
        backgroundColor: '#ff69b4',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        borderRadius: 15,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffd5dd',
        fontSize: 24,
    },
    userList: {
        flex: 1,
    },
    userItem: {
        backgroundColor: '#ffe4e1',
        borderRadius: 20,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    line: {
        fontSize: 24,
        color: '#666',
        marginBottom: 5,
    },
    userPhone: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    userActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        marginRight: 10,
    },
    deleteButton: {
    },
    actionText: {
        fontSize: 18,
    },
    emptyResult: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyResultText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    }
});

export default UserManager;