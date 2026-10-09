import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { adminAPI, produtosAPI } from '../../services/api'
import { Spinner, PageLoader } from '../../components/common/UI'
import toast from 'react-hot-toast'

const fmt = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const EMPTY = { nome:'', descricao:'', composicao:'', preco:'', precoPromocional:'', imagemUrl:'', estoque:0, categoriaId:'' }

export default function AdminProdutos() {
  const [produtos,   setProdutos]   = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState(null) // null = novo
  const [form,       setForm]       = useState(EMPTY)

  const load = () => {
    setLoading(true)
    Promise.all([
      produtosAPI.listar({ size: 50, page: 0 }),
      produtosAPI.categorias(),
    ]).then(([p, c]) => { setProdutos(p.data.content); setCategorias(c.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = p => {
    setEditing(p)
    setForm({ nome: p.nome, descricao: p.descricao||'', composicao: p.composicao||'',
      preco: p.preco, precoPromocional: p.precoPromocional||'', imagemUrl: p.imagemUrl||'',
      estoque: p.estoque, categoriaId: p.categoriaId||'' })
    setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY) }
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, preco: Number(form.preco), estoque: Number(form.estoque),
        precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : null,
        categoriaId: form.categoriaId ? Number(form.categoriaId) : null }
      if (editing) await adminAPI.editarProduto(editing.id, payload)
      else         await adminAPI.criarProduto(payload)
      toast.success(editing ? 'Produto atualizado!' : 'Produto criado!')
      closeModal(); load()
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao salvar produto.')
    } finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Desativar este produto?')) return
    try { await adminAPI.deletarProduto(id); toast.success('Produto desativado!'); load() }
    catch { toast.error('Erro ao desativar produto.') }
  }

  if (loading) return <div className="p-8"><PageLoader /></div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">{produtos.length} produtos cadastrados</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Produto', 'Categoria', 'Preço', 'Estoque', 'Status', 'Ações'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produtos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 overflow-hidden flex-shrink-0">
                        {p.imagemUrl
                          ? <img src={p.imagemUrl} alt={p.nome} className="w-full h-full object-cover"
                              onError={e => { e.target.src='https://placehold.co/40x40/f0fdf4/16a34a?text=🛒' }} />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>}
                      </div>
                      <span className="font-semibold text-gray-900 max-w-[180px] truncate">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.categoriaNome || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-700">{fmt(p.precoEfetivo)}</span>
                    {p.precoPromocional && <span className="text-xs text-gray-400 line-through ml-1">{fmt(p.preco)}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${p.estoque <= 0 ? 'bg-red-100 text-red-700' : p.estoque <= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.estoque} un.
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="label">Nome <span className="text-red-500">*</span></label>
                <input className="input" required value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do produto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Preço (R$) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" min="0.01" className="input" required value={form.preco} onChange={e => set('preco', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="label">Preço Promocional (R$)</label>
                  <input type="number" step="0.01" min="0" className="input" value={form.precoPromocional} onChange={e => set('precoPromocional', e.target.value)} placeholder="Opcional" />
                </div>
                <div>
                  <label className="label">Estoque <span className="text-red-500">*</span></label>
                  <input type="number" min="0" className="input" required value={form.estoque} onChange={e => set('estoque', e.target.value)} />
                </div>
                <div>
                  <label className="label">Categoria</label>
                  <select className="input" value={form.categoriaId} onChange={e => set('categoriaId', e.target.value)}>
                    <option value="">Sem categoria</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">URL da Imagem</label>
                <input className="input" value={form.imagemUrl} onChange={e => set('imagemUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="label">Descrição</label>
                <textarea className="input min-h-[80px]" value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição do produto..." />
              </div>
              <div>
                <label className="label">Composição</label>
                <textarea className="input min-h-[80px]" value={form.composicao} onChange={e => set('composicao', e.target.value)} placeholder="Item 1, Item 2, Item 3..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-ghost flex-1 border border-gray-300 py-3">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {saving ? <><Spinner size="sm" /> Salvando...</> : <><Check className="w-4 h-4" /> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
