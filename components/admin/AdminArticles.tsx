'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadFileToR2 } from '@/lib/upload'
import type { Article } from '@/types'

interface AdminArticlesProps {
  toast: (msg: string, err?: boolean) => void
  onDelete: (id: string, table: string) => void
}

export default function AdminArticles({ toast, onDelete }: AdminArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [attachUrl, setAttachUrl] = useState('')
  const [status, setStatus] = useState('pub')
  const [saving, setSaving] = useState(false)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState('')
  const [attachFile, setAttachFile] = useState<File | null>(null)
  const [attachLabel, setAttachLabel] = useState('Cliquer pour joindre un PDF ou Word')
  const imgInputRef = useRef<HTMLInputElement>(null)
  const attachInputRef = useRef<HTMLInputElement>(null)

  const fetchArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id,title,content,cover_url,attachment_url,status,category,created_at')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return }
    setArticles(data || [])
  }, [])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const openModal = (id?: string) => {
    setImgFile(null); setAttachFile(null); setImgPreview('')
    setAttachLabel('Cliquer pour joindre un PDF ou Word')
    setEditId(id || ''); setTitle(''); setCategory(''); setContent('')
    setCoverUrl(''); setAttachUrl(''); setStatus('pub')
    if (id) {
      const a = articles.find((x) => x.id === id)
      if (a) {
        setTitle(a.title || ''); setCategory(a.category || '')
        setContent(a.content || ''); setCoverUrl(a.cover_url || '')
        setAttachUrl(a.attachment_url || ''); setStatus(a.status || 'pub')
        if (a.cover_url) setImgPreview(a.cover_url)
      }
    }
    setModalOpen(true)
  }

  const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImgPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleAttachSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setAttachFile(file); setAttachLabel('📎 ' + file.name) }
  }

  const save = async () => {
    setSaving(true)
    try {
      let cover = coverUrl
      let attach = attachUrl
      if (imgFile) cover = await uploadFileToR2(imgFile)
      if (attachFile) attach = await uploadFileToR2(attachFile)
      const payload = { title: title.trim(), category: category.trim(), content: content.trim(), status, cover_url: cover, attachment_url: attach }
      const { error } = editId
        ? await supabase.from('articles').update(payload).eq('id', editId)
        : await supabase.from('articles').insert([payload])
      if (error) throw error
      toast('Article enregistré ✓')
      setModalOpen(false)
      fetchArticles()
    } catch (err: unknown) {
      toast('Erreur: ' + (err instanceof Error ? err.message : 'Erreur'), true)
    } finally { setSaving(false) }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="a-add-btn" onClick={() => openModal()}>+ Ajouter un article</button>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th className="a-th">Titre</th>
            <th className="a-th">Statut</th>
            <th className="a-th">Date</th>
            <th className="a-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!articles.length ? (
            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--ink3)' }}>Aucun article.</td></tr>
          ) : articles.map((a) => (
            <tr className="a-tr" key={a.id}>
              <td className="a-td">
                <span style={{ fontFamily: 'var(--serif)', fontSize: '0.82rem', color: 'var(--ink)' }}>{a.title}</span>
                {a.category && <div style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--ink3)', marginTop: '0.2rem' }}>{a.category}</div>}
              </td>
              <td className="a-td"><span className={`a-badge ${a.status === 'pub' ? 'a-pub' : 'a-draft'}`}>{a.status === 'pub' ? 'Publié' : 'Brouillon'}</span></td>
              <td className="a-td">{a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : '—'}</td>
              <td className="a-td">
                <div className="a-act-row">
                  <button className="a-act" onClick={() => openModal(a.id)}>Modifier</button>
                  <button className="a-act del" onClick={() => onDelete(a.id, 'articles')}>Suppr.</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">{editId ? "Modifier l'article" : 'Ajouter un article'}</div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="f-label">Titre <span style={{ color: 'var(--rust)' }}>*</span></label>
              <input className="f-input" type="text" placeholder="Titre de l'article" value={title} onChange={(e) => setTitle(e.target.value)} />
              <label className="f-label">Catégorie</label>
              <input className="f-input" type="text" placeholder="Ex: Histoire · Société" value={category} onChange={(e) => setCategory(e.target.value)} />
              <label className="f-label">Contenu</label>
              <textarea className="f-ta" style={{ minHeight: '140px' }} placeholder="Contenu de l'article..." value={content} onChange={(e) => setContent(e.target.value)} />
              <label className="f-label">Image de couverture</label>
              <div className="up-area" style={{ padding: '1rem', marginBottom: '0.5rem' }} onClick={() => imgInputRef.current?.click()}>
                <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgSelect} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--ink3)' }}>Cliquer pour choisir une image de couverture</div>
              </div>
              {imgPreview && (
                <div style={{ marginBottom: '1rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgPreview} alt="preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', filter: 'saturate(0.3)' }} />
                </div>
              )}
              <label className="f-label">Pièce jointe (Word / PDF)</label>
              <div className="up-area" style={{ padding: '1rem', marginBottom: '1rem' }} onClick={() => attachInputRef.current?.click()}>
                <input ref={attachInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleAttachSelect} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--ink3)' }}>{attachLabel}</div>
              </div>
              <div className="f-2col">
                <div>
                  <label className="f-label">Statut</label>
                  <select className="f-sel" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pub">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="a-add-btn" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
