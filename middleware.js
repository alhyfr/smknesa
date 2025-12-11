import { NextResponse } from 'next/server';

// ============================================
// KONFIGURASI ROUTES BERDASARKAN ROLE
// ============================================
// Tambahkan path baru di sini sesuai role yang bisa mengaksesnya
const ROUTE_CONFIG = {
    guru: {
        allowedPaths: [
            '/guru/dashboard',
            '/guru/laporan',
            '/guru/siswa',
            '/guru/absensi',
            '/guru/nilai',
            '/guru/jadwal',
            '/guru/profile',
            // Tambahkan path guru lainnya di sini
        ],
        defaultRedirect: '/guru/dashboard'
    },
    siswa: {
        allowedPaths: [
            '/siswa/home',
            '/siswa/tugas',
            '/siswa/nilai',
            '/siswa/absensi',
            '/siswa/jadwal',
            '/siswa/profile',
            // Tambahkan path siswa lainnya di sini
        ],
        defaultRedirect: '/siswa/home'
    }
};

// Helper function untuk get default redirect berdasarkan role
function getDefaultRedirect(role) {
    return ROUTE_CONFIG[role]?.defaultRedirect || '/login';
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Ambil token dari cookie
    const token = request.cookies.get('auth_token')?.value;

    // Decode token untuk mendapatkan role
    let userRole = null;

    if (token) {
        try {
            // Decode JWT token (jose format)
            // Split token dan decode payload (bagian kedua dari JWT)
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                userRole = payload.role;
            }
        } catch (error) {
            // Jika gagal decode, token mungkin invalid atau expired
            console.error('Error parsing token in middleware:', error.message);
            // Set userRole null agar dianggap tidak terautentikasi
            userRole = null;
        }
    }

    // Halaman yang memerlukan autentikasi
    const protectedPaths = ['/siswa', '/guru'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // PENGECEKAN ROOT PATH (/) - Prioritas tertinggi
    if (pathname === '/') {
        // Jika tidak ada token, redirect ke login
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Jika ada token dan role, redirect ke halaman sesuai role
        if (userRole) {
            return NextResponse.redirect(new URL(getDefaultRedirect(userRole), request.url));
        }

        // Jika token ada tapi role tidak valid, redirect ke login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika mengakses halaman yang dilindungi tanpa token, redirect ke login
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika sudah login, redirect berdasarkan role
    if (token && userRole) {
        // Jika guru mengakses halaman siswa, redirect ke dashboard guru
        if (userRole === 'guru' && pathname.startsWith('/siswa')) {
            return NextResponse.redirect(new URL(getDefaultRedirect('guru'), request.url));
        }

        // Jika siswa mengakses halaman guru, redirect ke home siswa
        if (userRole === 'siswa' && pathname.startsWith('/guru')) {
            return NextResponse.redirect(new URL(getDefaultRedirect('siswa'), request.url));
        }

        // Jika mengakses login saat sudah terautentikasi, redirect ke halaman sesuai role
        if (pathname === '/login') {
            return NextResponse.redirect(new URL(getDefaultRedirect(userRole), request.url));
        }
    }

    // Lanjutkan request jika tidak ada kondisi redirect
    return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan path mana yang akan diproses middleware
export const config = {
    matcher: [
        /*
         * Match semua request paths kecuali:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
