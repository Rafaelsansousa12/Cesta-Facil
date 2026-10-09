import { Loader2 } from 'lucide-react'

export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return <Loader2 className={`animate-spin text-green-600 ${s} ${className}`} />
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm">Carregando...</p>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagto.', cls: 'bg-yellow-100 text-yellow-800' },
    PAGAMENTO_APROVADO:   { label: 'Pagto. Aprovado',   cls: 'bg-blue-100 text-blue-800' },
    EM_PREPARACAO:        { label: 'Em Preparação',     cls: 'bg-orange-100 text-orange-800' },
    EM_TRANSITO:          { label: 'Em Trânsito',       cls: 'bg-purple-100 text-purple-800' },
    ENTREGUE:             { label: 'Entregue',          cls: 'bg-green-100 text-green-800' },
    CANCELADO:            { label: 'Cancelado',         cls: 'bg-red-100 text-red-800' },
  }
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-800' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button disabled={page === 0} onClick={() => onChange(page - 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
        ← Anterior
      </button>
      <span className="px-4 py-2 text-sm text-gray-600">
        Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
      </span>
      <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
        Próxima →
      </button>
    </div>
  )
}
