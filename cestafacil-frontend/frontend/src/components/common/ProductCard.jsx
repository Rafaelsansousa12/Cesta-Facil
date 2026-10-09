import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductCard({ produto }) {
  const { addItem } = useCart()

  const handleAdd = e => {
    e.preventDefault()
    addItem({
      id: produto.id,
      nome: produto.nome,
      precoEfetivo: produto.precoEfetivo,
      imagemUrl: produto.imagemUrl,
    })
    toast.success(`${produto.nome} adicionado ao carrinho!`)
  }

  const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.preco

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Imagem */}
      <Link to={`/produto/${produto.id}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] bg-green-50 overflow-hidden">
          {produto.imagemUrl ? (
            <img src={produto.imagemUrl} alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.target.src = 'https://placehold.co/400x300/f0fdf4/16a34a?text=🛒' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🛒</div>
          )}
        </div>
        {temPromocao && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMOÇÃO
          </span>
        )}
        {produto.estoque <= 3 && produto.estoque > 0 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Últimas {produto.estoque}!
          </span>
        )}
        {produto.estoque === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm">Esgotado</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
          {produto.categoriaNome || 'Cesta'}
        </span>
        <Link to={`/produto/${produto.id}`}>
          <h3 className="font-bold text-gray-900 mt-1 mb-2 leading-tight hover:text-green-700 transition-colors line-clamp-2">
            {produto.nome}
          </h3>
        </Link>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-green-700">{fmt(produto.precoEfetivo)}</span>
          {temPromocao && (
            <span className="text-sm text-gray-400 line-through">{fmt(produto.preco)}</span>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <button onClick={handleAdd} disabled={produto.estoque === 0}
            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2">
            <ShoppingCart className="w-4 h-4" />
            {produto.estoque === 0 ? 'Esgotado' : 'Adicionar'}
          </button>
          <Link to={`/produto/${produto.id}`}
            className="p-2 border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
