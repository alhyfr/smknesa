'use server'

import { query } from "../lib/db";
import { compare } from "bcrypt";
import { createToken } from "../lib/jwt"
import { setAuthToken, deleteAuthCookie } from "../lib/cookies"
import { revalidatePath } from "next/cache";

export async function login({ username, password }) {
    try {
        console.log('🔵 [LOGIN] Starting login for username:', username)

        if (!username || !password) {
            throw new Error('Username and password are required')
        }

        // Gunakan query() helper yang auto-release connection
        const [rows] = await query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        )

        console.log('🔵 [LOGIN] Query result - Found users:', rows.length)

        if (rows.length === 0) {
            throw new Error('Username tidak ditemukan')
        }

        const user = rows[0]
        console.log('🔵 [LOGIN] User data:', {
            username: user.username,
            role: user.role,
            hasPassword: !!user.password,
            allFields: Object.keys(user)
        })

        const isPasswordValid = await compare(password, user.password)
        console.log('🔵 [LOGIN] Password valid:', isPasswordValid)

        if (!isPasswordValid) {
            throw new Error('Password tidak valid')
        }

        // Token menyimpan username dan role dari database
        const tokenPayload = {
            username: user.username,
            role: user.role
        }
        console.log('🔵 [LOGIN] Creating token with payload:', tokenPayload)

        const token = await createToken(tokenPayload)

        console.log('🔵 [LOGIN] Token created:', token.substring(0, 50) + '...')

        await setAuthToken(token)

        // Revalidate path sesuai role dari database
        if (user.role === 'guru') {
            revalidatePath('/guru/dashboard')
        } else if (user.role === 'siswa') {
            revalidatePath('/siswa/home')
        }

        console.log('✅ [LOGIN] Login successful! Role:', user.role)
        return { success: true, role: user.role }

    } catch (error) {
        console.error('❌ [LOGIN] Error:', error.message)
        throw error
    }
}
export async function logout() {
    try {
        await deleteAuthCookie()
        revalidatePath('/')
    } catch (error) {
        throw error
    }
}