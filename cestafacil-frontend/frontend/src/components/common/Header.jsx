import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const { isAuth, isAdmin, user, logout } = useAuth()
  const { count } = useCart()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/catalogo?termo=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUserOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/',        label: 'Início' },
    { to: '/catalogo', label: 'Catálogo' },
  ]

  return (
    <header className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🛒</span>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-xl tracking-tight">Cesta Fácil</span>
              <span className="text-green-200 text-xs block -mt-1">Cestas Básicas</span>
            </div>
          </Link>

          {/* Busca – desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar cestas..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-600 text-white placeholder-green-200 border border-green-500"
              />
            </div>
          </form>

          {/* Nav + ações – desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to ? 'bg-green-600 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}

            {/* Carrinho */}
            <Link to="/carrinho" className="relative p-2 text-green-100 hover:bg-green-600 rounded-lg transition-colors ml-1">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Usuário */}
            {isAuth ? (
              <div className="relative ml-1">
                <button onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user?.nome?.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                        <Settings className="w-4 h-4" /> Painel Admin
                      </Link>
                    )}
                    <Link to="/pedidos" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50">
                      <Package className="w-4 h-4" /> Meus Pedidos
                    </Link>
                    <Link to="/perfil" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50">
                      <User className="w-4 h-4" /> Meu Perfil
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="text-green-100 hover:text-white text-sm font-medium px-3 py-2">Entrar</Link>
                <Link to="/cadastro" className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: carrinho + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/carrinho" className="relative p-2 text-green-100">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-green-100">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-green-600 mt-2 pt-4 space-y-2">
            <form onSubmit={handleSearch} className="flex gap-2 mb-3">
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar cestas..."
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-green-600 text-white placeholder-green-200 border border-green-500 focus:outline-none" />
              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
            </form>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-green-100 hover:text-white hover:bg-green-600 rounded-lg text-sm font-medium">
                {l.label}
              </Link>
            ))}
            {isAuth ? (
              <>
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-green-100 hover:bg-green-600 rounded-lg text-sm">⚙ Painel Admin</Link>}
                <Link to="/pedidos" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-green-100 hover:bg-green-600 rounded-lg text-sm">📦 Meus Pedidos</Link>
                <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-green-100 hover:bg-green-600 rounded-lg text-sm">👤 Meu Perfil</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-300 hover:bg-green-600 rounded-lg text-sm">🚪 Sair</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-green-100 border border-green-500 rounded-lg text-sm">Entrar</Link>
                <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold">Cadastrar</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fecha dropdown ao clicar fora */}
      {userOpen && <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />}
    </header>
  )
}
