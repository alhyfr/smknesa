'use client'

import { useState, useMemo } from 'react'

export default function DataTable({
    data = [],
    columns = [],
    itemsPerPage = 10,
    searchable = true,
    searchPlaceholder = "Cari...",
    // Server-side pagination props
    serverSide = false,
    currentPage: externalCurrentPage,
    totalPages: externalTotalPages,
    totalItems: externalTotalItems,
    onPageChange,
    onSearch: externalOnSearch,
    loading = false,
    // Custom header actions (e.g., Add button)
    headerActions
}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    // Use external or internal state based on serverSide prop
    const activePage = serverSide ? externalCurrentPage : currentPage
    const activeSearch = serverSide ? searchQuery : searchQuery

    // Filter data based on search query (only for client-side)
    const filteredData = useMemo(() => {
        if (serverSide) return data // Server handles filtering

        if (!searchQuery) return data

        return data.filter(row => {
            return columns.some(column => {
                const value = row[column.key]
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            })
        })
    }, [data, searchQuery, columns, serverSide])

    // Pagination (client-side or server-side)
    const totalPages = serverSide ? externalTotalPages : Math.ceil(filteredData.length / itemsPerPage)
    const totalItems = serverSide ? externalTotalItems : filteredData.length

    const startIndex = (activePage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = serverSide ? data : filteredData.slice(startIndex, endIndex)

    // Handle search
    const handleSearch = (value) => {
        setSearchQuery(value)
        if (serverSide && externalOnSearch) {
            externalOnSearch(value)
        } else {
            setCurrentPage(1)
        }
    }

    // Handle page change
    const handlePageChange = (newPage) => {
        if (serverSide && onPageChange) {
            onPageChange(newPage)
        } else {
            setCurrentPage(newPage)
        }
    }

    return (
        <div className="w-full">
            {/* Search Bar and Header Actions */}
            {(searchable || headerActions) && (
                <div className="mb-4 flex items-center justify-between gap-4">
                    {searchable && (
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )}
                    {headerActions && (
                        <div className="flex items-center gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            {column.render
                                                ? column.render(row[column.key], row, rowIndex)
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    {searchQuery ? 'Tidak ada data yang ditemukan' : 'Tidak ada data'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} data
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(activePage - 1, 1))}
                            disabled={activePage === 1}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sebelumnya
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    // Show first page, last page, current page, and pages around current
                                    return page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - activePage) <= 1
                                })
                                .map((page, index, array) => {
                                    // Add ellipsis if there's a gap
                                    const showEllipsis = index > 0 && page - array[index - 1] > 1
                                    return (
                                        <div key={page} className="flex items-center gap-1">
                                            {showEllipsis && <span className="px-2">...</span>}
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`px - 4 py - 2 rounded - lg transition - colors ${activePage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    } `}
                                            >
                                                {page}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                        <button
                            onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
                            disabled={activePage === totalPages}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
