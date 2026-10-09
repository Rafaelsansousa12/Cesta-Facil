import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { EmptyState } from '../components/common/UI'

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Carrinho() {
  const { items, subtotal, frete, total, count, removeItem, updateQty, freteGratis } = useCart()
  const { isAuth } = useAuth()
  const navigate   = useNavigate()

  const handleCheckout = () => {
    if (!isAuth) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  if (items.length === 0) return (
    <div className="page-container">
      <h1 className="section-title mb-8">Meu Carrinho</h1>
      <EmptyState icon="🛒" title="Seu carrinho está vazio"
        description="Explore nosso catálogo e adicione cestas básicas ao carrinho."
        action={<Link to="/catalogo" className="btn-primary">Ver Catálogo</Link>} />
    </div>
  )

  const faltaFrete = freteGratis - subtotal

  return (
    <div className="page-container">
      <h1 className="section-title mb-2">Meu Carrinho</h1>
      <p className="text-gray-500 text-sm mb-8">{count} {count === 1 ? 'item' : 'itens'}</p>

      {/* Banner frete grátis */}
      {faltaFrete > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Tag className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-800">
            Adicione mais <strong>{fmt(faltaFrete)}</strong> para ganhar <strong>Frete Grátis</strong>! 🎉
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-green-50 flex-shrink-0">
                {item.imagemUrl ? (
                  <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://placehold.co/80x80/f0fdf4/16a34a?text=🛒' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.nome}</h3>
                <p className="text-green-700 font-bold mt-1">{fmt(item.precoEfetivo)}</p>
                <div className="flex items-center justify-between mt-3">
                  {/* Qty */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors">−</button>
                    <span className="px-3 py-1.5 font-semibold text-gray-900 min-w-[32px] text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{fmt(item.precoEfetivo * item.qty)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/catalogo" className="btn-ghost inline-flex items-center gap-2 text-sm mt-2">
            ← Continuar Comprando
          </Link>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" /> Resumo do Pedido
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count} itens)</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                {frete === 0
                  ? <span className="text-green-600 font-semibold">Grátis 🎉</span>
                  : <span className="font-medium">{fmt(frete)}</span>
                }
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-green-700 text-lg">{fmt(total)}</span>
              </div>
            </div>

            <button onClick={handleCheckout}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-base py-3.5">
              Finalizar Compra <ArrowRight className="w-5 h-5" />
            </button>

            {!isAuth && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Você precisará fazer <Link to="/login" className="text-green-600 underline">login</Link> para continuar.
              </p>
            )}

            <div className="mt-4 pt-4 border-t space-y-1.5">
              {['🔒 Pagamento 100% seguro', '🚚 Entrega em até 3 dias úteis', '✅ Produtos de qualidade'].map((t, i) => (
                <p key={i} className="text-xs text-gray-500 flex items-center gap-1">{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
