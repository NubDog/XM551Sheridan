import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { fetchUsers, User } from './database/database';

const AdminUser = () => {


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý tài khoản</Text>
        </View>
    );
};

export default AdminUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});