import React, { useState, useEffect } from 'react';
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
    ScrollView,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { loginUser, loginWithPhone, User } from './database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    SignUp: undefined;
    Categories: undefined;
    Search: undefined;
    ProductManagement: undefined;
    UserManagement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    
    // User login state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const checkUserLogin = async () => {
            try {
                const userInfoString = await AsyncStorage.getItem('userInfo');
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    setCurrentUser(userInfo);
                    setIsAdmin(userInfo.role === 'admin');
                }
            } catch (error) {
                console.error('Error checking user login status:', error);
            }
        };
        
        checkUserLogin();
    }, []);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
            return;
        }

        setIsLoading(true);

        try {
            // Determine if the identifier is an email or phone number
            const isEmail = identifier.includes('@');
            
            let user;
            if (isEmail) {
                user = await loginUser(identifier, password);
            } else {
                user = await loginWithPhone(identifier, password);
            }

            if (user) {
                // Store user info in AsyncStorage
                await AsyncStorage.setItem('userInfo', JSON.stringify(user));
                
                setCurrentUser(user);
                setIsAdmin(user.role === 'admin');
                
                Alert.alert('Thành công', 'Đăng nhập thành công!');
            } else {
                Alert.alert('Thất bại', 'Email/số điện thoại hoặc mật khẩu không chính xác');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userInfo');
            setCurrentUser(null);
            setIsAdmin(false);
            Alert.alert('Đăng xuất thành công');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất, vui lòng thử lại sau.');
        }
    };

    const renderLoginForm = () => (
        <View style={styles.contentContainer}>
            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục sử dụng ứng dụng của chúng tôi.</Text>

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
                
                <Text style={styles.orText}>hoặc đăng nhập với email/số điện thoại</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email hoặc số điện thoại"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
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
                
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                <Text style={styles.loginButtonText}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderUserProfile = () => (
        <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={50} color="#6200ee" />
                </View>
                <Text style={styles.welcomeText}>
                    Xin chào, {isAdmin ? 'Admin' : 'User'}!
                </Text>
            </View>

            <View style={styles.profileInfoContainer}>
                <Text style={styles.profileTitle}>Thông tin tài khoản</Text>
                
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={24} color="#6200ee" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{currentUser?.email || 'Không có email'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={24} color="#6200ee" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{currentUser?.phone || 'Không có số điện thoại'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#6200ee" style={styles.infoIcon} />
                    <Text style={styles.infoText}>Vai trò: {currentUser?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</Text>
                </View>
            </View>

            {isAdmin && (
                <View style={styles.adminControlsContainer}>
                    <Text style={styles.controlsTitle}>Quản lý hệ thống</Text>
                    
                    <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ProductManagement')}>
                        <Ionicons name="cube-outline" size={24} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.adminButtonText}>Quản lý sản phẩm</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('UserManagement')}>
                        <Ionicons name="people-outline" size={24} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.adminButtonText}>Quản lý người dùng</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {currentUser ? renderUserProfile() : renderLoginForm()}
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
                    onPress={() => setActiveTab('settings')}
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
        marginBottom: 8,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#333',
        fontSize: 14,
    },
    loginButton: {
        height: 52,
        backgroundColor: '#6200ee',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#a278df',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 70, // Add extra bottom margin for the navigation bar
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    // Profile styles
    profileContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 80,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    profileInfoContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    adminControlsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    controlsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    adminButton: {
        backgroundColor: '#6200ee',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonIcon: {
        marginRight: 8,
    },
    adminButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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

export default LoginScreen; 