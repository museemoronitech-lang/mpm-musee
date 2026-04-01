'use client'

interface AdminSidebarProps {
  activeSection: string
  onSection: (id: string) => void
  onLogout: () => void
}

const CONTENT_LINKS = [
  { id: 'photos', icon: '▣', label: 'Photographies' },
  { id: 'articles', icon: '≡', label: 'Articles' },
  { id: 'medias', icon: '▷', label: 'Médias' },
]

const MGMT_LINKS = [
  { id: 'admins', icon: '◎', label: 'Administrateurs' },
  { id: 'params', icon: '⚙', label: 'Paramètres' },
]

export default function AdminSidebar({ activeSection, onSection, onLogout }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sb-section">Contenu</div>
      {CONTENT_LINKS.map((l) => (
        <div
          key={l.id}
          className={`admin-sb-link${activeSection === l.id ? ' active' : ''}`}
          onClick={() => onSection(l.id)}
        >
          <span className="admin-sb-ico">{l.icon}</span> {l.label}
        </div>
      ))}
      <div className="admin-sb-section" style={{ marginTop: '1rem' }}>Gestion</div>
      {MGMT_LINKS.map((l) => (
        <div
          key={l.id}
          className={`admin-sb-link${activeSection === l.id ? ' active' : ''}`}
          onClick={() => onSection(l.id)}
        >
          <span className="admin-sb-ico">{l.icon}</span> {l.label}
        </div>
      ))}
      <div className="admin-sb-user">
        <div className="admin-sb-user-name">Administrateur</div>
        <div className="admin-sb-user-role">Accès complet</div>
        <button className="admin-sb-logout" onClick={onLogout}>Déconnexion →</button>
      </div>
    </aside>
  )
}
