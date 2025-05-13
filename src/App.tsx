import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
// import HelloWorld from './components/HelloWorld';
// import LinearEquation from './components/LinearEquation';
// import QuadraticEquation from './components/QuadraticEquation';
// import HelloWord0 from './components/HelloWord0';
// import Calculator from './components/Calculator';
// import LayoutMacdinh from './components/LayoutMacdinh';
// import GiaoDiennangcao from './components/GiaoDiennangcao';
import Buoi8 from './components/Buoi8'

export default function App() {
  // Khởi tạo state để lưu trữ thông tin người dùng
  // State này sẽ được cập nhật khi component con gửi dữ liệu lên
  // const [personInfo, setPersonInfo] = useState({
  //   name: "Linh Hoa Nguyệt Huyễn",
  //   age: 20,
  //   address: "123 abc"
  // });

  // Hàm callback để nhận dữ liệu từ component con
  // Được gọi khi người dùng nhấn nút "Cập nhật thông tin" trong component con
  // const handleUpdateInfo = (newName: string, newAge: number, newAddress: string) => {
  //   setPersonInfo({
  //     name: newName,
  //     age: newAge,
  //     address: newAddress
  //   });
  //   console.log('Thông tin mới:', { newName, newAge, newAddress });
  // };

  return (
    // Container chính của ứng dụng
    <SafeAreaView style={styles.container}>
      {/* <HelloWorld /> */}
      {/* <LinearEquation /> */}
      {/* <QuadraticEquation /> */}
      {/* <HelloWord0 
        name={personInfo.name} 
        age={personInfo.age} 
        address={personInfo.address} 
        onUpdateInfo={handleUpdateInfo} 
      /> */}
      {/* <Calculator /> */}
      {/* <LayoutMacdinh /> */}
      {/* <GiaoDiennangcao /> */}
      <Buoi8/>
    </SafeAreaView>
  );
}
  
// Styles cho component App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF', // Màu nền xanh dương nhạt
    padding: 20,
  },
});