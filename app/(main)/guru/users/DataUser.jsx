'use client'
import { getUsers, createUser, deleteUser, updateUser } from "@/app/server/users"
import { useState, useEffect } from 'react'
import DataTable from '@/app/components/DataTable'
import TambahUser from "./TambahUser"
import Modal from "@/app/components/Modal"
import ModalConfirm from "@/app/components/ModalConfim"
import Button from "@/app/components/Button"
import { Trash, Pencil } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

export default function DataUser() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [userToEdit, setUserToEdit] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')


    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 500) // Wait 500ms after user stops typing

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const result = await getUsers({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: debouncedSearch
                })
                setUsers(result.data)
                setPagination(result.pagination)
            } catch (error) {
                console.error('Error fetching users:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [pagination.page, pagination.limit, debouncedSearch])

    // Define columns for the DataTable
    const columns = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'username',
            label: 'Username',
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${value === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : value === 'guru'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleEdit(row)}
                        icon={<Pencil className="w-4 h-4" />}
                        variant="primary"
                        size="sm"
                    />
                    <Button
                        onClick={() => handleDelete(row)}
                        icon={<Trash className="w-4 h-4" />}
                        variant="danger"
                        size="sm"
                    />
                </div>
            )
        }
    ]

    const postUser = async (formData) => {
        try {
            const result = await createUser(formData)
            console.log('User created:', result)
            handleModalClose()
            toast.success('User berhasil ditambahkan')
            // Refresh logic: reset to page 1 to see new data
            setPagination(prev => ({ ...prev, page: 1 }))
            const newUserList = await getUsers({ page: 1, limit: pagination.limit, search: debouncedSearch })
            setUsers(newUserList.data)
            setPagination(newUserList.pagination)
        } catch (error) {
            console.error('Error creating user:', error)
            toast.error(error.message || 'Gagal menambahkan user')
        }
    }

    const putUser = async (id, formData) => {
        try {
            const result = await updateUser(id, formData) // Changed to updateUserAction
            console.log('User updated:', result)
            handleModalClose()
            toast.success('User berhasil diperbarui')
            // Refresh logic
            const newUserList = await getUsers({ page: pagination.page, limit: pagination.limit, search: debouncedSearch })
            setUsers(newUserList.data)
            setPagination(newUserList.pagination)
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error(error.message || 'Gagal memperbarui user')
        }
    }

    const handleEdit = (user) => {
        setUserToEdit(user)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setUserToEdit(null)
    }

    const handleFormSubmit = (formData) => {
        if (userToEdit) {
            putUser(userToEdit.id, formData)
        } else {
            postUser(formData)
        }
    }

    const handleDelete = (user) => {
        setUserToDelete(user)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!userToDelete) return

        try {
            await deleteUser(userToDelete.id)
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
            setPagination(prev => ({ ...prev, total: prev.total - 1 }))
            setIsDeleteModalOpen(false)
            toast.success('User berhasil dihapus')
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Gagal menghapus user')
        }
    }

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 on search
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data User</h1>
                <p className="text-gray-600 dark:text-gray-400">Kelola data pengguna sistem</p>
            </div>

            <DataTable
                data={users}
                columns={columns}
                searchable={true}
                searchPlaceholder="Cari username atau role..."
                headerActions={
                    <Button
                        label="Tambah User"
                        onClick={() => setIsModalOpen(true)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    />
                }
                // Server-side pagination props
                serverSide={true}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                loading={loading}
            />

            {/* Modal Tambah/Edit User */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={userToEdit ? "Edit User" : "Tambah User Baru"}
                size="lg"
            >
                <TambahUser
                    onClose={handleModalClose}
                    onSubmit={handleFormSubmit}
                    initialData={userToEdit}
                    key={userToEdit ? userToEdit.id : 'new'}
                />
            </Modal>

            {/* Modal Confirm Delete */}
            <ModalConfirm
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus User"
                message={`Apakah Anda yakin ingin menghapus user ${userToDelete?.username}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </div>
    )
}