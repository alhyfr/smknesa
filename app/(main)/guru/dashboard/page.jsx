'use client'
import { useUser } from "@/app/context/UserContext"
import PageTransisi from "@/app/components/PageTransisi"
import BlurText from "@/app/components/BlurText"

export default function Dashboard() {
    const { username, role } = useUser() // Ambil data user dari context

    return (
        <PageTransisi>
            <div className="p-6">
                {/* Welcome Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                    <div className="max-w-4xl">
                        <BlurText
                            text={`Welcome back, ${username || 'Guru'}! 👋`}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
                            delay={30}
                            animateBy="words"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Anda login sebagai <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">{role}</span>. Selamat beraktivitas!
                        </p>
                    </div>
                </div>
            </div>
        </PageTransisi>
    )
}