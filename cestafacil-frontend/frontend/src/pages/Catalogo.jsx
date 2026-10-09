import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { produtosAPI } from '../services/api'
import ProductCard from '../components/common/ProductCard'
import { PageLoader, EmptyState, Pagination } from '../components/common/UI'

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [produtos,    setProdutos]    = useState([])
  const [categorias,  setCategorias]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [totalPages,  setTotalPages]  = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const page        = Number(searchParams.get('page') || 0)
  const categoriaId = searchParams.get('categoriaId') || ''
  const termo       = searchParams.get('termo') || ''
  const sort        = searchParams.get('sort') || 'nome'

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    val ? p.set(key, val) : p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  const fetchProdutos = useCallback(() => {
    setLoading(true)
    const params = { page, size: 12, sort }
    if (termo)       params.termo       = termo
    if (categoriaId) params.categoriaId = categoriaId
    produtosAPI.listar(params)
      .then(r => { setProdutos(r.data.content); setTotalPages(r.data.totalPages) })
      .finally(() => setLoading(false))
  }, [page, categoriaId, termo, sort])

  useEffect(() => { fetchProdutos() }, [fetchProdutos])
  useEffect(() => { produtosAPI.categorias().then(r => setCategorias(r.data)) }, [])

  const catAtual = categorias.find(c => String(c.id) === categoriaId)

  return (
    <div className="page-container">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">
            {termo ? `Resultados para "${termo}"` : catAtual ? catAtual.nome : 'Catálogo de Cestas'}
          </h1>
          <p className="text-gray-500 text-sm">
            {termo && <span className="mr-2">Busca:</span>}
            {catAtual && <span className="text-green-600 font-medium">{catAtual.descricao}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select value={sort} onChange={e => updateParam('sort', e.target.value)}
            className="input w-auto text-sm">
            <option value="nome">Nome A-Z</option>
            <option value="-nome">Nome Z-A</option>
            <option value="preco">Menor Preço</option>
            <option value="-preco">Maior Preço</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2 text-sm sm:hidden">
            <SlidersHorizontal className="w-4 h-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-56 flex-shrink-0`}>
          <div className="card p-4 sticky top-20">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              Categorias
              {categoriaId && (
                <button onClick={() => updateParam('categoriaId', '')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => updateParam('categoriaId', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!categoriaId ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Todas as Categorias
                </button>
              </li>
              {categorias.map(c => (
                <li key={c.id}>
                  <button onClick={() => updateParam('categoriaId', c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${String(c.id) === categoriaId ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {c.nome}
                  </button>
                </li>
              ))}
            </ul>

            {/* Limpar filtros */}
            {(termo || categoriaId) && (
              <button onClick={() => setSearchParams({})}
                className="mt-4 w-full text-center text-xs text-red-500 hover:text-red-700 font-medium">
                ✕ Limpar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Grid produtos */}
        <div className="flex-1 min-w-0">
          {loading ? <PageLoader /> : produtos.length === 0 ? (
            <EmptyState icon="🔍" title="Nenhum produto encontrado"
              description="Tente outros termos ou remova os filtros aplicados." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {produtos.map(p => <ProductCard key={p.id} produto={p} />)}
              </div>
              <Pagination page={page} totalPages={totalPages}
                onChange={p => { const ps = new URLSearchParams(searchParams); ps.set('page', p); setSearchParams(ps) }} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
