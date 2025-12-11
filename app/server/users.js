'use server'

import { query } from '../lib/db'
import bcrypt from 'bcrypt'
import validator from 'validator'

export async function getUsers({ page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit

    // Build WHERE clause for search
    let whereClause = ''
    let queryParams = []

    if (search) {
        whereClause = 'WHERE username LIKE ? OR role LIKE ?'
        const searchPattern = `%${search}%`
        queryParams = [searchPattern, searchPattern]
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`
    const [countResult] = await query(countQuery, queryParams)
    const total = countResult.total

    // Get paginated data
    const dataQuery = `
        SELECT id, username,role
        FROM users 
        ${whereClause}
        ORDER BY username ASC
        LIMIT ? OFFSET ?
    `
    const dataParams = search ? [...queryParams, limit, offset] : [limit, offset]
    const [users] = await query(dataQuery, dataParams)

    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}
export async function createUser(formData) {
    const { username, password, role } = formData

    // Validation
    if (validator.isEmpty(username)) throw new Error('Username wajib diisi')
    if (!validator.isLength(password, { min: 6 })) throw new Error('Password minimal 6 karakter')
    if (!['guru', 'siswa'].includes(role)) throw new Error('Role tidak valid')

    // Check if username exists
    const [existing] = await query('SELECT id FROM users WHERE username = ?', [username])
    if (existing && existing.length > 0) throw new Error('Username sudah digunakan')

    const hashedPassword = await bcrypt.hash(password, 10)
    const insertQuery = 'INSERT INTO users (username, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())'
    const [result] = await query(insertQuery, [username, hashedPassword, role])
    // Serialize result to plain object
    return { ...result, insertId: result.insertId }
}

export async function deleteUser(id) {
    const deleteQuery = 'DELETE FROM users WHERE id = ?'
    const [result] = await query(deleteQuery, [id])
    return JSON.stringify(result)
}

export async function updateUser(id, formData) {
    const { username, password, role } = formData

    // Validation
    if (validator.isEmpty(username)) throw new Error('Username wajib diisi')
    if (!['guru', 'siswa'].includes(role)) throw new Error('Role tidak valid')

    // Check if username exists (excluding current user)
    const [existing] = await query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id])
    if (existing && existing.length > 0) throw new Error('Username sudah digunakan')

    if (!password) {
        const updateQuery = 'UPDATE users SET username = ?, role = ?, updated_at = NOW() WHERE id = ?'
        const [result] = await query(updateQuery, [username, role, id])
        return JSON.stringify(result)
    }

    if (!validator.isLength(password, { min: 6 })) throw new Error('Password minimal 6 karakter')

    const hashedPassword = await bcrypt.hash(password, 10)
    const updateQuery = 'UPDATE users SET username = ?, password = ?, role = ?, updated_at = NOW() WHERE id = ?'
    const [result] = await query(updateQuery, [username, hashedPassword, role, id])
    return JSON.stringify(result)
}
