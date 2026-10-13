import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Clock, Star } from 'lucide-react'
import { produtosAPI } from '../services/api'
import ProductCard from '../components/common/ProductCard'
import { PageLoader } from '../components/common/UI'

export default function Home() {
  const [produtos,    setProdutos]    = useState([])
  const [categorias,  setCategorias]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const navigate = useNavigate()

 useEffect(() => {
  Promise.all([
    produtosAPI.listar({ size: 4, sort: 'id', page: 0 }),
    produtosAPI.categorias(),
  ]).then(([p, c]) => {
    setProdutos(p.data?.content || [])
    setCategorias(Array.isArray(c.data) ? c.data : c.data?.content || [])
  }).catch(() => {
    setProdutos([])
    setCategorias([])
  }).finally(() => setLoading(false))
}, [])

  const diferenciais = [
    { icon: <Truck className="w-6 h-6" />,       title: 'Entrega Rápida',     desc: 'Receba em até 3 dias úteis em Praia Grande e região.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Compra Segura',      desc: 'Pagamento criptografado. Seus dados protegidos.' },
    { icon: <Clock className="w-6 h-6" />,       title: '24h por Dia',        desc: 'Faça seu pedido a qualquer hora, no conforto de casa.' },
    { icon: <Star className="w-6 h-6" />,        title: 'Qualidade Garantida', desc: 'Produtos selecionados de marcas reconhecidas.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                🎉 Frete grátis acima de R$ 200
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
                Cestas Básicas<br />
                <span className="text-orange-400">de Qualidade</span><br />
                na sua Porta
              </h1>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                Monte ou escolha sua cesta básica e receba em casa. Produtos selecionados,
                preços justos e entrega rápida em toda Praia Grande.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogo" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3.5">
                  Ver Catálogo <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/cadastro" className="btn-outline border-white text-white hover:bg-white hover:text-green-700 flex items-center justify-center gap-2 text-base px-8 py-3.5">
                  Cadastre-se Grátis
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-[180px] leading-none select-none filter drop-shadow-2xl">🛒</div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((d, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  {d.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{d.title}</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      {categorias.length > 0 && (
        <section className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Categorias</h2>
              <p className="text-gray-500 text-sm">Encontre a cesta ideal para você</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categorias.map(cat => {
              const emojis = { 'Econômica': '💚', 'Familiar': '👨‍👩‍👧‍👦', 'Gourmet': '⭐', 'Bebê': '👶', 'Especial': '🎁' }
              return (
                <Link key={cat.id} to={`/catalogo?categoriaId=${cat.id}`}
                  className="card p-5 text-center hover:border-green-500 hover:shadow-md transition-all duration-200 border-2 border-transparent group">
                  <div className="text-3xl mb-2">{emojis[cat.nome] || '🛒'}</div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-green-700">{cat.nome}</p>
                  <p className="text-xs text-gray-400 mt-1 hidden sm:block line-clamp-2">{cat.descricao}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Produtos em destaque */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Produtos em Destaque</h2>
            <p className="text-gray-500 text-sm">As cestas mais vendidas</p>
          </div>
          <Link to="/catalogo" className="text-green-700 hover:text-green-800 text-sm font-semibold flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? <PageLoader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map(p => <ProductCard key={p.id} produto={p} />)}
          </div>
        )}
      </section>

      {/* Banner CTA */}
      <section className="bg-orange-500 text-white my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Frete Grátis acima de R$ 200 🎉</h2>
          <p className="text-orange-100 mb-6 text-lg">Monte seu pedido e economize na entrega!</p>
          <Link to="/catalogo" className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
            Montar Minha Cesta <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
