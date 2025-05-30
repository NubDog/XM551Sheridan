import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Buoi11 from './src/components/ProjectSQLite/Buoi11';
import ProductDetail from './src/components/ProjectSQLite/ProductDetail';
import { Product, initDatabase } from './src/components/ProjectSQLite/database/database';

export type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    // Đảm bảo database được khởi tạo khi app bắt đầu
    useEffect(() => {
        initDatabase(() => {
            console.log('📁 Database initialized successfully!');
        });
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={Buoi11} 
                    options={{ title: 'Quản lý sản phẩm' }}
                />
                <Stack.Screen 
                    name="ProductDetail" 
                    component={ProductDetail}
                    options={{ title: 'Chi tiết sản phẩm' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App; 