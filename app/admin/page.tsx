'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchPhotos } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Photo } from '@/types'
import AdminAuth from '@/components/admin/AdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminPhotos from '@/components/admin/AdminPhotos'
import AdminArticles from '@/components/admin/AdminArticles'
import AdminMedias from '@/components/admin/AdminMedias'
import { toast } from '@/components/Toast'

const ADMIN_PASSWORD = 'Medina2025MPM'
type Section = 'photos' | 'articles' | 'medias' | 'admins' | 'params'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [section, setSection] = useState<Section>('photos')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [pendingDelete, setPendingDelete] = useState<{ id: string; table: string } | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('mpm_admin') === '1') setIsAdmin(true)
  }, [])

  const loadPhotos = useCallback(() => {
    fetchPhotos().then(setPhotos)
  }, [])

  useEffect(() => {
    if (isAdmin) loadPhotos()
  }, [isAdmin, loadPhotos])

  const handleLogin = (pwd: string): boolean => {
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('mpm_admin', '1')
      setIsAdmin(true)
      setLoginError(false)
      return true
    }
    setLoginError(true)
    return false
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mpm_admin')
    setIsAdmin(false)
  }

  const handleDelete = (id: string, table: string) => {
    setPendingDelete({ id, table })
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    await supabase.from(pendingDelete.table).delete().eq('id', pendingDelete.id)
    toast('Supprimé ✓')
    setPendingDelete(null)
    if (pendingDelete.table === 'photos') loadPhotos()
  }

  const now = new Date()
  const totalPhotos = photos.length
  const pubPhotos = photos.filter(p => p.status === 'pub').length
  const draftPhotos = totalPhotos - pubPhotos
  const thisMonth = photos.filter(p => {
    if (!p.created_at) return false
    const d = new Date(p.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const sectionTitles: Record<Section, string> = {
    photos: 'Photographies',
    articles: 'Articles',
    medias: 'Médias',
    admins: 'Administrateurs',
    params: 'Paramètres',
  }

  if (!isAdmin) {
    return <AdminAuth onLogin={handleLogin} loginError={loginError} />
  }

  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="admin-wrap">
        <AdminSidebar
          activeSection={section}
          onSection={(s) => setSection(s as Section)}
          onLogout={handleLogout}
        />
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <a className="admin-tb-back" href="/">← Retour au site</a>
              <div className="admin-page-title">{sectionTitles[section]}</div>
            </div>
          </div>
          <div className="admin-content">
            {section === 'photos' && (
              <AdminPhotos
                photos={photos}
                totalPhotos={totalPhotos}
                pubPhotos={pubPhotos}
                draftPhotos={draftPhotos}
                thisMonth={thisMonth}
                onReload={loadPhotos}
                toast={toast}
                onDelete={handleDelete}
              />
            )}
            {section === 'articles' && (
              <AdminArticles toast={toast} onDelete={handleDelete} />
            )}
            {section === 'medias' && (
              <AdminMedias toast={toast} onDelete={handleDelete} />
            )}
            {section === 'admins' && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink3)' }}>
                Section administrateurs — à venir.
              </div>
            )}
            {section === 'params' && (
              <div className="param-section">
                <div className="param-title">Paramètres</div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink2)', marginBottom: '1rem' }}>
                  Changer le mot de passe admin.
                </p>
                <input className="f-input" type="password" placeholder="Nouveau mot de passe" />
                <input className="f-input" type="password" placeholder="Confirmer" style={{ marginTop: '0.5rem' }} />
                <button className="a-add-btn" style={{ marginTop: '0.5rem' }}>Mettre à jour</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingDelete && (
        <div className="modal-overlay open" onClick={() => setPendingDelete(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Confirmer la suppression</div>
              <button className="modal-close" onClick={() => setPendingDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink2)' }}>
                Cette action est irréversible. Confirmer ?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setPendingDelete(null)}>Annuler</button>
              <button className="a-add-btn" style={{ background: '#ef4444' }} onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}