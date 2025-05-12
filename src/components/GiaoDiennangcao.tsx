import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GiaoDiennangcao = () => (
  <View style={styles.container}>

    <View style={styles.rowHeader}>
      <View style={styles.logo}>
        <ImageBackground
          source={require('../img/xbox_logo.png')}
          style={styles.header}
          imageStyle={{ borderRadius: 0 }}
          resizeMode="cover"
          width="100%"
          height="100%"
          objectFit="container"
        >
        </ImageBackground>
      </View>
      <ImageBackground
        source={require('../img/OIP.jpg')}
        style={styles.header}
        imageStyle={{ borderRadius: 0 }}
      >
      </ImageBackground>
    </View>

    <View style={styles.rowContent}>
      <View style={styles.sidebar}><Text style={styles.text}>Side bar ở đây</Text></View>
      <View style={styles.main}><Text style={styles.text}>Main content ở đây</Text></View>
    </View>

    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Chính sách bảo mật</Text>
        </TouchableOpacity>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="facebook" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="twitter" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="youtube" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="instagram" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
    padding: 8,
    borderWidth: 3,
    borderColor: '#222',
  },
  rowHeader: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 3,
    borderColor: '#222',
  },
  logo: {
    flex: 1,
    borderRightWidth: 3,
    borderColor: '#222',
    marginRight: 0,
    padding: 0,
  },
  header: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    flex: 6,
    borderBottomWidth: 3,
    borderColor: '#222',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#118AB2',
    borderRightWidth: 3,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 2,
    backgroundColor: '#EF476F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 0.7,
    backgroundColor: '#073B4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  text: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GiaoDiennangcao;
