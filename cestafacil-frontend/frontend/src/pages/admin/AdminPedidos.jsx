import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { PageLoader, StatusBadge, Pagination } from '../../components/common/UI'
import toast from 'react-hot-toast'

const fmt  = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtD = d => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

const STATUS_OPTIONS = [
  'AGUARDANDO_PAGAMENTO','PAGAMENTO_APROVADO','EM_PREPARACAO','EM_TRANSITO','ENTREGUE','CANCELADO'
]
const STATUS_LABELS = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagto.', PAGAMENTO_APROVADO: 'Pagto. Aprovado',
  EM_PREPARACAO: 'Em Preparação', EM_TRANSITO: 'Em Trânsito',
  ENTREGUE: 'Entregue', CANCELADO: 'Cancelado',
}

export default function AdminPedidos() {
  const [pedidos,    setPedidos]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [expanded,   setExpanded]   = useState(null)
  const [updating,   setUpdating]   = useState(null)

  const load = (p = page) => {
    setLoading(true)
    adminAPI.pedidos({ page: p, size: 15 })
      .then(r => { setPedidos(r.data.content); setTotalPages(r.data.totalPages) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await adminAPI.atualizarStatus(id, status)
      toast.success('Status atualizado!')
      load()
    } catch { toast.error('Erro ao atualizar status.') }
    finally { setUpdating(null) }
  }

  if (loading) return <div className="p-8"><PageLoader /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie todos os pedidos</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Data', 'Cliente', 'Itens', 'Total', 'Pagamento', 'Status', 'Atualizar', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map(p => (
                <>
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">#{p.id}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmtD(p.createdAt)}</td>
                    <td className="px-5 py-4 text-gray-600 max-w-[120px] truncate">
                      {p.cidadeEntrega}/{p.ufEntrega}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.itens?.length ?? 0} item(s)</td>
                    <td className="px-5 py-4 font-bold text-green-700">{fmt(p.valorTotal)}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{p.pagamento?.forma?.replace('_',' ') || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
                      <select
                        value={p.status}
                        onChange={e => handleStatus(p.id, e.target.value)}
                        disabled={updating === p.id}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                        className="text-xs text-green-700 hover:underline font-medium">
                        {expanded === p.id ? 'Fechar' : 'Detalhes'}
                      </button>
                    </td>
                  </tr>
                  {/* Expandido */}
                  {expanded === p.id && (
                    <tr key={`${p.id}-exp`}>
                      <td colSpan={9} className="bg-green-50 px-6 py-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold text-gray-700 mb-2">Itens do Pedido:</p>
                            <ul className="space-y-1">
                              {p.itens?.map(i => (
                                <li key={i.id} className="text-gray-600">
                                  {i.quantidade}x {i.produtoNome} — <strong>{fmt(i.subtotal)}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 mb-2">Entrega:</p>
                            <p className="text-gray-600">{p.logradouroEntrega}, {p.numeroEntrega}</p>
                            <p className="text-gray-600">{p.bairroEntrega} – {p.cidadeEntrega}/{p.ufEntrega}</p>
                            <p className="text-gray-500 text-xs mt-1">CEP: {p.cepEntrega}</p>
                            {p.entrega?.codigoRastreio && (
                              <p className="text-green-700 text-xs mt-1 font-medium">
                                Rastreio: {p.entrega.codigoRastreio}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && <div className="text-center py-12 text-gray-400">Nenhum pedido encontrado.</div>}
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
