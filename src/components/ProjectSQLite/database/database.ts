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