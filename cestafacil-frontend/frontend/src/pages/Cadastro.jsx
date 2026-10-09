import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/UI'
import toast from 'react-hot-toast'

export default function Cadastro() {
  const [form, setForm] = useState({
    nome:'', email:'', senha:'', telefone:'',
    cep:'', logradouro:'', numero:'', complemento:'',
    bairro:'', cidade:'', uf:''
  })
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.senha.length < 6) { toast.error('Senha deve ter pelo menos 6 caracteres.'); return }
    try {
      const data = await register(form)
      toast.success(`Conta criada! Bem-vindo, ${data.nome.split(' ')[0]}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao criar conta.')
    }
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl">🛒</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Criar Conta</h1>
        <p className="text-gray-500 mt-2">Junte-se à Cesta Fácil e receba no conforto da sua casa</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Dados pessoais */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide text-green-700">Dados Pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="label">Nome Completo <span className="text-red-500">*</span></label>
                <input type="text" className="input" required placeholder="Seu nome completo"
                  value={form.nome} onChange={e => set('nome', e.target.value)} />
              </div>

              <div>
                <label className="label">E-mail <span className="text-red-500">*</span></label>
                <input type="email" className="input" required placeholder="seu@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div>
                <label className="label">Telefone</label>
                <input type="text" className="input" placeholder="(13) 99999-9999"
                  value={form.telefone} onChange={e => set('telefone', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="label">Senha <span className="text-red-500">*</span></label>
                <input type="password" className="input" required placeholder="Mínimo 6 caracteres"
                  value={form.senha} onChange={e => set('senha', e.target.value)} />
              </div>

            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide text-green-700">Endereço</h3>
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="label">CEP</label>
                <input type="text" className="input" placeholder="00000-000"
                  value={form.cep} onChange={e => set('cep', e.target.value)} />
              </div>

              <div>
                <label className="label">Número</label>
                <input type="text" className="input" placeholder="123"
                  value={form.numero} onChange={e => set('numero', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="label">Logradouro</label>
                <input type="text" className="input" placeholder="Rua, Avenida..."
                  value={form.logradouro} onChange={e => set('logradouro', e.target.value)} />
              </div>

              <div>
                <label className="label">Complemento</label>
                <input type="text" className="input" placeholder="Apto, Bloco..."
                  value={form.complemento} onChange={e => set('complemento', e.target.value)} />
              </div>

              <div>
                <label className="label">Bairro</label>
                <input type="text" className="input" placeholder="Bairro"
                  value={form.bairro} onChange={e => set('bairro', e.target.value)} />
              </div>

              <div>
                <label className="label">Cidade</label>
                <input type="text" className="input" placeholder="Cidade"
                  value={form.cidade} onChange={e => set('cidade', e.target.value)} />
              </div>

              <div>
                <label className="label">UF</label>
                <input type="text" className="input" placeholder="SP" maxLength={2}
                  value={form.uf} onChange={e => set('uf', e.target.value)} />
              </div>

            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
            {loading ? <><Spinner size="sm" /> Criando conta...</> : '✅ Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
