import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'

// Định nghĩa kiểu dữ liệu học sinh
type Student = {
    id: number;
    name: string;
    age: number;
    grade: number;
}

// Các loại lọc và sắp xếp
type FilterType = 'age' | 'grade' | 'name' | 'none';
type SortType = 'grade' | 'age' | 'none';
type SortDirection = 'asc' | 'desc';

// Dữ liệu mẫu
const initialStudents: Student[] = [
    { id: 1, name: 'Nguyễn Văn A', age: 18, grade: 8.5 },
    { id: 2, name: 'Trần Thị B', age: 19, grade: 9.0 },
    { id: 3, name: 'Lê Văn C', age: 17, grade: 7.5 },
    { id: 4, name: 'Phạm Thị D', age: 20, grade: 8.0 },
];

// Component hiển thị một học sinh
const StudentItem = ({ student, onEdit, onDelete }: { 
    student: Student, 
    onEdit: (student: Student) => void, 
    onDelete: (id: number) => void 
}) => (
    <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetail}>Tuổi: {student.age} | Điểm: {student.grade.toFixed(1)}</Text>
        </View>
        <View style={styles.studentActions}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => onEdit(student)}
            >
                <Text style={styles.actionText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(student.id)}
            >
                <Text style={styles.actionText}>Xóa</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// Component chính
const StudentManager = () => {
    // State
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [grade, setGrade] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterType, setFilterType] = useState<FilterType>('none');
    const [filterValue, setFilterValue] = useState('');
    const [sortType, setSortType] = useState<SortType>('none');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Reset form
    const resetForm = () => {
        setName('');
        setAge('');
        setGrade('');
        setEditingId(null);
    };

    // Thêm học sinh mới
    const handleAddStudent = () => {
        // Kiểm tra đầu vào
        if (!name || !age || !grade) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin học sinh');
            return;
        }

        const ageNum = parseInt(age);
        const gradeNum = parseFloat(grade);

        if (isNaN(ageNum) || isNaN(gradeNum)) {
            Alert.alert('Lỗi', 'Tuổi và điểm phải là số');
            return;
        }

        // Tạo học sinh mới
        const newStudent: Student = {
            id: Math.max(0, ...students.map(s => s.id)) + 1,
            name: name,
            age: ageNum,
            grade: gradeNum
        };

        // Cập nhật danh sách
        setStudents([...students, newStudent]);
        resetForm();
    };

    // Bắt đầu chỉnh sửa
    const handleEditStudent = (student: Student) => {
        setEditingId(student.id);
        setName(student.name);
        setAge(student.age.toString());
        setGrade(student.grade.toString());
    };

    // Lưu thông tin chỉnh sửa
    const handleUpdateStudent = () => {
        // Kiểm tra đầu vào
        if (!name || !age || !grade) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin học sinh');
            return;
        }

        const ageNum = parseInt(age);
        const gradeNum = parseFloat(grade);

        if (isNaN(ageNum) || isNaN(gradeNum)) {
            Alert.alert('Lỗi', 'Tuổi và điểm phải là số');
            return;
        }

        // Cập nhật học sinh
        setStudents(students.map(student => 
            student.id === editingId 
                ? { ...student, name, age: ageNum, grade: gradeNum }
                : student
        ));
        resetForm();
    };

    // Xóa học sinh
    const handleDeleteStudent = (id: number) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa học sinh này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    onPress: () => setStudents(students.filter(s => s.id !== id)),
                    style: 'destructive' 
                }
            ]
        );
    };

    // Lọc và sắp xếp học sinh
    const getFilteredAndSortedStudents = () => {
        let result = [...students];

        // Áp dụng bộ lọc
        if (filterType !== 'none' && filterValue) {
            if (filterType === 'age') {
                const value = parseInt(filterValue);
                if (!isNaN(value)) result = result.filter(s => s.age >= value);
            } else if (filterType === 'grade') {
                const value = parseFloat(filterValue);
                if (!isNaN(value)) result = result.filter(s => s.grade >= value);
            } else if (filterType === 'name') {
                result = result.filter(s => 
                    s.name.toLowerCase().includes(filterValue.toLowerCase())
                );
            }
        }

        // Áp dụng sắp xếp
        if (sortType !== 'none') {
            result.sort((a, b) => {
                const valA = sortType === 'age' ? a.age : a.grade;
                const valB = sortType === 'age' ? b.age : b.grade;
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            });
        }

        return result;
    };

    // Đếm học sinh điểm cao
    const getHighGradeCount = () => students.filter(s => s.grade > 8).length;

    // Danh sách học sinh đã lọc và sắp xếp
    const filteredStudents = getFilteredAndSortedStudents();

    // Filter Options Component
    const FilterOptions = () => (
        <View style={styles.filterContainer}>
            <Text style={styles.labelText}>Lọc theo:</Text>
            <View style={styles.optionsRow}>
                {['name', 'age', 'grade', 'none'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.optionChip,
                            filterType === type && styles.activeOption
                        ]}
                        onPress={() => {
                            setFilterType(type as FilterType);
                            if (type === 'none') setFilterValue('');
                        }}
                    >
                        <Text style={[
                            styles.optionText,
                            filterType === type && styles.activeOptionText
                        ]}>
                            {type === 'name' ? 'Tên' : 
                             type === 'age' ? 'Tuổi' : 
                             type === 'grade' ? 'Điểm' : 'Xóa lọc'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {filterType !== 'none' && (
                <TextInput
                    style={styles.input}
                    placeholder={`Nhập ${
                        filterType === 'name' ? 'tên' : 
                        filterType === 'age' ? 'tuổi tối thiểu' : 'điểm tối thiểu'
                    }`}
                    value={filterValue}
                    onChangeText={setFilterValue}
                    keyboardType={filterType === 'name' ? 'default' : 'numeric'}
                />
            )}
        </View>
    );

    // Sort Options Component
    const SortOptions = () => (
        <View style={styles.sortContainer}>
            <Text style={styles.labelText}>Sắp xếp theo:</Text>
            <View style={styles.optionsRow}>
                {['age', 'grade', 'none'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.optionChip,
                            sortType === type && styles.activeOption
                        ]}
                        onPress={() => setSortType(type as SortType)}
                    >
                        <Text style={[
                            styles.optionText,
                            sortType === type && styles.activeOptionText
                        ]}>
                            {type === 'age' ? 'Tuổi' : 
                             type === 'grade' ? 'Điểm' : 'Không sắp xếp'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {sortType !== 'none' && (
                <View style={styles.optionsRow}>
                    {['asc', 'desc'].map((dir) => (
                        <TouchableOpacity
                            key={dir}
                            style={[
                                styles.optionChip,
                                sortDirection === dir && styles.activeOption
                            ]}
                            onPress={() => setSortDirection(dir as SortDirection)}
                        >
                            <Text style={[
                                styles.optionText,
                                sortDirection === dir && styles.activeOptionText
                            ]}>
                                {dir === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4b6cb7" barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản Lý Học Sinh</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* PHẦN FORM */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {editingId ? '✏️ Cập nhật học sinh' : '➕ Thêm học sinh mới'}
                    </Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Họ và tên học sinh"
                        value={name}
                        onChangeText={setName}
                    />
                    
                    <View style={styles.rowInputs}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Tuổi"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Điểm số"
                            value={grade}
                            onChangeText={setGrade}
                            keyboardType="numeric"
                        />
                    </View>
                    
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, editingId ? styles.updateButton : styles.addButton]}
                            onPress={editingId ? handleUpdateStudent : handleAddStudent}
                        >
                            <Text style={styles.buttonText}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Text>
                        </TouchableOpacity>
                        
                        {editingId && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={resetForm}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* PHẦN LỌC VÀ SẮP XẾP */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔍 Tìm kiếm & Sắp xếp</Text>
                    <FilterOptions />
                    <SortOptions />
                </View>

                {/* PHẦN THỐNG KÊ */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📊 Thống kê</Text>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{students.length}</Text>
                            <Text style={styles.statLabel}>Tổng học sinh</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{getHighGradeCount()}</Text>
                            <Text style={styles.statLabel}>Điểm {">"} 8</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {(students.reduce((sum, s) => sum + s.grade, 0) / (students.length || 1)).toFixed(1)}
                            </Text>
                            <Text style={styles.statLabel}>Điểm TB</Text>
                        </View>
                    </View>
                </View>

                {/* PHẦN DANH SÁCH */}
                <View style={[styles.card, styles.listCard]}>
                    <View style={styles.listHeader}>
                        <Text style={styles.cardTitle}>👨‍🎓 Danh sách học sinh</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{filteredStudents.length}</Text>
                        </View>
                    </View>
                    
                    {filteredStudents.length === 0 ? (
                        <Text style={styles.emptyText}>Không có học sinh nào phù hợp</Text>
                    ) : (
                        filteredStudents.map((student) => (
                            <StudentItem 
                                key={student.id}
                                student={student}
                                onEdit={handleEditStudent}
                                onDelete={handleDeleteStudent}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default StudentManager

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        backgroundColor: '#4b6cb7',
        paddingVertical: 16,
        paddingHorizontal: 20,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#f9fafc',
        fontSize: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    updateButton: {
        backgroundColor: '#2196F3',
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    filterContainer: {
        marginBottom: 16,
    },
    sortContainer: {
        marginBottom: 8,
    },
    labelText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#34495e',
        fontWeight: '500',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    optionChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#f0f2f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeOption: {
        backgroundColor: '#4b6cb7',
        borderColor: '#4b6cb7',
    },
    optionText: {
        color: '#34495e',
        fontWeight: '500',
    },
    activeOptionText: {
        color: 'white',
    },
    listCard: {
        flex: 1,
        paddingHorizontal: 12,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: '#4b6cb7',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 8,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#95a5a6',
        marginVertical: 20,
        fontStyle: 'italic',
    },
    studentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafc',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#4b6cb7',
    },
    studentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#2c3e50',
    },
    studentDetail: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    studentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editButton: {
        backgroundColor: '#F9A825',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        padding: 12,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4b6cb7',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
});
