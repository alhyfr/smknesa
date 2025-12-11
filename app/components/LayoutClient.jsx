'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'

export default function LayoutClient({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Header */}
                <Header
                    onMenuToggle={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                />

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
