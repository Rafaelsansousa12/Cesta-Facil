import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Header    from './components/common/Header'
import Footer    from './components/common/Footer'
import Home      from './pages/Home'
import Catalogo  from './pages/Catalogo'
import Produto   from './pages/Produto'
import Carrinho  from './pages/Carrinho'
import Checkout  from './pages/Checkout'
import Login     from './pages/Login'
import Cadastro  from './pages/Cadastro'
import Pedidos   from './pages/Pedidos'
import PedidoDetalhe from './pages/PedidoDetalhe'
import Perfil    from './pages/Perfil'

// Admin
import AdminLayout       from './pages/admin/AdminLayout'
import AdminDashboard    from './pages/admin/AdminDashboard'
import AdminProdutos     from './pages/admin/AdminProdutos'
import AdminPedidos      from './pages/admin/AdminPedidos'

function PrivateRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAuth, isAdmin } = useAuth()
  if (!isAuth)  return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', fontWeight: '500' },
            success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
            error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
          }} />

          <Routes>
            {/* Públicas */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/catalogo" element={<PublicLayout><Catalogo /></PublicLayout>} />
            <Route path="/produto/:id" element={<PublicLayout><Produto /></PublicLayout>} />
            <Route path="/carrinho" element={<PublicLayout><Carrinho /></PublicLayout>} />
            <Route path="/login"   element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/cadastro" element={<PublicLayout><Cadastro /></PublicLayout>} />

            {/* Autenticadas */}
            <Route path="/checkout" element={<PrivateRoute><PublicLayout><Checkout /></PublicLayout></PrivateRoute>} />
            <Route path="/pedidos"  element={<PrivateRoute><PublicLayout><Pedidos /></PublicLayout></PrivateRoute>} />
            <Route path="/pedidos/:id" element={<PrivateRoute><PublicLayout><PedidoDetalhe /></PublicLayout></PrivateRoute>} />
            <Route path="/perfil"   element={<PrivateRoute><PublicLayout><Perfil /></PublicLayout></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index      element={<AdminDashboard />} />
              <Route path="produtos" element={<AdminProdutos />} />
              <Route path="pedidos"  element={<AdminPedidos />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
