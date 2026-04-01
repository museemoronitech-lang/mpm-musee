'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Photo } from '@/types'

interface EditModalProps {
  photo: Photo | null
  open: boolean
  onClose: () => void
  onDone: () => void
  toast: (msg: string, err?: boolean) => void
}

export default function EditModal({ photo, open, onClose, onDone, toast }: EditModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [periode, setPeriode] = useState('Sultanats')
  const [author, setAuthor] = useState('')
  const [ref, setRef] = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus] = useState('pub')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (photo) {
      setTitle(photo.title)
      setDate(photo.date_approx === '—' ? '' : photo.date_approx)
      setPeriode(photo.periode || 'Sultanats')
      setAuthor(photo.author)
      setRef(photo.ref_code === '—' ? '' : photo.ref_code)
      setContext(photo.context)
      setStatus(photo.status)
    }
  }, [photo])

  const save = async () => {
    if (!photo) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('photos')
        .update({ title, date_approx: date, periode, author, ref_code: ref, context, status })
        .eq('id', photo.id)
      if (error) throw error
      toast('Photo mise à jour ✓')
      onClose()
      onDone()
    } catch (err: unknown) {
      toast('Erreur: ' + (err instanceof Error ? err.message : 'Erreur inconnue'), true)
    } finally {
      setSaving(false)
    }
  }

  if (!open || !photo) return null

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">Modifier la photographie</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ width: '100%', height: '140px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--cr3)', filter: 'saturate(0.3)', marginBottom: '0.5rem', backgroundImage: photo.image_url ? `url('${photo.image_url}')` : undefined }} />
          </div>
          <div className="f-2col">
            <div><label className="f-label">Titre</label><input className="f-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><label className="f-label">Date</label><input className="f-input" type="text" placeholder="c. 1963" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          </div>
          <div className="f-2col">
            <div>
              <label className="f-label">Période</label>
              <select className="f-sel" value={periode} onChange={(e) => setPeriode(e.target.value)}>
                <option>Sultanats</option>
                <option>Époque Coloniale</option>
                <option>Post-Indépendance</option>
              </select>
            </div>
            <div><label className="f-label">Photographe</label><input className="f-input" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
          </div>
          <label className="f-label">Référence</label>
          <input className="f-input" type="text" placeholder="Ex: MPM-001" value={ref} onChange={(e) => setRef(e.target.value)} />
          <label className="f-label">Contexte historique</label>
          <textarea className="f-ta" placeholder="Décrivez le contexte..." value={context} onChange={(e) => setContext(e.target.value)} />
          <label className="f-label">Statut</label>
          <select className="f-sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pub">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="a-add-btn" onClick={save} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
