import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Buoi11 from '../components/ProjectSQLite/Buoi11';
import ProductDetail from '../components/ProjectSQLite/ProductDetail';
import ProductsByCategory from '../components/ProjectSQLite/ProductsByCategory';
import { Product } from '../components/ProjectSQLite/database/database';

// Định nghĩa types cho Stack Navigator
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Buoi11} options={{ title: 'Quản lý sản phẩm' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Chi tiết sản phẩm' }} />
        <Stack.Screen 
          name="ProductsByCategory" 
          component={ProductsByCategory} 
          options={({ route }) => ({ 
            title: route.params.categoryName || 'Sản phẩm theo danh mục' 
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 