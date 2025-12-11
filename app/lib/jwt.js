import { SignJWT, jwtVerify } from "jose";

/**
 * Secret key untuk signing dan verifying JWT token
 * Diambil dari environment variable JWT_SECRET dan di-encode ke format Uint8Array
 * yang dibutuhkan oleh library jose
 */
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Membuat JWT token baru dengan payload yang diberikan
 * 
 * @param {Object} payload - Data yang akan disimpan dalam token (contoh: { userId: 1, email: 'user@example.com' })
 * @returns {Promise<string>} - JWT token string yang sudah di-sign
 * @throws {Error} - Melempar error jika gagal membuat token
 * 
 * Konfigurasi token:
 * - Algorithm: HS256 (HMAC with SHA-256)
 * - Issued At: Waktu token dibuat (otomatis set ke waktu sekarang)
 * - Expiration: Token akan expired setelah 7 hari
 * 
 * Contoh penggunaan:
 * const token = await createToken({ userId: 123, email: 'user@example.com' });
 */
export async function createToken(payload) {
    try {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret);
        return token;
    } catch (error) {
        console.log('error membuat token', error);
        throw new Error('gagal membuat token');
    }
}

/**
 * Memverifikasi dan mendecode JWT token
 * 
 * @param {string} token - JWT token string yang akan diverifikasi
 * @returns {Promise<Object>} - Payload yang tersimpan dalam token jika valid
 * @throws {Error} - Melempar error jika token invalid, expired, atau signature tidak cocok
 * 
 * Fungsi ini akan:
 * 1. Memverifikasi signature token menggunakan secret key
 * 2. Mengecek apakah token sudah expired
 * 3. Mengembalikan payload jika semua validasi berhasil
 * 
 * Contoh penggunaan:
 * try {
 *   const payload = await verifyToken(token);
 *   console.log(payload.userId); // 123
 * } catch (error) {
 *   console.log('Token tidak valid');
 * }
 */
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.log('error verify token', error);
        throw new Error('gagal verify token');
    }
}
