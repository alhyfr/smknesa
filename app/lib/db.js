import mysql from "mysql2/promise";

let pool;

/**
 * Inisialisasi connection pool MySQL
 * Menggunakan singleton pattern agar hanya ada satu pool instance
 * 
 * @returns {mysql.Pool} - MySQL connection pool
 */
function initPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    return pool;
}

/**
 * Mendapatkan koneksi database dari pool
 * PENTING: Jangan lupa untuk release connection setelah selesai digunakan
 * 
 * @returns {Promise<mysql.PoolConnection>} - Database connection
 * 
 * Contoh penggunaan:
 * const connection = await db();
 * try {
 *   const [rows] = await connection.query('SELECT * FROM users');
 *   return rows;
 * } finally {
 *   connection.release(); // WAJIB di-release!
 * }
 */
export async function db() {
    const connectionPool = initPool();
    return connectionPool.getConnection();
}

/**
 * Helper function untuk menjalankan query dengan auto-release connection
 * Lebih aman karena otomatis release connection setelah query selesai
 * 
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters (optional)
 * @returns {Promise<Array>} - Query result [rows, fields]
 * 
 * Contoh penggunaan:
 * const [rows] = await query('SELECT * FROM users WHERE id = ?', [userId]);
 */
export async function query(sql, params = []) {
    const connection = await db();
    try {
        return await connection.query(sql, params);
    } finally {
        connection.release();
    }
}