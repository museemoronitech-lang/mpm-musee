'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadFileToR2 } from '@/lib/upload'

export default function AdminParams({ toast }: { toast: (msg: string, err?: boolean) => void }) {
  const [heroAccueil, setHeroAccueil] = useState('')
  const [heroNgazidja, setHeroNgazidja] = useState('')
  const [uploading, setUploading] = useState<'hero_accueil' | 'hero_ngazidja' | null>(null)

  useEffect(() => {
    supabase
      .from('settings')
      .select('key,value')
      .in('key', ['hero_accueil', 'hero_ngazidja'])
      .then(({ data }) => {
        if (!data) return
        data.forEach((row) => {
          if (row.key === 'hero_accueil') setHeroAccueil(row.value)
          if (row.key === 'hero_ngazidja') setHeroNgazidja(row.value)
        })
      })
  }, [])

  const handleUpload = async (key: 'hero_accueil' | 'hero_ngazidja', file: File) => {
    setUploading(key)
    try {
      const url = await uploadFileToR2(file)
      await supabase.from('settings').upsert({ key, value: url }, { onConflict: 'key' })
      if (key === 'hero_accueil') setHeroAccueil(url)
      else setHeroNgazidja(url)
      toast('Image hero mise à jour ✓')
    } catch {
      toast('Erreur lors de l\'upload', true)
    } finally {
      setUploading(null)
    }
  }

  const previewStyle = (url: string): React.CSSProperties => ({
    width: '100%',
    height: '120px',
    backgroundImage: url ? `url('${url}')` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    background: url ? undefined : 'var(--cr3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--mono)',
    fontSize: '0.6rem',
    color: 'var(--ink3)',
    marginBottom: '0.75rem',
    border: '1px solid var(--cr3)',
  })

  return (
    <>
      <div className="param-section">
        <div className="param-title">Mot de passe admin</div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink2)', marginBottom: '1rem' }}>
          Changer le mot de passe admin.
        </p>
        <input className="f-input" type="password" placeholder="Nouveau mot de passe" />
        <input className="f-input" type="password" placeholder="Confirmer" style={{ marginTop: '0.5rem' }} />
        <button className="a-add-btn" style={{ marginTop: '0.5rem' }}>Mettre à jour</button>
      </div>

      <div className="param-section">
        <div className="param-title">Images Hero</div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink2)', marginBottom: '1.5rem' }}>
          Remplacer les images d'arrière-plan de la page d'accueil. Les fichiers locaux par défaut sont utilisés si aucune image n'est définie.
        </p>
        <div className="f-2col">
          <div>
            <label className="f-label">Accueil — hero principal</label>
            <div style={previewStyle(heroAccueil)}>
              {!heroAccueil && '/Accueil.png (par défaut)'}
            </div>
            <label
              className="a-add-btn"
              style={{ display: 'inline-block', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading === 'hero_accueil' ? 'Upload en cours…' : 'Choisir un fichier'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={!!uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload('hero_accueil', f)
                }}
              />
            </label>
          </div>
          <div>
            <label className="f-label">Ngazidja — parcours auteurs</label>
            <div style={previewStyle(heroNgazidja)}>
              {!heroNgazidja && '/Ngazidja.png (par défaut)'}
            </div>
            <label
              className="a-add-btn"
              style={{ display: 'inline-block', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading === 'hero_ngazidja' ? 'Upload en cours…' : 'Choisir un fichier'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={!!uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload('hero_ngazidja', f)
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
