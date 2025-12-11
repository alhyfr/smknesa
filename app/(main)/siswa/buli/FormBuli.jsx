'use client'
import { createBuli } from "@/app/server/Buli"
import { useState } from "react"
import Button from "@/app/components/Button"
import { User, Eye, EyeOff, UserX, AlertTriangle, Calendar, MapPin, FileText, CheckCircle, Info } from 'lucide-react'

const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '', icon: Icon }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icon size={18} />
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
            />
        </div>
    </div>
)

const SelectField = ({ label, name, value, onChange, options, required = false, icon: Icon }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icon size={18} />
                </div>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 ${Icon ? 'pl-10' : 'px-4'} pr-8 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer`}
            >
                <option value="" disabled>Pilih {label}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
)

const TextAreaField = ({ label, name, value, onChange, required = false, placeholder = '', rows = 4 }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y"
        />
    </div>
)

const SectionTitle = ({ title, icon: Icon, description }) => (
    <div className="mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="text-blue-600 dark:text-blue-400" size={20} />}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">{description}</p>}
    </div>
)

export default function FormBuli() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        is_anon: false,
        pelapor_nama: '',
        pelapor_peran: 'siswa',
        pelapor_kelas_jabatan: '',
        pelapor_kontak: '',
        korban_nama: '',
        korban_kelas: '',
        pelaku_nama: '',
        pelaku_kelas: '',
        jenis_bullying: '',
        frekuensi: '',
        tanggal_kejadian_terakhir: '',
        lokasi_kejadian: '',
        deskripsi_kejadian: '',
        dampak_utama: '',
        harapan_pelapor: '',
        bersedia_dihubungi: false,
        ada_bukti: false,
        catatan_tambahan: '',
        status_laporan: 'baru'
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const result = await createBuli(formData)
            // Assuming result is a JSON string as per server action
            const parsed = JSON.parse(result)
            if (parsed.affectedRows > 0) {
                setSuccess(true)
                setFormData({
                    is_anon: false,
                    pelapor_nama: '',
                    pelapor_peran: 'siswa',
                    pelapor_kelas_jabatan: '',
                    pelapor_kontak: '',
                    korban_nama: '',
                    korban_kelas: '',
                    pelaku_nama: '',
                    pelaku_kelas: '',
                    jenis_bullying: '',
                    frekuensi: '',
                    tanggal_kejadian_terakhir: '',
                    lokasi_kejadian: '',
                    deskripsi_kejadian: '',
                    dampak_utama: '',
                    harapan_pelapor: '',
                    bersedia_dihubungi: false,
                    ada_bukti: false,
                    catatan_tambahan: '',
                    status_laporan: 'baru'
                })
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setError('Gagal menyimpan laporan. Silakan coba lagi.')
            }
        } catch (err) {
            console.error(err)
            setError('Terjadi kesalahan sistem. Mohon hubungi admin.')
        } finally {
            setLoading(false)
        }
    }

    const jenis_bullying_options = [
        { value: 'fisik', label: 'Fisik (Memukul, menendang, dll)' },
        { value: 'verbal', label: 'Verbal (Mengejek, menghina, dll)' },
        { value: 'sosial', label: 'Sosial (Mengucilkan, menyebar rumor)' },
        { value: 'digital', label: 'Digital / Cyber (Media sosial, chat)' },
        { value: 'lainnya', label: 'Lainnya' },
    ]

    const frekuensi_options = [
        { value: 'sekali', label: 'Baru sekali terjadi' },
        { value: 'beberapa_kali', label: 'Sudah beberapa kali' },
        { value: 'sering', label: 'Sering terjadi / Berulang' },
    ]

    const dampak_utama_options = [
        { value: 'takut', label: 'Merasa takut / cemas' },
        { value: 'sedih', label: 'Sedih / Depresi' },
        { value: 'luka_fisik', label: 'Luka Fisik' },
        { value: 'tidak_mau_sekolah', label: 'Tidak mau sekolah' },
        { value: 'lainnya', label: 'Lainnya' },
    ]

    const harapan_pelapor_options = [
        { value: 'tindak_pelaku', label: 'Tindak tegas pelaku' },
        { value: 'konseling_korban', label: 'Bantuan/Konseling untuk korban' },
        { value: 'mediasi', label: 'Mediasi / Perdamaian' },
        { value: 'hanya_melapor', label: 'Hanya ingin melapor (tanpa tindakan lanjut)' },
        { value: 'lainnya', label: 'Lainnya' },
    ]

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">Lapor Tindak Bullying</h1>
                    <p className="text-blue-100 relative z-10">Kami siap mendengar dan membantu. Identitas Anda aman bersama kami.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-3 border border-green-200 dark:border-green-800">
                            <CheckCircle className="shrink-0" />
                            <div>
                                <h4 className="font-semibold">Laporan Berhasil Dikirim</h4>
                                <p className="text-sm">Terima kasih atas keberanian Anda melapor. Kami akan segera menindaklanjuti laporan ini.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                            <AlertTriangle className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Identitas Pelapor */}
                    <section>
                        <SectionTitle
                            title="Identitas Pelapor"
                            icon={formData.is_anon ? EyeOff : Eye}
                            description="Informasi tentang diri Anda sebagai pelapor."
                        />

                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_anon"
                                        checked={formData.is_anon}
                                        onChange={handleChange}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                    <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-0.5" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-200 font-medium">Laporkan sebagai Anonim (Rahasiakan Identitas Saya)</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-8">Jika dicentang, nama dan kontak Anda akan disembunyikan dari laporan publik, namun kami tetap menyarankan mencantumkan kontak untuk tindak lanjut.</p>
                        </div>

                        {!formData.is_anon && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <InputField
                                    label="Nama Lengkap"
                                    name="pelapor_nama"
                                    value={formData.pelapor_nama}
                                    onChange={handleChange}
                                    required={!formData.is_anon}
                                    icon={User}
                                    placeholder="Nama lengkap Anda"
                                />
                                <InputField
                                    label="Kelas / Jabatan"
                                    name="pelapor_kelas_jabatan"
                                    value={formData.pelapor_kelas_jabatan}
                                    onChange={handleChange}
                                    placeholder="Contoh: X TKJ 1 atau Guru BK"
                                />
                                <InputField
                                    label="Nomor Kontak (WA)"
                                    name="pelapor_kontak"
                                    value={formData.pelapor_kontak}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                />
                                <SelectField
                                    label="Peran Pelapor"
                                    name="pelapor_peran"
                                    value={formData.pelapor_peran}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'siswa', label: 'Siswa' },
                                        { value: 'guru', label: 'Guru' },
                                        { value: 'orang_tua', label: 'Orang Tua' },
                                        { value: 'masyarakat', label: 'Masyarakat' },
                                    ]}
                                />
                            </div>
                        )}

                        {formData.is_anon && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Nomor Kontak (Opsional)"
                                    name="pelapor_kontak"
                                    value={formData.pelapor_kontak}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="08xxxxxxxxxx (Untuk update status laporan)"
                                />
                                <SelectField
                                    label="Peran Pelapor"
                                    name="pelapor_peran"
                                    value={formData.pelapor_peran}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'siswa', label: 'Siswa' },
                                        { value: 'guru', label: 'Guru' },
                                        { value: 'orang_tua', label: 'Orang Tua' },
                                        { value: 'masyarakat', label: 'Masyarakat' },
                                    ]}
                                />
                            </div>
                        )}
                    </section>

                    {/* Data Kejadian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Korban */}
                        <section>
                            <SectionTitle
                                title="Siapa Korbannya?"
                                icon={User}
                            />
                            <div className="space-y-4">
                                <InputField
                                    label="Nama Korban"
                                    name="korban_nama"
                                    value={formData.korban_nama}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nama siswa yang dibully"
                                />
                                <InputField
                                    label="Kelas Korban (Jika tahu)"
                                    name="korban_kelas"
                                    value={formData.korban_kelas}
                                    onChange={handleChange}
                                    placeholder="Contoh: XI RPL 2"
                                />
                            </div>
                        </section>

                        {/* Pelaku */}
                        <section>
                            <SectionTitle
                                title="Siapa Pelakunya?"
                                icon={UserX}
                            />
                            <div className="space-y-4">
                                <InputField
                                    label="Nama Pelaku"
                                    name="pelaku_nama"
                                    value={formData.pelaku_nama}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nama siswa/orang yang membully"
                                />
                                <InputField
                                    label="Kelas Pelaku (Jika tahu)"
                                    name="pelaku_kelas"
                                    value={formData.pelaku_kelas}
                                    onChange={handleChange}
                                    placeholder="Contoh: XII AK 1"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Detail Kejadian */}
                    <section>
                        <SectionTitle
                            title="Detail Kejadian"
                            icon={FileText}
                            description="Ceritakan apa yang terjadi secara jelas."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <SelectField
                                label="Jenis Bullying"
                                name="jenis_bullying"
                                value={formData.jenis_bullying}
                                onChange={handleChange}
                                options={jenis_bullying_options}
                                required
                            />
                            <SelectField
                                label="Seberapa Sering?"
                                name="frekuensi"
                                value={formData.frekuensi}
                                onChange={handleChange}
                                options={frekuensi_options}
                                required
                            />
                            <InputField
                                label="Tanggal Kejadian (Terakhir)"
                                name="tanggal_kejadian_terakhir"
                                value={formData.tanggal_kejadian_terakhir}
                                onChange={handleChange}
                                type="date"
                                required
                                icon={Calendar}
                            />
                            <InputField
                                label="Lokasi Kejadian"
                                name="lokasi_kejadian"
                                value={formData.lokasi_kejadian}
                                onChange={handleChange}
                                placeholder="Contoh: Kantin, Kelas, Parkiran"
                                required
                                icon={MapPin}
                            />
                        </div>

                        <TextAreaField
                            label="Kronologi / Deskripsi Kejadian"
                            name="deskripsi_kejadian"
                            value={formData.deskripsi_kejadian}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Ceritakan urutan kejadiannya..."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                                label="Dampak yang Dirasakan"
                                name="dampak_utama"
                                value={formData.dampak_utama}
                                onChange={handleChange}
                                options={dampak_utama_options}
                                required
                            />
                            <SelectField
                                label="Harapan Tindak Lanjut"
                                name="harapan_pelapor"
                                value={formData.harapan_pelapor}
                                onChange={handleChange}
                                options={harapan_pelapor_options}
                                required
                            />
                        </div>
                    </section>

                    {/* Informasi Tambahan */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <SectionTitle
                            title="Informasi Tambahan"
                            icon={Info}
                        />

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="ada_bukti"
                                            checked={formData.ada_bukti}
                                            onChange={handleChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-0.5" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200">Saya memiliki bukti (Foto/Video/Chat)</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="bersedia_dihubungi"
                                            checked={formData.bersedia_dihubungi}
                                            onChange={handleChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-0.5" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200">Saya bersedia dihubungi untuk klarifikasi</span>
                                </label>
                            </div>

                            <TextAreaField
                                label="Catatan Tambahan (Opsional)"
                                name="catatan_tambahan"
                                value={formData.catatan_tambahan}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Ada hal lain yang perlu kami tahu?"
                            />
                        </div>
                    </section>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-end">
                        <Button
                            label="Kirim Laporan"
                            type="submit"
                            variant="primary"
                            loading={loading}
                            size="lg"
                            className="w-full sm:w-auto shadow-lg shadow-blue-600/20"
                        />
                    </div>
                </form>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
                &copy; {new Date().getFullYear()} SMK Nesa Connect. Anti-Bullying Campaign.
            </p>
        </div>
    )
}