import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Routes>
            <Route path="/" element={<div className="flex h-screen items-center justify-center text-primary font-display text-4xl font-bold">Bebang Sistem Informasi</div>} />
        </Routes>
    )
}

export default App
