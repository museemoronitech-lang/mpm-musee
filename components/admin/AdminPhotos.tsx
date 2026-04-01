'use client'

import { useState, useMemo } from 'react'
import type { Photo } from '@/types'
import UploadModal from '@/components/admin/UploadModal'
import EditModal from '@/components/admin/EditModal'

interface AdminPhotosProps {
  photos: Photo[]
  totalPhotos: number
  pubPhotos: number
  draftPhotos: number
  thisMonth: number
  onReload: () => void
  toast: (msg: string, err?: boolean) => void
  onDelete: (id: string, table: string) => void
}

export default function AdminPhotos({
  photos, totalPhotos, pubPhotos, draftPhotos, thisMonth,
  onReload, toast, onDelete,
}: AdminPhotosProps) {
  const [filterQ, setFilterQ] = useState('')
  const [filterPeriode, setFilterPeriode] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const q = filterQ.toLowerCase()
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.ref_code.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      const matchP = !filterPeriode || p.periode === filterPeriode
      const matchS = !filterStatus || p.status === filterStatus
      return matchQ && matchP && matchS
    })
  }, [photos, filterQ, filterPeriode, filterStatus])

  const openEdit = (id: string) => {
    const p = photos.find((x) => x.id === id)
    if (p) { setEditPhoto(p); setEditOpen(true) }
  }

  return (
    <>
      <div className="admin-kpis">
        <div className="a-kpi"><div className="a-kpi-n">{totalPhotos}</div><div className="a-kpi-l">Total photos</div></div>
        <div className="a-kpi"><div className="a-kpi-n">{pubPhotos}</div><div className="a-kpi-l">Publiées</div></div>
        <div className="a-kpi"><div className="a-kpi-n">{draftPhotos}</div><div className="a-kpi-l">Brouillons</div></div>
        <div className="a-kpi"><div className="a-kpi-n">{thisMonth}</div><div className="a-kpi-l">Ce mois</div></div>
      </div>

      <div className="admin-filters">
        <div className="admin-filters-left">
          <input className="a-input" type="text" placeholder="Rechercher..." value={filterQ} onChange={(e) => setFilterQ(e.target.value)} />
          <select className="a-select" value={filterPeriode} onChange={(e) => setFilterPeriode(e.target.value)}>
            <option value="">Toutes les périodes</option>
            <option>Sultanats</option>
            <option>Époque Coloniale</option>
            <option>Post-Indépendance</option>
          </select>
          <select className="a-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="pub">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
        <button className="a-add-btn" onClick={() => setUploadOpen(true)}>+ Ajouter des photos</button>
      </div>

      <table className="a-table">
        <thead>
          <tr>
            <th className="a-th" style={{ width: '64px' }}>Aperçu</th>
            <th className="a-th">Titre</th>
            <th className="a-th">Période</th>
            <th className="a-th">Date</th>
            <th className="a-th">Référence</th>
            <th className="a-th">Statut</th>
            <th className="a-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!filtered.length ? (
            <tr>
              <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--ink3)' }}>
                Aucune photo trouvée.
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr className="a-tr" key={p.id}>
                <td className="a-td">
                  <div className="a-thumb" style={{ backgroundImage: `url('${p.image_url}')` }} />
                </td>
                <td className="a-td" style={{ maxWidth: '210px' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.3, display: 'block' }}>{p.title}</span>
                  {p.author && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--ink3)' }}>{p.author}</span>}
                </td>
                <td className="a-td">{p.periode || '—'}</td>
                <td className="a-td">{p.date_approx}</td>
                <td className="a-td" style={{ fontSize: '0.58rem', color: 'var(--ink3)' }}>{p.ref_code}</td>
                <td className="a-td">
                  <span className={`a-badge ${p.status === 'pub' ? 'a-pub' : 'a-draft'}`}>
                    {p.status === 'pub' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="a-td">
                  <div className="a-act-row">
                    <button className="a-act" onClick={() => openEdit(p.id)}>Modifier</button>
                    <button className="a-act del" onClick={() => onDelete(p.id, 'photos')}>Suppr.</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onDone={onReload} toast={toast} />
      <EditModal photo={editPhoto} open={editOpen} onClose={() => setEditOpen(false)} onDone={onReload} toast={toast} />
    </>
  )
}
