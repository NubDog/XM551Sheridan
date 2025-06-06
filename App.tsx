import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Buoi11 from './src/components/ProjectSQLite/Buoi11';
import ProductDetail from './src/components/ProjectSQLite/ProductDetail';
import ProductsByCategory from './src/components/ProjectSQLite/ProductsByCategory';
import Categories from './src/components/ProjectSQLite/Categories';
import LoginScreen from './src/components/ProjectSQLite/LoginScreen';
import SignUpScreen from './src/components/ProjectSQLite/SignUpScreen';
import SearchScreen from './src/components/ProjectSQLite/SearchScreen';
import ProductManagementScreen from './src/components/ProjectSQLite/ProductManagementScreen';
import UserManagementScreen from './src/components/ProjectSQLite/UserManagementScreen';
import AdminUser from './src/components/ProjectSQLite/AdminUser';
import { Product, initDatabase } from './src/components/ProjectSQLite/database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
    ProductsByCategory: { categoryId: number; categoryName?: string };
    Categories: undefined;
    Login: undefined;
    SignUp: undefined;
    Search: undefined;
    ProductManagement: undefined;
    UserManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Initialize database and check login status
    useEffect(() => {
        const initialize = async () => {
            // Initialize database
            await initDatabase(() => {
                console.log('📁 Database initialized successfully!');
            });
            
            // Check login status
            try {
                const userInfo = await AsyncStorage.getItem('userInfo');
                if (userInfo) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initialize();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF7A00" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
                <Stack.Screen 
                    name="Home" 
                    component={Buoi11} 
                    options={{ title: 'Trang chủ', headerShown: false }}
                />
                <Stack.Screen 
                    name="ProductDetail" 
                    component={ProductDetail}
                    options={{ title: 'Chi tiết sản phẩm' }}
                />
                <Stack.Screen 
                    name="ProductsByCategory" 
                    component={ProductsByCategory}
                    options={({ route }) => ({ 
                        title: route.params.categoryName || 'Sản phẩm theo danh mục' 
                    })}
                />
                <Stack.Screen 
                    name="Categories" 
                    component={Categories}
                    options={{ title: 'Danh mục sản phẩm' }}
                />
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{ 
                        title: 'Đăng nhập',
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="SignUp" 
                    component={SignUpScreen}
                    options={{ 
                        title: 'Đăng ký',
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="Search" 
                    component={SearchScreen}
                    options={{ 
                        title: 'Tìm kiếm'
                    }}
                />
                <Stack.Screen 
                    name="ProductManagement" 
                    component={ProductManagementScreen}
                    options={{ 
                        title: 'Quản lý sản phẩm',
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="UserManagement" 
                    component={UserManagementScreen}
                    options={{ 
                        title: 'Quản lý người dùng',
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App; 