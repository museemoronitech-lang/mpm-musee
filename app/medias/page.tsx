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
          {medias.length ? medias.map(m => (
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
          )) : (
            <>
              <div className="mitem">
                <div>
                  <div className="mitem-type">Témoignage Audio · 2024</div>
                  <div className="mitem-title">Récit de vie — Mme Saïda Omar, née 1925</div>
                  <div className="mitem-desc">Née à Moroni, récit de son enfance dans la médina.</div>
                  <div className="mitem-dur" style={{ marginTop: '0.5rem' }}>38 min · MP3</div>
                </div>
                <div className="mitem-play"><div className="mitem-play-icon"></div></div>
              </div>
              <div className="mitem">
                <div>
                  <div className="mitem-type">Documentaire · 2023</div>
                  <div className="mitem-title">Ngazidja 1900–1950 : une île en évolution</div>
                  <div className="mitem-desc">Documentaire retraçant les transformations de Ngazidja.</div>
                  <div className="mitem-dur" style={{ marginTop: '0.5rem' }}>22 min · HD</div>
                </div>
                <div className="mitem-play"><div className="mitem-play-icon"></div></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}