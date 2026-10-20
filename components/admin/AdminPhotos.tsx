'use client'

import { useState, useMemo, useRef } from 'react'
import type { Photo } from '@/types'
import UploadModal from '@/components/admin/UploadModal'
import EditModal from '@/components/admin/EditModal'
import { supabase } from '@/lib/supabase'

const PERIODES = ['Sultanats', 'Époque Coloniale', 'Post-Indépendance']

type SortKey = 'title' | 'periode' | 'collection' | 'source' | 'date_approx' | 'ref_code' | 'status' | 'featured'

type BulkPatch = Partial<Pick<Photo, 'periode' | 'collection' | 'source' | 'author' | 'status' | 'featured'>>

interface AdminPhotosProps {
  photos: Photo[]
  totalPhotos: number
  pubPhotos: number
  draftPhotos: number
  thisMonth: number
  onReload: () => void
  toast: (msg: string, err?: boolean) => void
  onDelete: (id: string | string[], table: string) => void
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onClearSelection: () => void
  onBulkUpdate: (patch: BulkPatch) => void
}

export default function AdminPhotos({
  photos, totalPhotos, pubPhotos, draftPhotos, thisMonth,
  onReload, toast, onDelete,
  selectedIds, onToggleSelect, onSelectAll, onClearSelection, onBulkUpdate,
}: AdminPhotosProps) {
  const [filterQ, setFilterQ] = useState('')
  const [filterPeriode, setFilterPeriode] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCollection, setFilterCollection] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // champs de la barre d'actions groupées
  const [bulkCollection, setBulkCollection] = useState('')
  const [bulkSource, setBulkSource] = useState('')
  const [bulkAuthor, setBulkAuthor] = useState('')

  const collections = useMemo(
    () => Array.from(new Set(photos.map((p) => p.collection).filter(Boolean) as string[])).sort(),
    [photos]
  )
  const sources = useMemo(
    () => Array.from(new Set(photos.map((p) => p.source).filter(Boolean) as string[])).sort(),
    [photos]
  )
  const authors = useMemo(
    () => Array.from(new Set(photos.map((p) => p.author).filter(Boolean))).sort(),
    [photos]
  )

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const q = filterQ.toLowerCase()
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.ref_code.toLowerCase().includes(q) ||
        (p.author || '').toLowerCase().includes(q) ||
        (p.collection || '').toLowerCase().includes(q) ||
        (p.source || '').toLowerCase().includes(q)
      const matchP = !filterPeriode || p.periode === filterPeriode
      const matchS = !filterStatus || p.status === filterStatus
      const matchC = !filterCollection || p.collection === filterCollection
      return matchQ && matchP && matchS && matchC
    })
  }, [photos, filterQ, filterPeriode, filterStatus, filterCollection])

  // Tri par colonne : clic = croissant, 2e clic = décroissant, 3e clic = retour à l'ordre d'origine
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const getVal = (p: Photo): string | number => {
      switch (sortKey) {
        case 'title': return (p.title || '').toLowerCase()
        case 'periode': return (p.periode || '').toLowerCase()
        case 'collection': return (p.collection || '').toLowerCase()
        case 'source': return (p.source || '').toLowerCase()
        case 'date_approx': return (p.date_approx || '').toString().toLowerCase()
        case 'ref_code': return (p.ref_code || '').toLowerCase()
        case 'status': return p.status || ''
        case 'featured': return p.featured ? 1 : 0
      }
    }
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const va = getVal(a)
      const vb = getVal(b)
      // les valeurs vides vont toujours à la fin
      const ea = va === '' , eb = vb === ''
      if (ea && !eb) return 1
      if (!ea && eb) return -1
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
      return String(va).localeCompare(String(vb), 'fr', { numeric: true, sensitivity: 'base' }) * dir
    })
  }, [filtered, sortKey, sortDir])

  const sortArrow = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '')
  const sortableTh = (key: SortKey, label: string) => (
    <th
      className="a-th"
      onClick={() => handleSort(key)}
      style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
      aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      title={`Trier par ${label.toLowerCase()}`}
    >
      {label}{sortArrow(key)}
    </th>
  )

  const filteredIds = sorted.map((p) => p.id)
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id))
  const nbSel = selectedIds.length

  // Clic sur une case : avec Maj, sélectionne tout de la dernière case cliquée jusqu'à celle-ci
  const lastClickedId = useRef<string | null>(null)
  const handleCheckClick = (e: React.MouseEvent<HTMLInputElement>, id: string) => {
    const last = lastClickedId.current
    if (e.shiftKey && last && last !== id) {
      const a = filteredIds.indexOf(last)
      const b = filteredIds.indexOf(id)
      if (a !== -1 && b !== -1) {
        const [from, to] = a < b ? [a, b] : [b, a]
        const range = filteredIds.slice(from, to + 1)
        // si la case cliquée est en train d'être décochée, on décoche la plage
        const willSelect = !selectedIds.includes(id)
        const next = willSelect
          ? Array.from(new Set([...selectedIds, ...range]))
          : selectedIds.filter((x) => !range.includes(x))
        onSelectAll(next)
        lastClickedId.current = id
        return
      }
    }
    onToggleSelect(id)
    lastClickedId.current = id
  }

  const openEdit = (id: string) => {
    const p = photos.find((x) => x.id === id)
    if (p) { setEditPhoto(p); setEditOpen(true) }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    setTogglingId(id)
    const { error } = await supabase.from('photos').update({ featured: !current }).eq('id', id)
    if (error) toast('Erreur mise à jour', true)
    else onReload()
    setTogglingId(null)
  }

  const applyText = (field: 'collection' | 'source' | 'author', value: string, reset: () => void) => {
    const v = value.trim()
    if (!v) return
    onBulkUpdate({ [field]: v } as BulkPatch)
    reset()
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
            {PERIODES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="a-select" value={filterCollection} onChange={(e) => setFilterCollection(e.target.value)}>
            <option value="">Toutes les collections</option>
            {collections.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="a-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="pub">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
        <button className="a-add-btn" onClick={() => setUploadOpen(true)}>+ Ajouter des photos</button>
      </div>

      {/* Barre d'actions groupées */}
      {nbSel > 0 && (
        <div
          className="a-bulk"
          style={{
            position: 'relative', zIndex: 20,
            background: 'var(--cr)', border: '1px solid var(--ink)',
            padding: '0.7rem 0.9rem', margin: '0 0 0.8rem',
            display: 'flex', flexDirection: 'column', gap: '0.55rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--mono)', fontSize: '0.66rem', color: 'var(--ink)' }}>
            <strong>{nbSel} sélectionnée{nbSel > 1 ? 's' : ''}</strong>
            <button className="a-act" onClick={onClearSelection}>Désélectionner</button>
            <button
              className="a-add-btn"
              style={{ background: '#ef4444', marginLeft: 'auto', whiteSpace: 'nowrap' }}
              onClick={() => onDelete(selectedIds, 'photos')}
            >
              🗑 Supprimer ({nbSel})
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--ink3)' }}>Période :</span>
            {PERIODES.map((p) => (
              <button key={p} className="a-act" onClick={() => onBulkUpdate({ periode: p })}>{p}</button>
            ))}
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--ink3)', marginLeft: '0.8rem' }}>Statut :</span>
            <button className="a-act" onClick={() => onBulkUpdate({ status: 'pub' })}>Publier</button>
            <button className="a-act" onClick={() => onBulkUpdate({ status: 'draft' })}>Brouillon</button>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--ink3)', marginLeft: '0.8rem' }}>En avant :</span>
            <button className="a-act" onClick={() => onBulkUpdate({ featured: true })}>★ Oui</button>
            <button className="a-act" onClick={() => onBulkUpdate({ featured: false })}>☆ Non</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            <input
              className="a-input" list="dl-collections" placeholder="Collection…"
              value={bulkCollection} onChange={(e) => setBulkCollection(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyText('collection', bulkCollection, () => setBulkCollection(''))}
            />
            <button className="a-act" onClick={() => applyText('collection', bulkCollection, () => setBulkCollection(''))}>Appliquer</button>

            <input
              className="a-input" list="dl-sources" placeholder="Source (ex. Musée…)"
              value={bulkSource} onChange={(e) => setBulkSource(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyText('source', bulkSource, () => setBulkSource(''))}
            />
            <button className="a-act" onClick={() => applyText('source', bulkSource, () => setBulkSource(''))}>Appliquer</button>

            <input
              className="a-input" list="dl-authors" placeholder="Photographe…"
              value={bulkAuthor} onChange={(e) => setBulkAuthor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyText('author', bulkAuthor, () => setBulkAuthor(''))}
            />
            <button className="a-act" onClick={() => applyText('author', bulkAuthor, () => setBulkAuthor(''))}>Appliquer</button>
          </div>

          <datalist id="dl-collections">{collections.map((c) => <option key={c} value={c} />)}</datalist>
          <datalist id="dl-sources">{sources.map((s) => <option key={s} value={s} />)}</datalist>
          <datalist id="dl-authors">{authors.map((a) => <option key={a} value={a} />)}</datalist>
        </div>
      )}

      <style>{`
        .a-photos-scroll {
          width: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          max-height: calc(100vh - 330px);
          max-height: calc(100dvh - 330px);
          min-height: 320px;
          border: 1px solid var(--cr3, #ddd);
        }
        .a-photos-table { user-select: none; width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0; }
        .a-photos-table thead th {
          position: sticky; top: 0; z-index: 5;
          background: var(--cr, #f5f0e8);
          box-shadow: 0 1px 0 var(--cr3, #ddd);
        }
        .admin-filters, .admin-filters-left { flex-wrap: wrap; gap: 0.5rem; }
        .admin-filters-left .a-input, .admin-filters-left .a-select { max-width: 100%; }
        .a-bulk input.a-input { flex: 1 1 140px; min-width: 0; }
        @media (max-width: 1200px) {
          .a-photos-table th:nth-child(7), .a-photos-table td:nth-child(7),
          .a-photos-table th:nth-child(8), .a-photos-table td:nth-child(8) { display: none; }
        }
        @media (max-width: 960px) {
          .a-photos-table th:nth-child(5), .a-photos-table td:nth-child(5),
          .a-photos-table th:nth-child(6), .a-photos-table td:nth-child(6),
          .a-photos-table th:nth-child(10), .a-photos-table td:nth-child(10) { display: none; }
        }
        @media (max-width: 680px) {
          .a-photos-table th:nth-child(4), .a-photos-table td:nth-child(4),
          .a-photos-table th:nth-child(9), .a-photos-table td:nth-child(9) { display: none; }
          .admin-filters { flex-direction: column; align-items: stretch; }
          .admin-filters-left > * { flex: 1 1 100%; }
          .a-act-row { flex-wrap: wrap; }
        }
      `}</style>

      <div className="a-photos-scroll">
      <table className="a-table a-photos-table">
        <thead>
          <tr>
            <th className="a-th" style={{ width: '32px' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? onClearSelection() : onSelectAll(filteredIds))}
                aria-label="Tout sélectionner"
              />
            </th>
            <th className="a-th" style={{ width: '64px' }}>Aperçu</th>
            {sortableTh('title', 'Titre')}
            {sortableTh('periode', 'Période')}
            {sortableTh('collection', 'Collection')}
            {sortableTh('source', 'Source')}
            {sortableTh('date_approx', 'Date')}
            {sortableTh('ref_code', 'Référence')}
            {sortableTh('status', 'Statut')}
            {sortableTh('featured', 'En avant')}
            <th className="a-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!sorted.length ? (
            <tr>
              <td colSpan={11} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--ink3)' }}>
                Aucune photo trouvée.
              </td>
            </tr>
          ) : (
            sorted.map((p) => {
              const checked = selectedIds.includes(p.id)
              return (
                <tr className="a-tr" key={p.id} style={checked ? { background: 'rgba(0,0,0,0.04)' } : undefined}>
                  <td className="a-td">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      onClick={(e) => handleCheckClick(e, p.id)}
                    />
                  </td>
                  <td className="a-td">
                    <div className="a-thumb" style={{ backgroundImage: `url('${p.image_url}')` }} />
                  </td>
                  <td className="a-td" style={{ maxWidth: '210px' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.3, display: 'block' }}>{p.title}</span>
                    {p.author && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--ink3)' }}>{p.author}</span>}
                  </td>
                  <td className="a-td">{p.periode || '—'}</td>
                  <td className="a-td">{p.collection || '—'}</td>
                  <td className="a-td">{p.source || '—'}</td>
                  <td className="a-td">{p.date_approx}</td>
                  <td className="a-td" style={{ fontSize: '0.58rem', color: 'var(--ink3)' }}>{p.ref_code}</td>
                  <td className="a-td">
                    <span className={`a-badge ${p.status === 'pub' ? 'a-pub' : 'a-draft'}`}>
                      {p.status === 'pub' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="a-td">
                    <button
                      className="a-act"
                      disabled={togglingId === p.id}
                      style={{
                        background: p.featured ? 'var(--ink)' : 'none',
                        color: p.featured ? 'var(--cr)' : 'var(--ink3)',
                        borderColor: p.featured ? 'var(--ink)' : 'var(--cr3)',
                        minWidth: '52px',
                      }}
                      onClick={() => toggleFeatured(p.id, !!p.featured)}
                    >
                      {p.featured ? '★ Oui' : '☆ Non'}
                    </button>
                  </td>
                  <td className="a-td">
                    <div className="a-act-row">
                      <button className="a-act" onClick={() => openEdit(p.id)}>Modifier</button>
                      <button className="a-act del" onClick={() => onDelete(p.id, 'photos')}>Suppr.</button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onDone={onReload} toast={toast} />
      <EditModal photo={editPhoto} open={editOpen} onClose={() => setEditOpen(false)} onDone={onReload} toast={toast} />
    </>
  )
}