'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { uploadFileToR2 } from '@/lib/upload'
import { supabase } from '@/lib/supabase'

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onDone: () => void
  toast: (msg: string, err?: boolean) => void
}

interface QueueFile {
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  statusText: string
  thumbUrl: string
}

export default function UploadModal({ open, onClose, onDone, toast }: UploadModalProps) {
  const [queue, setQueue] = useState<QueueFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [batchPeriode, setBatchPeriode] = useState('Sultanats')
  const [batchStatus, setBatchStatus] = useState('pub')
  const [batchAuthor, setBatchAuthor] = useState('')
  const [batchDate, setBatchDate] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = (files: File[]) => {
    const imgFiles = files.filter((f) => f.type.startsWith('image/') || f.name.endsWith('.zip'))
    if (!imgFiles.length) { toast('Aucune image valide sélectionnée.', true); return }
    const newItems: QueueFile[] = imgFiles.map((file) => {
      let thumbUrl = ''
      if (file.type.startsWith('image/')) {
        thumbUrl = URL.createObjectURL(file)
      }
      return { file, status: 'pending', progress: 0, statusText: `${(file.size / 1024 / 1024).toFixed(1)} Mo`, thumbUrl }
    })
    setQueue((prev) => [...prev, ...newItems])
  }

  const removeFromQueue = (i: number) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const startUpload = async () => {
    if (!queue.length) return
    setUploading(true)
    let successCount = 0

    for (let i = 0; i < queue.length; i++) {
      const q = queue[i]
      setQueue((prev) => prev.map((item, idx) => idx === i ? { ...item, status: 'uploading', statusText: 'Upload…' } : item))

      try {
        const url = await uploadFileToR2(q.file, (pct) => {
          setQueue((prev) => prev.map((item, idx) => idx === i ? { ...item, progress: pct } : item))
        })
        const title = q.file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        await supabase.from('photos').insert([{ image_url: url, title, date_approx: batchDate, periode: batchPeriode, author: batchAuthor, status: batchStatus }])
        setQueue((prev) => prev.map((item, idx) => idx === i ? { ...item, status: 'done', statusText: '✓ OK' } : item))
        successCount++
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue'
        let errMsg = '✗ Erreur'
        if (message.includes('bucket') || message.includes('not found')) {
          errMsg = '✗ Bucket introuvable'
          toast('Bucket "photos" introuvable. Créez-le dans Dashboard > Storage.', true)
        } else if (message.includes('row-level') || message.includes('policy')) {
          errMsg = '✗ Politique RLS'
          toast('Erreur de droits Supabase. Vérifiez les policies.', true)
        } else {
          toast('Upload échoué : ' + message.slice(0, 80), true)
        }
        setQueue((prev) => prev.map((item, idx) => idx === i ? { ...item, status: 'error', statusText: errMsg } : item))
      }
    }

    toast(`${successCount} photo(s) ajoutée(s) avec succès.`)
    setTimeout(() => {
      setUploading(false)
      setQueue([])
      setBatchAuthor('')
      setBatchDate('')
      onClose()
      onDone()
    }, 1200)
  }

  if (!open) return null

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">Ajouter des photographies</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div
            className={`up-area${dragOver ? ' drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept="image/*,.zip" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="up-area-icon">📷</div>
            <div className="up-area-txt">Cliquer ou glisser des images ici</div>
            <div className="up-area-sub">JPG, PNG, WEBP — plusieurs fichiers acceptés · Stockage R2</div>
          </div>

          <div className="upload-queue">
            {queue.map((q, i) => (
              <div className="uq-item" key={i}>
                <div className="uq-thumb" style={{ backgroundImage: q.thumbUrl ? `url('${q.thumbUrl}')` : undefined }} />
                <div>
                  <div className="uq-name">{q.file.name}</div>
                  <div className="uq-bar-wrap"><div className="uq-bar" style={{ width: `${q.progress}%` }} /></div>
                </div>
                <div className={`uq-status${q.status === 'done' ? ' done' : ''}${q.status === 'error' ? ' error' : ''}`}>
                  {q.statusText}
                </div>
                {q.status === 'pending' && (
                  <button className="uq-remove" onClick={() => removeFromQueue(i)}>✕</button>
                )}
              </div>
            ))}
          </div>

          {queue.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--ink3)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--cr3)' }}>
                Métadonnées (appliquées à tous les fichiers)
              </div>
              <div className="f-2col">
                <div>
                  <label className="f-label">Période</label>
                  <select className="f-sel" value={batchPeriode} onChange={(e) => setBatchPeriode(e.target.value)}>
                    <option>Sultanats</option>
                    <option>Époque Coloniale</option>
                    <option>Post-Indépendance</option>
                  </select>
                </div>
                <div>
                  <label className="f-label">Statut</label>
                  <select className="f-sel" value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)}>
                    <option value="pub">Publier immédiatement</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
              <div className="f-2col">
                <div>
                  <label className="f-label">Photographe</label>
                  <input className="f-input" type="text" placeholder="Ex : Anonyme" value={batchAuthor} onChange={(e) => setBatchAuthor(e.target.value)} />
                </div>
                <div>
                  <label className="f-label">Date approximative</label>
                  <input className="f-input" type="text" placeholder="c. 1963" value={batchDate} onChange={(e) => setBatchDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          {queue.length > 0 && (
            <button className="a-add-btn" onClick={startUpload} disabled={uploading}>
              {uploading ? 'Upload en cours…' : 'Uploader et enregistrer'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
