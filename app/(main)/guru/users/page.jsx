
import PageTransisi from "@/app/components/PageTransisi"
import DataUser from "./DataUser"

export default function UsersPage() {
    return (
        <PageTransisi>
            <div className="container mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <DataUser />
            </div>
        </PageTransisi>
    )
}