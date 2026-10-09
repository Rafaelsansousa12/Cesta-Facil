import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/UI'
import toast from 'react-hot-toast'

export default function Login() {
  const [email,      setEmail]      = useState('')
  const [senha,      setSenha]      = useState('')
  const [showSenha,  setShowSenha]  = useState(false)
  const [erro,       setErro]       = useState('')
  const { login, loading }          = useAuth()
  const navigate                    = useNavigate()
  const [searchParams]              = useSearchParams()
  const redirect                    = searchParams.get('redirect') || '/'

  const handleSubmit = async e => {
    e.preventDefault()
    setErro('')
    try {
      const data = await login(email, senha)
      toast.success(`Bem-vindo, ${data.nome.split(' ')[0]}!`)
      navigate(data.perfil === 'ADMIN' ? '/admin' : redirect, { replace: true })
    } catch (err) {
      const status = err?.response?.status
      if (status === 401) {
        setErro('E-mail ou senha incorretos. Verifique e tente novamente.')
      } else if (!err?.response) {
        setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
      } else {
        setErro('Ocorreu um erro ao fazer login. Tente novamente.')
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🛒</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Entrar</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta Cesta Fácil</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErro('') }}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="input"
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro('') }}
                  placeholder="••••••"
                  required
                  autoComplete="current-password"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro inline */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base"
            >
              {loading ? <><Spinner size="sm" /> Entrando...</> : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-green-700 font-semibold hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
