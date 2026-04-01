'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadFileToR2 } from '@/lib/upload'
import type { Media } from '@/types'

interface AdminMediasProps {
  toast: (msg: string, err?: boolean) => void
  onDelete: (id: string, table: string) => void
}

export default function AdminMedias({ toast, onDelete }: AdminMediasProps) {
  const [medias, setMedias] = useState<Media[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Témoignage Audio')
  const [desc, setDesc] = useState('')
  const [duration, setDuration] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [status, setStatus] = useState('pub')
  const [saving, setSaving] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [fileLabel, setFileLabel] = useState('Cliquer pour choisir un fichier')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedias = useCallback(async () => {
    const { data, error } = await supabase
      .from('medias')
      .select('id,title,description,type,file_url,duration,status,created_at')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return }
    setMedias(data || [])
  }, [])

  useEffect(() => { fetchMedias() }, [fetchMedias])

  const openModal = (id?: string) => {
    setMediaFile(null); setFileLabel('Cliquer pour choisir un fichier')
    setEditId(id || ''); setTitle(''); setType('Témoignage Audio')
    setDesc(''); setDuration(''); setFileUrl(''); setStatus('pub')
    if (id) {
      const m = medias.find((x) => x.id === id)
      if (m) {
        setTitle(m.title || ''); setType(m.type || 'Témoignage Audio')
        setDesc(m.description || ''); setDuration(m.duration || '')
        setFileUrl(m.file_url || ''); setStatus(m.status || 'pub')
      }
    }
    setModalOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setMediaFile(file); setFileLabel('📎 ' + file.name) }
  }

  const save = async () => {
    setSaving(true)
    try {
      let url = fileUrl
      if (mediaFile) url = await uploadFileToR2(mediaFile)
      const payload = { title: title.trim(), type, description: desc.trim(), duration: duration.trim(), status, file_url: url }
      const { error } = editId
        ? await supabase.from('medias').update(payload).eq('id', editId)
        : await supabase.from('medias').insert([payload])
      if (error) throw error
      toast('Média enregistré ✓')
      setModalOpen(false)
      fetchMedias()
    } catch (err: unknown) {
      toast('Erreur: ' + (err instanceof Error ? err.message : 'Erreur'), true)
    } finally { setSaving(false) }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="a-add-btn" onClick={() => openModal()}>+ Ajouter un média</button>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th className="a-th">Titre</th>
            <th className="a-th">Type</th>
            <th className="a-th">Statut</th>
            <th className="a-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!medias.length ? (
            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--ink3)' }}>Aucun média.</td></tr>
          ) : medias.map((m) => (
            <tr className="a-tr" key={m.id}>
              <td className="a-td"><span style={{ fontFamily: 'var(--serif)', fontSize: '0.82rem', color: 'var(--ink)' }}>{m.title}</span></td>
              <td className="a-td">{m.type || '—'}</td>
              <td className="a-td"><span className={`a-badge ${m.status === 'pub' ? 'a-pub' : 'a-draft'}`}>{m.status === 'pub' ? 'Publié' : 'Brouillon'}</span></td>
              <td className="a-td">
                <div className="a-act-row">
                  <button className="a-act" onClick={() => openModal(m.id)}>Modifier</button>
                  <button className="a-act del" onClick={() => onDelete(m.id, 'medias')}>Suppr.</button>
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
              <div className="modal-title">{editId ? 'Modifier le média' : 'Ajouter un média'}</div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="f-label">Titre <span style={{ color: 'var(--rust)' }}>*</span></label>
              <input className="f-input" type="text" placeholder="Titre du média" value={title} onChange={(e) => setTitle(e.target.value)} />
              <label className="f-label">Type</label>
              <select className="f-sel" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Témoignage Audio</option>
                <option>Documentaire</option>
                <option>Archives</option>
                <option>Conférence</option>
                <option>Visite guidée</option>
                <option>Série</option>
              </select>
              <label className="f-label">Description</label>
              <textarea className="f-ta" placeholder="Description..." value={desc} onChange={(e) => setDesc(e.target.value)} />
              <label className="f-label">Fichier média (audio, vidéo, PDF)</label>
              <div className="up-area" style={{ padding: '1rem', marginBottom: '1rem' }} onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="audio/*,video/*,.pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--ink3)' }}>{fileLabel}</div>
              </div>
              <div className="f-2col">
                <div><label className="f-label">Durée</label><input className="f-input" type="text" placeholder="Ex: 38 min" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
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
