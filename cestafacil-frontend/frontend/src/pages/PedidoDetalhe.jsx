import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Package, CreditCard } from 'lucide-react'
import { pedidosAPI } from '../services/api'
import { PageLoader, StatusBadge } from '../components/common/UI'

const fmt  = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtD = d => d ? new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

const TIMELINE = [
  { status: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento', icon: '💳' },
  { status: 'PAGAMENTO_APROVADO',   label: 'Pagamento Aprovado',   icon: '✅' },
  { status: 'EM_PREPARACAO',        label: 'Em Preparação',        icon: '📦' },
  { status: 'EM_TRANSITO',          label: 'Em Trânsito',          icon: '🚚' },
  { status: 'ENTREGUE',             label: 'Entregue',             icon: '🎉' },
]

const STATUS_IDX = { AGUARDANDO_PAGAMENTO:0, PAGAMENTO_APROVADO:1, EM_PREPARACAO:2, EM_TRANSITO:3, ENTREGUE:4, CANCELADO:-1 }

export default function PedidoDetalhe() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pedidosAPI.buscar(id).then(r => setPedido(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><PageLoader /></div>
  if (!pedido) return <div className="page-container text-center py-20"><p>Pedido não encontrado.</p></div>

  const curIdx = STATUS_IDX[pedido.status] ?? 0

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Link to="/pedidos" className="text-green-700 hover:underline text-sm">← Meus Pedidos</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Pedido #{pedido.id}</h1>
        <StatusBadge status={pedido.status} />
      </div>

      {/* Timeline */}
      {pedido.status !== 'CANCELADO' && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-6">Rastreamento do Pedido</h2>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all
                    ${i <= curIdx ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'}`}>
                    {t.icon}
                  </div>
                  <p className={`text-xs mt-2 text-center max-w-[70px] font-medium
                    ${i <= curIdx ? 'text-green-700' : 'text-gray-400'}`}>
                    {t.label}
                  </p>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < curIdx ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          {pedido.entrega?.codigoRastreio && (
            <div className="mt-4 bg-green-50 rounded-lg px-4 py-3 text-sm">
              🚚 Código de rastreio: <strong>{pedido.entrega.codigoRastreio}</strong>
              {pedido.entrega.dataPrevisao && <span className="ml-2 text-gray-500">• Previsão: <strong>{pedido.entrega.dataPrevisao}</strong></span>}
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Itens */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" /> Itens do Pedido
          </h2>
          <div className="space-y-3">
            {pedido.itens?.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-lg bg-green-50 overflow-hidden flex-shrink-0">
                  {item.produtoImagem
                    ? <img src={item.produtoImagem} alt={item.produtoNome} className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://placehold.co/48x48/f0fdf4/16a34a?text=🛒' }} />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🛒</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.produtoNome}</p>
                  <p className="text-xs text-gray-500">{item.quantidade}x {fmt(item.precoUnitario)}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{fmt(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{fmt(pedido.valorSubtotal)}</span></div>
            <div className="flex justify-between text-gray-500">
              <span>Frete</span>
              {pedido.valorFrete === 0 ? <span className="text-green-600">Grátis</span> : <span>{fmt(pedido.valorFrete)}</span>}
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
              <span>Total</span><span className="text-green-700">{fmt(pedido.valorTotal)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Endereço */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" /> Endereço de Entrega
            </h2>
            <p className="text-sm text-gray-700">
              {pedido.logradouroEntrega}, {pedido.numeroEntrega}
              {pedido.complementoEntrega && `, ${pedido.complementoEntrega}`}
            </p>
            <p className="text-sm text-gray-700">{pedido.bairroEntrega} – {pedido.cidadeEntrega}/{pedido.ufEntrega}</p>
            <p className="text-sm text-gray-500">CEP: {pedido.cepEntrega}</p>
          </div>

          {/* Pagamento */}
          {pedido.pagamento && (
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" /> Pagamento
              </h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Forma</span>
                  <span className="font-medium">{pedido.pagamento.forma?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Status</span>
                  <span className={`font-medium ${pedido.pagamento.status === 'APROVADO' ? 'text-green-600' : 'text-red-500'}`}>
                    {pedido.pagamento.status}
                  </span>
                </div>
                {pedido.pagamento.dataPagamento && (
                  <div className="flex justify-between text-gray-600">
                    <span>Data</span><span>{fmtD(pedido.pagamento.dataPagamento)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info pedido */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-800 mb-3">Informações</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Data do Pedido</span><span>{fmtD(pedido.createdAt)}</span>
              </div>
              {pedido.observacao && (
                <div className="mt-2 text-gray-600">
                  <span className="font-medium">Obs:</span> {pedido.observacao}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
