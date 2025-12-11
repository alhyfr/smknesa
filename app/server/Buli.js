'use server'
import { query } from "../lib/db"

export async function getBuli({ page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit
    let whereClause = ''
    let queryParams = []

    if (search) {
        whereClause = 'WHERE pelapor_nama LIKE ? OR pelapor_peran LIKE ? OR pelapor_kelas_jabatan LIKE ? OR korban_nama LIKE ? OR korban_kelas LIKE ? OR pelaku_nama LIKE ? OR pelaku_kelas LIKE ? OR jenis_bullying LIKE ?'
        const searchPattern = `%${search}%`
        queryParams = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
    }

    const countQuery = `SELECT COUNT(*) as total FROM laporan_bullying ${whereClause}`
    const [countResult] = await query(countQuery, queryParams)
    const total = countResult.total

    const dataQuery = `
        SELECT *
        FROM  laporan_bullying
        ${whereClause}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `
    const dataParams = search ? [...queryParams, limit, offset] : [limit, offset]
    const [buli] = await query(dataQuery, dataParams)

    return {
        data: buli,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}
export async function createBuli(formData) {
    const { is_anon, pelapor_nama, pelapor_peran, pelapor_kelas_jabatan, pelapor_kontak, korban_nama, korban_kelas, pelaku_nama, pelaku_kelas, jenis_bullying, frekuensi, tanggal_kejadian_terakhir, lokasi_kejadian, deskripsi_kejadian, dampak_utama, harapan_pelapor, bersedia_dihubungi, ada_bukti, catatan_tambahan, status_laporan } = formData
    const insertQuery = 'INSERT INTO laporan_bullying (is_anon, pelapor_nama, pelapor_peran, pelapor_kelas_jabatan,pelapor_kontak,korban_nama,korban_kelas,pelaku_nama,pelaku_kelas,jenis_bullying,frekuensi,tanggal_kejadian_terakhir,lokasi_kejadian,deskripsi_kejadian,dampak_utama,harapan_pelapor,bersedia_dihubungi,ada_bukti,catatan_tambahan,status_laporan,created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
    const [result] = await query(insertQuery, [is_anon, pelapor_nama, pelapor_peran, pelapor_kelas_jabatan, pelapor_kontak, korban_nama, korban_kelas, pelaku_nama, pelaku_kelas, jenis_bullying, frekuensi, tanggal_kejadian_terakhir, lokasi_kejadian, deskripsi_kejadian, dampak_utama, harapan_pelapor, bersedia_dihubungi, ada_bukti, catatan_tambahan, status_laporan])
    return JSON.stringify(result)
}

export async function deleteBuli(id) {
    const deleteQuery = 'DELETE FROM laporan_bullying WHERE id = ?'
    const [result] = await query(deleteQuery, [id])
    return { ...result }
}

export async function updateBuli(id, formData) {
    const { is_anon, pelapor_nama, pelapor_peran, pelapor_kelas_jabatan, pelapor_kontak, korban_nama, korban_kelas, pelaku_nama, pelaku_kelas, jenis_bullying, frekuensi, tanggal_kejadian_terakhir, lokasi_kejadian, deskripsi_kejadian, dampak_utama, harapan_pelapor, bersedia_dihubungi, ada_bukti, catatan_tambahan, status_laporan } = formData
    const updateQuery = 'UPDATE laporan_bullying SET is_anon = ?, pelapor_nama = ?, pelapor_peran = ?, pelapor_kelas_jabatan = ?, pelapor_kontak = ?, korban_nama = ?, korban_kelas = ?, pelaku_nama = ?, pelaku_kelas = ?, jenis_bullying = ?, frekuensi = ?, tanggal_kejadian_terakhir = ?, lokasi_kejadian = ?, deskripsi_kejadian = ?, dampak_utama = ?, harapan_pelapor = ?, bersedia_dihubungi = ?, ada_bukti = ?, catatan_tambahan = ?, status_laporan = ?, updated_at = NOW() WHERE id = ?'
    const [result] = await query(updateQuery, [is_anon, pelapor_nama, pelapor_peran, pelapor_kelas_jabatan, pelapor_kontak, korban_nama, korban_kelas, pelaku_nama, pelaku_kelas, jenis_bullying, frekuensi, tanggal_kejadian_terakhir, lokasi_kejadian, deskripsi_kejadian, dampak_utama, harapan_pelapor, bersedia_dihubungi, ada_bukti, catatan_tambahan, status_laporan, id])
    return JSON.stringify(result)
}
export async function getBuliById(id) {
    const selectQuery = 'SELECT * FROM laporan_bullying WHERE id = ?'
    const [result] = await query(selectQuery, [id])
    return JSON.stringify(result)
}
export async function updateBuliStatus(id, status) {
    const updateQuery = 'UPDATE laporan_bullying SET status_laporan = ? WHERE id = ?'
    const [result] = await query(updateQuery, [status, id])
    return JSON.stringify(result)
}
