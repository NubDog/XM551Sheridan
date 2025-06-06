import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
  quantity: number;
};

export type User = {
  id: number;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'admin';
};

const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];
const initialProducts: Product[] = [
    { id: 1, name: 'Áo sơ mi', price: 250000, img: 'hinh1.jpg', categoryId: 1, quantity: 0 },
    { id: 2, name: 'Giày sneaker', price: 1100000, img: 'hinh1.jpg', categoryId: 2, quantity: 0 },
    { id: 3, name: 'Balo thời trang', price: 490000, img: 'hinh1.jpg', categoryId: 3, quantity: 0 },
    { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: 'hinh1.jpg', categoryId: 4, quantity: 0 },
    { id: 5, name: 'Túi xách nữ', price: 980000, img: 'hinh1.jpg', categoryId: 5, quantity: 0 },
  ];

const initialUsers: User[] = [
  { id: 1, email: 'admin@example.com', phone: '0987654321', password: 'admin123', role: 'admin' },
  { id: 2, email: 'user@example.com', phone: '0123456789', password: 'user123', role: 'user' },
  { id: 3, email: 'admin', phone: '0909090909', password: '123', role: 'admin' },
];

//async: Khai báo đây là một hàm bất đồng bộ, cho phép sử dụng await bên trong
// onSuccess?: () => void: Tham số truyền vào là một callback tùy chọn, gọi khi quá trình khởi tạo thành công.
// Promise<void>: Hàm trả về một Promise, không trả giá trị cụ thể (kiểu void), nhằm đảm bảo có thể chờ quá trình khởi tạo hoàn tất.
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
    try {
      const database = await getDb();
 
      database.transaction((tx) => {
         // tx.executeSql('DROP TABLE IF EXISTS products');
        // tx.executeSql('DROP TABLE IF EXISTS categories');
        tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)');
        initialCategories.forEach((category) => {
          tx.executeSql('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [category.id, category.name]);
        });
 
        tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          img TEXT,
          categoryId INTEGER,
          quantity INTEGER DEFAULT 0,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )`);
 
        initialProducts.forEach((product) => {
          tx.executeSql('INSERT OR IGNORE INTO products (id, name, price, img, categoryId, quantity) VALUES (?, ?, ?, ?, ?, ?)',
            [product.id, product.name, product.price, product.img, product.categoryId, product.quantity]);
        });

        tx.executeSql(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('user', 'admin')) DEFAULT 'user'
        )`);

        initialUsers.forEach((user) => {
          tx.executeSql('INSERT OR IGNORE INTO users (id, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [user.id, user.email, user.phone, user.password, user.role]);
        });
      },
      (error) => console.error('❌ Transaction error:', error),
      () => {
        console.log('✅ Database initialized');
        if (onSuccess) onSuccess();
      });
 
    } catch (error) {
      console.error('❌ initDatabase outer error:', error);
    }
  };
 
 

 

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM categories');
    const items: Category[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM products');
    const items: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO products (name, price, img, categoryId, quantity) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId, product.quantity]
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
};

export const updateProduct = async (product: Product) => {
    try {
      const database = await getDb();
      await database.executeSql(
        'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ?, quantity = ? WHERE id = ?',
        [product.name, product.price, product.categoryId, product.img, product.quantity, product.id]
      );
      console.log('✅ Product updated with image');
    } catch (error) {
      console.error('❌ Error updating product:', error);
    }
  };
 
export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.executeSql('DELETE FROM products WHERE id = ?', [id]);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};
//---------------lọc sản phẩm theo loại------
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM products WHERE categoryId = ?',
      [categoryId]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};

// User authentication functions
export const registerUser = async (user: Omit<User, 'id'>): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO users (email, phone, password, role) VALUES (?, ?, ?, ?)',
      [user.email, user.phone || null, user.password, user.role]
    );
    console.log('✅ User registered successfully');
    return true;
  } catch (error) {
    console.error('❌ Error registering user:', error);
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const database = await getDb();
    const results = await database.executeSql(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0) as User;
    }
    return null;
  } catch (error) {
    console.error('❌ Error during login:', error);
    return null;
  }
};

export const loginWithPhone = async (phone: string, password: string): Promise<User | null> => {
  try {
    const database = await getDb();
    const results = await database.executeSql(
      'SELECT * FROM users WHERE phone = ? AND password = ?',
      [phone, password]
    );
    
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0) as User;
    }
    return null;
  } catch (error) {
    console.error('❌ Error during phone login:', error);
    return null;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM users');
    const items: User[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const database = await getDb();
    const searchTerm = `%${query}%`;
    const results = await database.executeSql(
      'SELECT * FROM products WHERE name LIKE ?',
      [searchTerm]
    );
    
    const products: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error searching products:', error);
    return [];
  }
};

export const addUser = async (user: Omit<User, 'id'>) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO users (email, phone, password, role) VALUES (?, ?, ?, ?)',
      [user.email, user.phone || null, user.password, user.role]
    );
    console.log('✅ User added');
  } catch (error) {
    console.error('❌ Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (user: User) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'UPDATE users SET email = ?, phone = ?, password = ?, role = ? WHERE id = ?',
      [user.email, user.phone || null, user.password, user.role, user.id]
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const database = await getDb();
    await database.executeSql('DELETE FROM users WHERE id = ?', [id]);
    console.log('✅ User deleted');
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
};