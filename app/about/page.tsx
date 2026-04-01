import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="ctx-back-bar">
        <Link className="ctx-back-btn" href="/">← Accueil</Link>
        <span className="ctx-back-crumb">L'Association</span>
      </div>
      <div className="about-hero">
        <div className="about-hero-eyebrow">Association Medina Wiratha · Fondée 2024</div>
        <div className="about-hero-title">Préserver<br /><span>l'héritage</span><br />visuel</div>
        <p className="about-hero-sub">Le Musée de la Photographie de Moroni est un projet culturel initié par Médina Wiratha pour protéger et valoriser le patrimoine historique des Comores.</p>
      </div>
      <div className="about-intro-strip">
        <div className="about-intro-strip-item">
          <div className="about-intro-n">1880</div>
          <div className="about-intro-l">Première archive</div>
        </div>
        <div className="about-intro-strip-sep"></div>
        <div className="about-intro-strip-item">
          <div className="about-intro-n">2024</div>
          <div className="about-intro-l">Année de fondation</div>
        </div>
        <div className="about-intro-strip-sep"></div>
        <div className="about-intro-strip-item">
          <div className="about-intro-n">2+</div>
          <div className="about-intro-l">Îles documentées</div>
        </div>
      </div>
      <div className="about-identity">
        <div className="about-identity-text">
          <div className="about-section-label">Notre identité</div>
          <div className="about-identity-title">Médina Wiratha</div>
          <p className="about-identity-p">
            Médina Wiratha, dont le nom signifie littéralement <strong>« la Médina en héritage »</strong>, 
            s'inscrit dans la dynamique d'inscription des médinas comoriennes au patrimoine mondial de l'UNESCO.
          </p>
          <p className="about-identity-p">
            Chaque image est un document historique, un témoignage irremplaçable. Nous documentons chaque photo — 
            date, lieu, auteur, contexte — pour transmettre ce patrimoine aux générations futures.
          </p>
          <Link className="btn-outline-dark" href="/collections" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Explorer les archives →
          </Link>
        </div>
        <div className="about-identity-visual">
          <div className="about-obj-list">
            {[
              { n: '01', title: 'Préserver', desc: 'Numériser et archiver les photographies historiques des Comores.' },
              { n: '02', title: 'Documenter', desc: 'Contextualiser chaque image avec des métadonnées rigoureuses.' },
              { n: '03', title: 'Valoriser', desc: 'Rendre accessible ce patrimoine au public et aux chercheurs.' },
              { n: '04', title: 'Transmettre', desc: 'Léguer cet héritage visuel aux générations futures.' },
            ].map(obj => (
              <div className="about-obj-item" key={obj.n}>
                <div className="about-obj-n">{obj.n}</div>
                <div className="about-obj-text"><strong>{obj.title}</strong> — {obj.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="about-partners">
        <div className="about-partners-title">Partenaires</div>
        <p className="about-partners-sub">EN COLLABORATION AVEC</p>
        <div className="about-partners-grid">
          {['CNDRS', 'UNESCO', 'Ville de Moroni', 'Diaspora Comorienne'].map(p => (
            <div className="about-partner-tag" key={p}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  )
}