import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LayoutMacdinh = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.Vung1}
            >
                <Text style={styles.text}>Vùng 11</Text>
            </LinearGradient>
    
            <LinearGradient
                colors={['#4ECDC4', '#45B7AF']}
                style={styles.Vung2}
            >
                <Text style={styles.texttext}>Vùng 22</Text>
            </LinearGradient>
    
            <LinearGradient
                colors={['#96CEB4', '#88BEA5']}
                style={styles.Vung3}
            >
                <Text style={styles.text}>Vùng 33</Text>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
    },
    Vung1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Vung2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Vung3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    texttext: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default LayoutMacdinh; 