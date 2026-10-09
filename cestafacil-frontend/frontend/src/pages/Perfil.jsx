import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/UI'
import toast from 'react-hot-toast'

export default function Perfil() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    nome:'', email:'', senha:'', telefone:'',
    cep:'', logradouro:'', numero:'', complemento:'',
    bairro:'', cidade:'', uf:''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    authAPI.me().then(r => {
      const d = r.data
      setForm({
        nome: d.nome||'', email: d.email||'', senha:'',
        telefone: d.telefone||'', cep: d.cep||'',
        logradouro: d.logradouro||'', numero: d.numero||'',
        complemento: d.complemento||'', bairro: d.bairro||'',
        cidade: d.cidade||'', uf: d.uf||''
      })
    })
  }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.update(form)
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="section-title mb-8">Meu Perfil</h1>
      <div className="card p-8">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
            {user?.nome?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user?.nome}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="badge bg-green-100 text-green-700 mt-1">{user?.perfil}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Dados pessoais */}
          <div>
            <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">Dados Pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="label">Nome Completo <span className="text-red-500">*</span></label>
                <input type="text" className="input" required placeholder="Seu nome"
                  value={form.nome} onChange={e => set('nome', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="label">E-mail <span className="text-red-500">*</span></label>
                <input type="email" className="input" required placeholder="email@exemplo.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="label">Nova Senha <span className="text-gray-400 font-normal">(deixe vazio para manter)</span></label>
                <input type="password" className="input" placeholder="••••••"
                  value={form.senha} onChange={e => set('senha', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="label">Telefone</label>
                <input type="text" className="input" placeholder="(13) 99999-9999"
                  value={form.telefone} onChange={e => set('telefone', e.target.value)} />
              </div>

            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">Endereço</h3>
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
                <input type="text" className="input" placeholder="Rua, Av..."
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
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
            {loading ? <><Spinner size="sm" /> Salvando...</> : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
