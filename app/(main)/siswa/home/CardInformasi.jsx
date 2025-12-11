'use client'
import { UserCheck, AlertCircle, ClipboardList, GraduationCap, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({ title, value, label, icon: Icon, color, trend, trendValue }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
                    {label && <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className={`flex items-center gap-1 font-medium ${trend === 'up' ? 'text-green-600' :
                            trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {trend === 'up' && <TrendingUp size={16} />}
                        {trend === 'down' && <TrendingDown size={16} />}
                        {trend === 'neutral' && <Minus size={16} />}
                        {trendValue}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">vs bulan lalu</span>
                </div>
            )}
        </div>
    )
}

export default function CardInformasi() {
    const stats = [
        {
            title: "Kehadiran",
            value: "95%",
            label: "Total pertemuan: 120",
            icon: UserCheck,
            color: "blue",
            trend: "up",
            trendValue: "+2.5%"
        },
        {
            title: "Poin Pelanggaran",
            value: "0",
            label: "Siswa Teladan",
            icon: AlertCircle,
            color: "green",
            trend: "neutral",
            trendValue: "Tetap"
        },
        {
            title: "Tugas Pending",
            value: "3",
            label: "Perlu diselesaikan",
            icon: ClipboardList,
            color: "orange",
            trend: "down",
            trendValue: "-1 Tugas" // Berkurang artinya bagus
        },
        {
            title: "Rata-rata Nilai",
            value: "88.5",
            label: "Predikat: A-",
            icon: GraduationCap,
            color: "purple",
            trend: "up",
            trendValue: "+1.2 Poin"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    )
}