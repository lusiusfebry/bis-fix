

const Header = () => {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-primary">Bebang SI</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
