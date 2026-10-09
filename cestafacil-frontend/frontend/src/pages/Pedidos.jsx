import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pedidosAPI } from '../services/api'
import { PageLoader, EmptyState, Pagination, StatusBadge } from '../components/common/UI'

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = d => d ? new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

export default function Pedidos() {
  const [pedidos,    setPedidos]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    pedidosAPI.meus({ page, size: 10 })
      .then(r => { setPedidos(r.data.content); setTotalPages(r.data.totalPages) })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">Meus Pedidos</h1>
      {loading ? <PageLoader /> : pedidos.length === 0 ? (
        <EmptyState icon="📦" title="Nenhum pedido ainda"
          description="Você ainda não fez nenhum pedido. Que tal explorar nosso catálogo?"
          action={<Link to="/catalogo" className="btn-primary">Ver Catálogo</Link>} />
      ) : (
        <>
          <div className="space-y-4">
            {pedidos.map(p => (
              <Link key={p.id} to={`/pedidos/${p.id}`}
                className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-gray-900">Pedido #{p.id}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-gray-500">{fmtDate(p.createdAt)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {p.itens?.length} {p.itens?.length === 1 ? 'item' : 'itens'} •{' '}
                    {p.cidadeEntrega}/{p.ufEntrega}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-700">{fmt(p.valorTotal)}</span>
                  <span className="text-gray-400 group-hover:text-green-600 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
