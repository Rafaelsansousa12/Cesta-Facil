import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package, CheckCircle } from 'lucide-react'
import { produtosAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { PageLoader } from '../components/common/UI'
import toast from 'react-hot-toast'

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Produto() {
  const { id } = useParams()
  const [produto,  setProduto]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [qty,      setQty]      = useState(1)
  const { addItem, items } = useCart()

  useEffect(() => {
    setLoading(true)
    produtosAPI.buscar(id)
      .then(r => setProduto(r.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><PageLoader /></div>
  if (!produto) return (
    <div className="page-container text-center py-20">
      <p className="text-gray-500 text-lg">Produto não encontrado.</p>
      <Link to="/catalogo" className="btn-primary mt-4 inline-flex">Voltar ao Catálogo</Link>
    </div>
  )

  const noCarrinho   = items.find(i => i.id === produto.id)?.qty || 0
  const temPromocao  = produto.precoPromocional && produto.precoPromocional < produto.preco
  const composicao   = produto.composicao?.split(',').map(s => s.trim()).filter(Boolean) || []

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: produto.id, nome: produto.nome, precoEfetivo: produto.precoEfetivo, imagemUrl: produto.imagemUrl })
    }
    toast.success(`${qty}x ${produto.nome} adicionado!`)
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-700">Início</Link>
        <span>/</span>
        <Link to="/catalogo" className="hover:text-green-700">Catálogo</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{produto.nome}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Imagem */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-green-50 shadow-sm">
            {produto.imagemUrl ? (
              <img src={produto.imagemUrl} alt={produto.nome}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://placehold.co/600x600/f0fdf4/16a34a?text=🛒' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🛒</div>
            )}
          </div>
          {temPromocao && (
            <span className="absolute top-4 left-4 bg-orange-500 text-white font-bold px-3 py-1.5 rounded-full text-sm">
              PROMOÇÃO
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {produto.categoriaNome && (
            <span className="text-green-600 text-sm font-semibold uppercase tracking-wide">
              {produto.categoriaNome}
            </span>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">{produto.nome}</h1>

          {/* Preço */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-green-700">{fmt(produto.precoEfetivo)}</span>
            {temPromocao && (
              <span className="text-xl text-gray-400 line-through">{fmt(produto.preco)}</span>
            )}
          </div>

          {produto.descricao && (
            <p className="text-gray-600 leading-relaxed mb-6">{produto.descricao}</p>
          )}

          {/* Estoque */}
          <div className={`flex items-center gap-2 mb-6 text-sm font-medium ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <Package className="w-4 h-4" />
            {produto.estoque > 0 ? `${produto.estoque} unidades em estoque` : 'Produto esgotado'}
          </div>

          {/* Qty + Add */}
          {produto.estoque > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors">−</button>
                <span className="px-5 py-3 font-bold text-gray-900 text-lg min-w-[50px] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(produto.estoque, q + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors">+</button>
              </div>
              <button onClick={handleAdd}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-base py-3.5">
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
            </div>
          )}

          {noCarrinho > 0 && (
            <div className="flex items-center gap-2 text-green-600 text-sm mb-4 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              Você já tem {noCarrinho} unidade(s) no carrinho
              <Link to="/carrinho" className="underline font-medium ml-auto">Ver carrinho</Link>
            </div>
          )}

          {/* Frete */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
            🚚 <strong>Frete Grátis</strong> para compras acima de R$ 200,00
          </div>
        </div>
      </div>

      {/* Composição */}
      {composicao.length > 0 && (
        <div className="mt-12 card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">📦 Composição da Cesta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {composicao.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to="/catalogo" className="btn-ghost inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
      </div>
    </div>
  )
}
