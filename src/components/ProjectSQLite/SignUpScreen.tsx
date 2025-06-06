import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { registerUser } from './database/database';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    SignUp: undefined;
    Categories: undefined;
    Search: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToPolicy, setAgreeToPolicy] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');

    const handleSignUp = async () => {
        // Validate form
        if (!email && !phone) {
            Alert.alert('Lỗi', 'Vui lòng nhập email hoặc số điện thoại');
            return;
        }

        if (!password) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (!agreeToPolicy) {
            Alert.alert('Lỗi', 'Vui lòng đồng ý với chính sách bảo mật');
            return;
        }

        setIsLoading(true);

        try {
            const success = await registerUser({
                email,
                phone,
                password,
                role: 'user' // Default role for new registrations
            });

            if (success) {
                Alert.alert(
                    'Thành công', 
                    'Đăng ký tài khoản thành công!',
                    [{ text: 'OK', onPress: () => navigation.replace('Login') }]
                );
            } else {
                Alert.alert('Thất bại', 'Đăng ký không thành công, vui lòng thử lại');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Đăng ký</Text>
                        <Text style={styles.subtitle}>Vui lòng đăng nhập hoặc đăng ký để tiếp tục sử dụng ứng dụng của chúng tôi.</Text>

                        <View style={styles.socialContainer}>
                            <Text style={styles.socialText}>Đăng nhập qua mạng xã hội</Text>
                            
                            <View style={styles.socialButtonsContainer}>
                                <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#1877f2'}]}>
                                    <Ionicons name="logo-facebook" size={28} color="#ffffff" />
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ddd'}]}>
                                    <Ionicons name="logo-google" size={28} color="#4285F4" />
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#1DA1F2'}]}>
                                    <Ionicons name="logo-twitter" size={28} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.orText}>hoặc đăng ký với email</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Số điện thoại (tùy chọn)"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={24} 
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons 
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={24} 
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.policyContainer}
                                onPress={() => setAgreeToPolicy(!agreeToPolicy)}
                            >
                                <View style={styles.checkboxContainer}>
                                    {agreeToPolicy ? (
                                        <View style={styles.checkbox}>
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                        </View>
                                    ) : (
                                        <View style={styles.checkboxEmpty} />
                                    )}
                                </View>
                                <Text style={styles.policyText}>Tôi đồng ý với chính sách bảo mật</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            <Text style={styles.signupButtonText}>
                                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            
            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => {
                        navigation.navigate('Home');
                        setActiveTab('home');
                    }}
                >
                    <Ionicons 
                        name={activeTab === 'home' ? "home" : "home-outline"} 
                        size={24} 
                        color={activeTab === 'home' ? "#FF7A00" : "#666"} 
                    />
                    <Text style={[
                        styles.navText,
                        activeTab === 'home' && styles.activeNavText
                    ]}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => {
                        navigation.navigate('Search');
                        setActiveTab('search');
                    }}
                >
                    <Ionicons 
                        name={activeTab === 'search' ? "search" : "search-outline"} 
                        size={24} 
                        color={activeTab === 'search' ? "#FF7A00" : "#666"} 
                    />
                    <Text style={[
                        styles.navText,
                        activeTab === 'search' && styles.activeNavText
                    ]}>Search</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => {
                        navigation.navigate('Categories');
                        setActiveTab('categories');
                    }}
                >
                    <Ionicons 
                        name={activeTab === 'categories' ? "grid" : "grid-outline"} 
                        size={24} 
                        color={activeTab === 'categories' ? "#FF7A00" : "#666"} 
                    />
                    <Text style={[
                        styles.navText,
                        activeTab === 'categories' && styles.activeNavText
                    ]}>Categories</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => {
                        setActiveTab('settings');
                    }}
                >
                    <Ionicons 
                        name={activeTab === 'settings' ? "settings" : "settings-outline"} 
                        size={24} 
                        color={activeTab === 'settings' ? "#FF7A00" : "#666"} 
                    />
                    <Text style={[
                        styles.navText,
                        activeTab === 'settings' && styles.activeNavText
                    ]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    socialContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    socialText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    orText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        height: 52,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 16,
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    policyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxEmpty: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: '#000',
    },
    policyText: {
        fontSize: 14,
        color: '#333',
    },
    signupButton: {
        height: 52,
        backgroundColor: '#6200ee',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    signupButtonDisabled: {
        backgroundColor: '#a278df',
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 70, // Add extra bottom margin for the navigation bar
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    // Bottom navigation styles
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navText: {
        marginTop: 4,
        fontSize: 12,
        color: '#666',
    },
    activeNavText: {
        color: '#FF7A00',
        fontWeight: 'bold',
    },
});

export default SignUpScreen; 