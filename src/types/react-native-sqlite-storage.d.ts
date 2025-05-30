declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    transaction: (callback: (tx: Transaction) => void, errorCallback?: (error: Error) => void, successCallback?: () => void) => void;
    executeSql: (sql: string, params?: any[]) => Promise<[SQLiteResult]>;
  }

  export interface Transaction {
    executeSql: (sql: string, params?: any[], callback?: (tx: Transaction, results: SQLiteResult) => void, errorCallback?: (tx: Transaction, error: Error) => void) => void;
  }

  export interface SQLiteResult {
    rows: {
      length: number;
      item: (index: number) => any;
    };
  }

  export function openDatabase(params: { name: string; location?: string }): Promise<SQLiteDatabase>;
  export function enablePromise(enable: boolean): void;
  export function DEBUG(enable: boolean): void;
} 