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
import AdminParams from '@/components/admin/AdminParams'
import { toast } from '@/components/Toast'

const ADMIN_PASSWORD = 'Medina2025MPM'
type Section = 'photos' | 'articles' | 'medias' | 'admins' | 'params'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [section, setSection] = useState<Section>('photos')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [pendingDelete, setPendingDelete] = useState<{ id: string | string[]; table: string } | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

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

  const handleDelete = (id: string | string[], table: string) => {
    setPendingDelete({ id, table })
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const ids = Array.isArray(pendingDelete.id) ? pendingDelete.id : [pendingDelete.id]
    await supabase.from(pendingDelete.table).delete().in('id', ids)
    toast(ids.length > 1 ? `${ids.length} éléments supprimés ✓` : 'Supprimé ✓')
    setPendingDelete(null)
    if (pendingDelete.table === 'photos') {
      setSelectedIds(prev => prev.filter(i => !ids.includes(i)))
      loadPhotos()
    }
  }

  // ── Sélection multiple ──
  const toggleSelect = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  const selectAll = (ids: string[]) => setSelectedIds(ids)
  const clearSelection = () => setSelectedIds([])

  // Modifie en un clic un champ (période, collection, source, photographe, statut)
  // pour toutes les photos sélectionnées
  const bulkUpdate = async (patch: Partial<Pick<Photo, 'periode' | 'collection' | 'source' | 'author' | 'status' | 'featured'>>) => {
    if (selectedIds.length === 0) return
    const { error } = await supabase.from('photos').update(patch).in('id', selectedIds)
    if (error) {
      toast('Erreur : ' + error.message, true)
      return
    }
    toast(`${selectedIds.length} photo(s) mise(s) à jour ✓`)
    loadPhotos()
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
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectAll={selectAll}
                onClearSelection={clearSelection}
                onBulkUpdate={bulkUpdate}
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
            {section === 'params' && <AdminParams toast={toast} />}
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
                {Array.isArray(pendingDelete.id) && pendingDelete.id.length > 1
                  ? `${pendingDelete.id.length} éléments seront supprimés. `
                  : ''}
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