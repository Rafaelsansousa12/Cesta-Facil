import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, FileText, QrCode } from 'lucide-react'
import { pedidosAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/UI'
import toast from 'react-hot-toast'

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const STEPS = ['Endereço', 'Pagamento', 'Confirmação']

export default function Checkout() {
  const { items, subtotal, frete, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [pedido,  setPedido]  = useState(null)

  const [endereco, setEndereco] = useState({
    cep: user?.cep || '', logradouro: user?.logradouro || '',
    numero: user?.numero || '', complemento: user?.complemento || '',
    bairro: user?.bairro || '', cidade: user?.cidade || '', uf: user?.uf || '',
  })
  const [formaPagamento, setFormaPagamento] = useState('PIX')

  const endOk = endereco.cep && endereco.logradouro && endereco.numero && endereco.bairro && endereco.cidade && endereco.uf

  const handleFinalizar = async () => {
    setLoading(true)
    try {
      const payload = {
        itens: items.map(i => ({ produtoId: i.id, quantidade: i.qty })),
        endereco,
        formaPagamento,
      }
      const { data } = await pedidosAPI.criar(payload)
      setPedido(data)
      clearCart()
      setStep(2)
    } catch (err) {
      const msg = err.response?.data?.mensagem || 'Erro ao finalizar pedido. Tente novamente.'
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally { setLoading(false) }
  }

  const formas = [
    { id: 'PIX',            icon: <QrCode className="w-5 h-5" />,        label: 'PIX',             desc: 'Aprovação imediata' },
    { id: 'BOLETO',         icon: <FileText className="w-5 h-5" />,      label: 'Boleto Bancário', desc: 'Vence em 3 dias úteis' },
    { id: 'CARTAO_CREDITO', icon: <CreditCard className="w-5 h-5" />,   label: 'Cartão de Crédito', desc: 'Aprovação imediata' },
  ]

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="section-title mb-8 text-center">Finalizar Compra</h1>

      {/* Steps */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-all
              ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i === step ? 'text-green-700' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-3 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Endereço */}
      {step === 0 && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">📍 Endereço de Entrega</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'cep', label: 'CEP', placeholder: '00000-000', col: 1 },
              { key: 'logradouro', label: 'Logradouro', placeholder: 'Rua, Av...', col: 2 },
              { key: 'numero', label: 'Número', placeholder: '123', col: 1 },
              { key: 'complemento', label: 'Complemento', placeholder: 'Apto, Bloco...', col: 1 },
              { key: 'bairro', label: 'Bairro', placeholder: 'Bairro', col: 2 },
              { key: 'cidade', label: 'Cidade', placeholder: 'Cidade', col: 1 },
              { key: 'uf', label: 'UF', placeholder: 'SP', col: 1 },
            ].map(f => (
              <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                <label className="label">{f.label}{f.key !== 'complemento' && <span className="text-red-500 ml-0.5">*</span>}</label>
                <input type="text" value={endereco[f.key]}
                  onChange={e => setEndereco(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  maxLength={f.key === 'uf' ? 2 : undefined}
                  className="input" />
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} disabled={!endOk}
            className="btn-primary w-full mt-6 py-3.5">
            Continuar para Pagamento →
          </button>
        </div>
      )}

      {/* Step 1: Pagamento */}
      {step === 1 && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">💳 Forma de Pagamento</h2>
          <div className="space-y-3 mb-6">
            {formas.map(f => (
              <label key={f.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${formaPagamento === f.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="pagamento" value={f.id} checked={formaPagamento === f.id}
                  onChange={() => setFormaPagamento(f.id)} className="sr-only" />
                <div className={`${formaPagamento === f.id ? 'text-green-600' : 'text-gray-400'}`}>{f.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${formaPagamento === f.id ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                  {formaPagamento === f.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600">
              <span>Frete</span>
              {frete === 0 ? <span className="text-green-600 font-semibold">Grátis</span> : <span>{fmt(frete)}</span>}
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
              <span>Total</span><span className="text-green-700">{fmt(total)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-ghost px-6 py-3 border border-gray-300">← Voltar</button>
            <button onClick={handleFinalizar} disabled={loading}
              className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Processando...</> : '✅ Confirmar Pedido'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmação */}
      {step === 2 && pedido && (
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pedido Confirmado! 🎉</h2>
          <p className="text-gray-500 mb-6">
            Seu pedido <strong className="text-green-700">#{pedido.id}</strong> foi recebido com sucesso!
          </p>
          <div className="bg-green-50 rounded-xl p-5 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Pedido</span><strong>#{pedido.id}</strong></div>
            <div className="flex justify-between"><span className="text-gray-600">Total</span><strong className="text-green-700">{fmt(pedido.valorTotal)}</strong></div>
            <div className="flex justify-between"><span className="text-gray-600">Rastreio</span><strong>{pedido.entrega?.codigoRastreio}</strong></div>
            <div className="flex justify-between"><span className="text-gray-600">Previsão</span><strong>{pedido.entrega?.dataPrevisao}</strong></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate(`/pedidos/${pedido.id}`)} className="btn-primary flex-1 py-3">
              Acompanhar Pedido
            </button>
            <button onClick={() => navigate('/catalogo')} className="btn-outline flex-1 py-3">
              Continuar Comprando
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
