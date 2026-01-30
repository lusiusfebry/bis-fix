

// Simple Card if not exists for now
const StatisticCard = ({ title, value, icon }: { title: string, value: string, icon: string }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatisticCard title="Total Employees" value="150" icon="group" />
                <StatisticCard title="Present Today" value="142" icon="check_circle" />
                <StatisticCard title="On Leave" value="5" icon="event_busy" />
                <StatisticCard title="Remote" value="3" icon="wifi" />
            </div>
        </div>
    );
};

export default DashboardPage;
