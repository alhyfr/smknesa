'use client'
import { getBuli, updateBuliStatus } from "@/app/server/Buli"
import { useState, useEffect } from 'react'
import DataTable from '@/app/components/DataTable'
import Modal from "@/app/components/Modal"
import ModalConfirm from "@/app/components/ModalConfim"
import Button from "@/app/components/Button"
import { Trash, Pencil } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import DropDownButton from '@/app/components/DropDownButton'
export default function DataLaporan() {
    const [laporan, setLaporan] = useState([])
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

    const fetchLaporan = async () => {
        setLoading(true)
        try {
            const result = await getBuli({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch
            })
            setLaporan(result.data)
            setPagination(result.pagination)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLaporan()
    }, [pagination.page, pagination.limit, debouncedSearch])

    const columns = [
        {
            key: 'pelapor_nama',
            label: 'Nama Pelapor',
            render: (value, row) => row.is_anon === 1 ? 'Anonim' : value
        },
        {
            key: 'pelapor_peran',
            label: 'Peran',
        },
        {
            key: 'pelapor_kontak',
            label: 'Kontak',
        },
        {
            key: 'korban_nama',
            label: 'Nama Korban',
            render: (_, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{row.korban_nama}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.korban_kelas}</div>
                </div>
            )
        },
        {
            key: 'pelaku_nama',
            label: 'Nama Pelaku',
            render: (_, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{row.pelaku_nama}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.pelaku_kelas}</div>
                </div>
            )
        },
        {
            key: 'jenis_bullying',
            label: 'Jenis Bullying',
        },
        {
            key: 'frekuensi',
            label: 'Frekuensi',
        },
        {
            key: 'tanggal_kejadian_terakhir',
            label: 'Tanggal Kejadian Terakhir',
            render: (value) => value ? new Date(value).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : '-'
        },
        {
            key: 'lokasi_kejadian',
            label: 'Lokasi Kejadian',
        },
        {
            key: 'deskripsi_kejadian',
            label: 'Deskripsi Kejadian',
            render: (value) => (
                <div className="whitespace-pre-wrap min-w-[300px] text-justify">
                    {value}
                </div>
            )
        },
        {
            key: 'dampak_utama',
            label: 'Dampak Utama',
        },
        {
            key: 'harapan_pelapor',
            label: 'Harapan Pelapor',
        },
        {
            key: 'ada_bukti',
            label: 'Ada Bukti',
            render: (value) => value === 1 ? 'ADA' : 'TIDAK ADA'
        },
        {
            key: 'catatan_tambahan',
            label: 'Catatan Tambahan',
            render: (value) => (
                <div className="whitespace-pre-wrap min-w-[300px] text-justify">
                    {value}
                </div>
            )
        },
        {
            key: 'status_laporan',
            label: 'Status Laporan',
            render: (value) => {
                let statusText = value;
                let className = "px-3 py-1 rounded-full text-xs font-medium inline-block";

                if (value === 'baru') {
                    statusText = 'Perlu di Proses';
                    className += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
                } else if (value === 'diproses') {
                    className += " bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
                } else if (value === 'selesai') {
                    className += " bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                } else if (value === 'dibatalkan' || value === 'ditolak') {
                    className += " bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                } else {
                    className += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
                }

                return (
                    <span className={className}>
                        {statusText?.toUpperCase()}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_, row) => (
                <div className="flex gap-2">

                    <DropDownButton
                        items={[
                            {
                                label: 'diproses',
                                onClick: () => handleProses(row, 'diproses')
                            },
                            {
                                label: 'selesai',
                                onClick: () => handleProses(row, 'selesai')
                            },
                            {
                                label: 'dibatalkan',
                                onClick: () => handleProses(row, 'dibatalkan')
                            }
                        ]}
                    />
                </div>
            )
        }
    ]
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 on search
    }
    const handleProses = async (row, status) => {
        try {
            await updateBuliStatus(row.id, status)
            fetchLaporan()
            toast.success(`Laporan berhasil diubah ke ${status}`)
        } catch (error) {
            toast.error('Gagal mengubah laporan')
        }
    }


    return (
        <div>
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data Laporan</h1>
                <p className="text-gray-600 dark:text-gray-400">Kelola data laporan sistem</p>
            </div>

            <DataTable
                data={laporan}
                columns={columns}
                searchable={true}
                searchPlaceholder="Cari laporan..."

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
        </div>
    )
}