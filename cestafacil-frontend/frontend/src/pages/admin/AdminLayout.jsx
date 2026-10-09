import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menu = [
  { to: '/admin',          label: 'Dashboard',  icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
  { to: '/admin/produtos', label: 'Produtos',   icon: <Package className="w-5 h-5" /> },
  { to: '/admin/pedidos',  label: 'Pedidos',    icon: <ShoppingBag className="w-5 h-5" /> },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🛒</span>
            <span className="font-bold text-lg">Cesta Fácil</span>
          </div>
          <span className="text-xs text-gray-400 bg-green-800 px-2 py-0.5 rounded">Admin</span>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.nome?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.nome}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menu.map(m => (
            <Link key={m.to} to={m.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(m.to, m.exact) ? 'bg-green-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              {m.icon} {m.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Home className="w-5 h-5" /> Ver Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition-all">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
