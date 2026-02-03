
import { useNavigate } from 'react-router-dom';
import UserProfileDropdown from '../auth/UserProfileDropdown';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    return (
        <header className="h-20 border-b border-[#e7ebf3] dark:border-[#2a3447] bg-white dark:bg-[#161e2e] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 shadow-sm/5">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">Profil Karyawan</h2>
                <nav className="hidden lg:flex items-center gap-8 ml-10">
                    <a className="text-[13px] font-bold text-[#4c669a] hover:text-primary transition-all uppercase tracking-widest" href="#">Direktori</a>
                    <a className="text-[13px] font-bold text-[#4c669a] hover:text-primary transition-all uppercase tracking-widest" href="#">Organisasi</a>
                </nav>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative hidden xl:block">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl opacity-60">search</span>
                    <input
                        className="bg-[#f6f6f8] dark:bg-[#2a3447] border border-[#e7ebf3] dark:border-[#374151] rounded-xl pl-12 pr-4 py-2.5 text-sm w-72 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-medium"
                        placeholder="Cari karyawan, departemen, atau NIK..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/welcome')}
                        className="p-2.5 bg-[#f6f6f8] dark:bg-[#2a3447] border border-[#e7ebf3] dark:border-[#374151] rounded-xl text-[#4c669a] dark:text-[#f8f9fc] hover:bg-white hover:border-primary/30 hover:text-primary transition-all shadow-sm group"
                        title="Kembali ke Menu Utama"
                    >
                        <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">apps</span>
                    </button>
                    <button className="p-2.5 bg-[#f6f6f8] dark:bg-[#2a3447] border border-[#e7ebf3] dark:border-[#374151] rounded-xl text-[#4c669a] dark:text-[#f8f9fc] hover:bg-white hover:border-primary/30 hover:text-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <button className="p-2.5 bg-[#f6f6f8] dark:bg-[#2a3447] border border-[#e7ebf3] dark:border-[#374151] rounded-xl text-[#4c669a] dark:text-[#f8f9fc] hover:bg-white hover:border-primary/30 hover:text-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-xl">settings</span>
                    </button>
                </div>
                <div className="h-10 w-[1px] bg-[#e7ebf3] dark:bg-[#2a3447] mx-2"></div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-extrabold text-[#0d121b] dark:text-white leading-none">
                            {user?.employee?.nama_lengkap || user?.nik || 'User'}
                        </span>
                        <span className="text-[11px] font-bold text-[#4c669a] dark:text-gray-400 mt-1 uppercase tracking-wider">
                            {user?.roleDetails?.display_name || user?.roleDetails?.name || 'Administrator'}
                        </span>
                    </div>
                    <UserProfileDropdown />
                </div>
            </div>
        </header>
    );
};

export default Header;
