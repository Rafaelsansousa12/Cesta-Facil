import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🛒</span>
              <span className="text-white font-bold text-xl">Cesta Fácil</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Facilitando o acesso a cestas básicas de qualidade para toda a família de Praia Grande e região.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Início'], ['/catalogo', 'Catálogo'], ['/carrinho', 'Carrinho'], ['/pedidos', 'Meus Pedidos']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Politicas */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Entrega em até 3 dias úteis</li>
              <li>Frete grátis acima de R$ 200</li>
              <li>Pagamento via PIX, Boleto ou Cartão</li>
              <li>Produtos frescos e de qualidade</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>(13) 99999-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>contato@cestafacil.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Praia Grande – SP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2026 Cesta Fácil. Todos os direitos reservados.</p>
          <p className="text-xs text-gray-500">TCC – FATEC Praia Grande – Análise e Desenvolvimento de Sistemas</p>
        </div>
      </div>
    </footer>
  )
}
