import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { 
  User,
  fetchUsers,
  addUser,
  updateUser,
  deleteUser
} from './database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  UserManagement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Apply filters when search changes
  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const filterUsers = () => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(query) || 
      (user.phone && user.phone.includes(query))
    );
    
    setFilteredUsers(filtered);
  };
  
  const handleAddUser = () => {
    // Reset form
    setEditingUser(null);
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('user');
    setFormVisible(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEmail(user.email);
    setPhone(user.phone || '');
    setPassword(''); // We don't show the existing password for security
    setRole(user.role);
    setFormVisible(true);
  };
  
  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa người dùng "${user.email}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.id);
              loadData(); // Refresh user list
              Alert.alert('Thành công', 'Đã xóa người dùng');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          }
        }
      ]
    );
  };
  
  const handleSaveUser = async () => {
    // Validate form
    if (!email || !password && !editingUser) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    
    try {
      const userData = {
        email,
        phone,
        password: password || (editingUser ? editingUser.password : ''),
        role
      };
      
      if (editingUser) {
        // Update existing user
        await updateUser({
          ...userData,
          id: editingUser.id,
          password: password ? password : editingUser.password // Only update password if changed
        });
        Alert.alert('Thành công', 'Cập nhật người dùng thành công');
      } else {
        // Add new user
        await addUser(userData);
        Alert.alert('Thành công', 'Thêm người dùng mới thành công');
      }
      
      // Close form and refresh user list
      setFormVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin người dùng');
    }
  };
  
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.email}</Text>
          <View style={[
            styles.roleBadge, 
            item.role === 'admin' ? styles.adminBadge : styles.userBadge
          ]}>
            <Text style={styles.roleText}>
              {item.role === 'admin' ? 'Admin' : 'User'}
            </Text>
          </View>
        </View>
        
        {item.phone && (
          <View style={styles.userDetail}>
            <Ionicons name="call-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        )}
        
        <View style={styles.userDetail}>
          <Ionicons name="key-outline" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.detailText}>••••••••</Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEditUser(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteUser(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="person-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddUser}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy người dùng nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.userList}
        />
      )}
      
      {/* User Form Modal */}
      <Modal
        visible={formVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </Text>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              <TextInput
                style={styles.formInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.formInput}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
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
              
              <TouchableOpacity
                style={styles.formDropdown}
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <Text>
                  {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
              
              {showRoleDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => {
                      setRole('user');
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text>Người dùng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => {
                      setRole('admin');
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text>Quản trị viên</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveUser}
              >
                <Text style={styles.saveButtonText}>
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  userList: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: '#FFC107',
  },
  userBadge: {
    backgroundColor: '#4CAF50',
  },
  roleText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  userActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    height: 48,
  },
  eyeIcon: {
    padding: 4,
  },
  formDropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserManagementScreen; 