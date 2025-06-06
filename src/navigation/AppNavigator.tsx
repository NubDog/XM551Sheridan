import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Buoi11 from '../components/ProjectSQLite/Buoi11';
import ProductDetail from '../components/ProjectSQLite/ProductDetail';
import ProductsByCategory from '../components/ProjectSQLite/ProductsByCategory';
import { Product } from '../components/ProjectSQLite/database/database';
import Categories from '../components/ProjectSQLite/Categories';
import LoginScreen from '../components/ProjectSQLite/LoginScreen';
import SignUpScreen from '../components/ProjectSQLite/SignUpScreen';
import SearchScreen from '../components/ProjectSQLite/SearchScreen';

// Định nghĩa types cho Stack Navigator
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
  Categories: undefined;
  Login: undefined;
  SignUp: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={Buoi11} options={{ title: 'Quản lý sản phẩm' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Chi tiết sản phẩm' }} />
        <Stack.Screen 
          name="ProductsByCategory" 
          component={ProductsByCategory} 
          options={({ route }) => ({ 
            title: route.params.categoryName || 'Sản phẩm theo danh mục' 
          })} 
        />
        <Stack.Screen name="Categories" component={Categories} options={{ title: 'Danh mục sản phẩm' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Đăng ký' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Tìm kiếm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 