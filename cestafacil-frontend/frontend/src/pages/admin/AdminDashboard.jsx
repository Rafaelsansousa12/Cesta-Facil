import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight } from 'lucide-react'
import { adminAPI } from '../../services/api'
import { PageLoader, StatusBadge } from '../../components/common/UI'

const fmt = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AdminDashboard() {
  const [data,    setData]    = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminAPI.dashboard(),
      adminAPI.pedidos({ page: 0, size: 6 }),
    ]).then(([d, p]) => {
      setData(d.data)
      setPedidos(p.data.content)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8"><PageLoader /></div>

  const cards = [
    { label: 'Vendas Hoje',       value: fmt(data?.vendasHoje),   icon: <TrendingUp className="w-6 h-6" />,  color: 'bg-green-100 text-green-600',  border: 'border-green-200' },
    { label: 'Vendas do Mês',     value: fmt(data?.vendasMes),    icon: <TrendingUp className="w-6 h-6" />,  color: 'bg-blue-100 text-blue-600',    border: 'border-blue-200' },
    { label: 'Pedidos Hoje',      value: data?.pedidosHoje ?? 0,  icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
    { label: 'Estoque Baixo',     value: data?.produtosEstoqueBaixo ?? 0, icon: <Package className="w-6 h-6" />, color: 'bg-red-100 text-red-600', border: 'border-red-200' },
    { label: 'Total de Clientes', value: data?.totalClientes ?? 0, icon: <Users className="w-6 h-6" />,      color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do sistema Cesta Fácil</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm`}>
            <div className={`w-11 h-11 ${c.color} rounded-xl flex items-center justify-center mb-3`}>{c.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Últimos Pedidos</h2>
          <Link to="/admin/pedidos" className="text-sm text-green-700 hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Cliente', 'Total', 'Status', 'Data', 'Ação'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">#{p.id}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[140px] truncate">{p.itens?.[0]?.produtoNome || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">{fmt(p.valorTotal)}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/pedidos`} className="text-green-700 hover:underline text-xs font-medium">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && (
            <div className="text-center py-12 text-gray-400">Nenhum pedido ainda.</div>
          )}
        </div>
      </div>
    </div>
  )
}
