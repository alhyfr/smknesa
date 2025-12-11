'use client'
import Button from "@/app/components/Button"
import { useState } from "react"

export default function TambahUser({ onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        username: initialData?.username || '',
        password: '',
        role: initialData?.role || '',
    })

    const isEdit = !!initialData

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password {isEdit && <span className="text-gray-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={isEdit ? "Biarkan kosong untuk password lama" : "Password"}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        required={!isEdit}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Pilih Role</option>
                        <option value="guru">Guru</option>
                        <option value="siswa">Siswa</option>
                    </select>
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="submit" variant="primary" label={isEdit ? "Simpan Perubahan" : "Tambah User"} fullWidth={true} />
                </div>
            </form>
        </div>
    )
}