import { cookies } from "next/headers";

// Nama cookie yang digunakan untuk menyimpan token autentikasi
const COOKIE_NAME = "auth_token";

/**
 * Menyimpan token autentikasi ke dalam cookie
 * 
 * @param {string} token - Token autentikasi yang akan disimpan
 * @returns {Promise<void>}
 * 
 * Konfigurasi cookie:
 * - httpOnly: true - Cookie hanya bisa diakses oleh server, tidak bisa diakses via JavaScript (keamanan XSS)
 * - secure: true (production) - Cookie hanya dikirim melalui HTTPS di production
 * - sameSite: "strict" - Cookie hanya dikirim untuk request dari domain yang sama (keamanan CSRF)
 * - maxAge: 7 hari - Cookie akan expired setelah 7 hari (60 detik * 60 menit * 24 jam * 7 hari)
 */
export async function setAuthToken(token) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
    })
}

/**
 * Mengambil token autentikasi dari cookie
 * 
 * @returns {Promise<string|null>} - Mengembalikan nilai token jika ada, atau null jika tidak ada
 * 
 * Fungsi ini membaca cookie auth_token dan mengembalikan nilainya.
 * Jika cookie tidak ditemukan, akan mengembalikan null.
 */
export async function getAuthCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
}

/**
 * Menghapus cookie autentikasi
 * 
 * @returns {Promise<void>}
 * 
 * Fungsi ini digunakan saat user logout untuk menghapus token autentikasi
 * dari cookie browser.
 */
export async function deleteAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
