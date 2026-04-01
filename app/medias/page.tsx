import { fetchMedias } from '@/lib/queries'

export default async function MediasPage() {
  const medias = await fetchMedias()

  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="ctx-back-bar">
        <a className="ctx-back-btn" href="/">← Accueil</a>
        <span className="ctx-back-crumb">Médias</span>
      </div>
      <div className="page-banner">
        <div className="page-banner-h1">Médias</div>
        <p className="page-banner-sub">Témoignages audio, documentaires et archives sonores.</p>
      </div>
      <div className="media-section-layout reveal">
        <div className="media-list">
          {medias.map(m => (
            <div className="mitem" key={m.id}>
              <div>
                <div className="mitem-type">{m.type} · {new Date(m.created_at).getFullYear()}</div>
                <div className="mitem-title">{m.title}</div>
                <div className="mitem-desc">{m.description}</div>
                {m.duration && <div className="mitem-dur" style={{ marginTop: '0.5rem' }}>{m.duration}</div>}
              </div>
              <div className="mitem-play" onClick={() => m.file_url && window.open(m.file_url, '_blank')}>
                <div className="mitem-play-icon"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}