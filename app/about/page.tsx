import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="ctx-back-bar">
        <Link className="ctx-back-btn" href="/">← Accueil</Link>
        <span className="ctx-back-crumb">L&apos;Association</span>
      </div>

      {/* HERO */}
      <div className="about-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/Logo_Medina_Wiratha.png"
          alt=""
          aria-hidden="true"
          width={600}
          height={600}
          style={{
            position: 'absolute',
            right: 'calc(-4rem + 6vw)',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.06,
            pointerEvents: 'none',
            userSelect: 'none',
            width: 'clamp(280px, 45vw, 560px)',
            height: 'auto',
            filter: 'brightness(0) invert(1)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="about-hero-eyebrow">Association Medina Wiratha · Fondée août 2024</div>
          <div className="about-hero-title">Préserver<br /><span>l&apos;héritage</span><br />visuel</div>
          <p className="about-hero-sub">
            Le Musée de la Photographie de Moroni est un projet culturel initié par Médina Wiratha
            pour protéger et valoriser le patrimoine historique et visuel des Comores.
          </p>
        </div>
      </div>

      {/* STATS STRIP */}
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
          <div className="about-intro-n">Moroni</div>
          <div className="about-intro-l">Siège de l&apos;association</div>
        </div>

      </div>

      {/* IDENTITÉ */}
      <div className="about-identity">
        <div className="about-identity-text">
          <div className="about-section-label">Notre identité</div>
          <div className="about-identity-title">Médina Wiratha</div>
          <p className="about-identity-p">
            Médina Wiratha, dont le nom signifie littéralement <strong>« la Médina en héritage »</strong>,
            est une association culturelle fondée en août 2024 pour protéger et sauvegarder
            le patrimoine historique de la commune de Moroni.
          </p>
          <p className="about-identity-p">
            Elle s&apos;inscrit dans la dynamique d&apos;inscription des médinas comoriennes au patrimoine
            mondial de l&apos;UNESCO et regroupe des cadres ayant traité les questions relatives
            au patrimoine dans un cadre professionnel ou associatif, ainsi que des passionnés
            animés par leur amour de la Médina de Moroni.
          </p>
          <Link className="btn-outline-dark" href="/collections" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Explorer les archives →
          </Link>
        </div>
        <div className="about-identity-visual">
          <div className="about-obj-list">
            {[
              { n: '01', title: 'Préserver', desc: 'Identifier les sites à sauvegarder et numériser les photographies historiques des Comores.' },
              { n: '02', title: 'Documenter', desc: 'Contextualiser chaque image avec des métadonnées rigoureuses : date, lieu, auteur, contexte.' },
              { n: '03', title: 'Valoriser', desc: "Organiser des activités culturelles et développer les Industries Culturelles et Créatives au sein de la médina." },
              { n: '04', title: 'Transmettre', desc: "Léguer cet héritage visuel et bâti aux générations futures des Comores." },
            ].map(obj => (
              <div className="about-obj-item" key={obj.n}>
                <div className="about-obj-n">{obj.n}</div>
                <div className="about-obj-text"><strong>{obj.title}</strong> — {obj.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="about-identity" style={{ flexDirection: 'column', gap: '2rem' }}>
        <div className="about-section-label">Nos actions</div>
        <div className="about-identity-title" style={{ fontSize: '1.6rem' }}>Ce que nous faisons sur le terrain</div>
        <p className="about-identity-p">
          Médina Wiratha organise chaque année les <strong>Journées de la Médina</strong>, un événement
          culturel au cœur de Moroni réunissant habitants, institutions et délégations internationales
          autour du patrimoine de la ville. Ces journées ont confirmé l&apos;importance de créer des espaces
          dédiés à la culture et de renforcer le lien entre les riverains et leur patrimoine historique.
        </p>
        <div className="about-obj-list">
          {[
            { n: '→', title: 'Exposition photo', desc: "Retraçant l'évolution de Moroni à travers l'image, dans des bâtiments symboliques au cœur de la médina." },
            { n: '→', title: 'Danses traditionnelles', desc: "Animation des places historiques de la médina en présence des autorités locales et du public." },
            { n: '→', title: 'Pose de plaques', desc: "Identification progressive des quartiers historiques : Gaadju, Shashanyongo, Mfubani et autres." },
            { n: '→', title: 'Café éphémère', desc: "Création d'espaces de rencontres et d'échanges dans des lieux patrimoniaux de la médina." },
          ].map(obj => (
            <div className="about-obj-item" key={obj.title}>
              <div className="about-obj-n">{obj.n}</div>
              <div className="about-obj-text"><strong>{obj.title}</strong> — {obj.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTIONS */}
      <div className="about-identity" style={{ flexDirection: 'column', gap: '2rem' }}>
        <div className="about-section-label">Projections</div>
        <div className="about-identity-title" style={{ fontSize: '1.6rem' }}>Ce que nous construisons</div>
        <p className="about-identity-p">
          En parallèle aux actions menées, l&apos;association développe plusieurs projets structurants
          pour la médina de Moroni, en lien avec le processus d&apos;inscription au patrimoine mondial de l&apos;UNESCO.
        </p>
        <div className="about-obj-list">
          {[
            { n: '01', title: 'Musée de la photographie', desc: "Une galerie d'art et un café concept à Mtsangani, en partenariat avec Seaview Artwork et l'iconothèque de l'Océan Indien." },
            { n: '02', title: "Musée d'histoire de la ville", desc: "Couplé à un café-restaurant et une galerie d'exposition, en partenariat avec les héritiers de la famille Alwahti." },
            { n: '03', title: 'Mosquée de Mtsangani', desc: "Restauration et agrandissement de la mosquée du 18ème siècle, en partenariat avec son comité de gestion." },
            { n: '04', title: 'Maison El Maarouf', desc: "Restauration de la maison familiale pour en faire un musée accessible, préservant l'héritage de la Confrérie Shadhuliya." },
          ].map(obj => (
            <div className="about-obj-item" key={obj.n}>
              <div className="about-obj-n">{obj.n}</div>
              <div className="about-obj-text"><strong>{obj.title}</strong> — {obj.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ÉQUIPE */}
      <div className="about-identity" style={{ flexDirection: 'column', gap: '2rem' }}>
        <div className="about-section-label">Équipe Projet</div>
        <div className="about-identity-title" style={{ fontSize: '1.6rem' }}>Celles et ceux qui portent le projet</div>
        <div className="about-obj-list">
          {[
            { n: '01', title: 'Faniya Abbas', desc: 'Directrice de projet' },
            { n: '02', title: 'Nadia Tourqui', desc: 'Responsable Mobilisation des ressources' },
            { n: '03', title: 'Karina Moilime', desc: 'Responsable Café Éphémère' },
            { n: '04', title: 'Ali Ahmed Mahamoud', desc: 'Responsable Communication & Scénographie' },
            { n: '05', title: 'Ali Mohamed Djalim & Yakina Mohamed Djelane', desc: "Commissaires d'exposition" },
          ].map(obj => (
            <div className="about-obj-item" key={obj.n}>
              <div className="about-obj-n">{obj.n}</div>
              <div className="about-obj-text"><strong>{obj.title}</strong> — {obj.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTENAIRES */}
      <div className="about-partners">
        <div className="about-partners-title">Partenaires & Soutiens</div>
        <p className="about-partners-sub">EN COLLABORATION AVEC</p>
        <div className="about-partners-grid">
          {[
            'Mairie de Moroni', 'CNDRS', 'Gouvernorat de Ngazidja',
            'Collectif du Patrimoine des Comores', 'Zanzibar Stone Town Heritage Society',
            'Le Fonds Pobeguin', 'Musée du Quai Branly',
          ].map(p => (
            <div className="about-partner-tag" key={p}>{p}</div>
          ))}
        </div>
      </div>

      {/* CTA FACEBOOK */}
      <div className="about-fb-cta">
        <div>
          <div className="about-fb-label">Suivre l&apos;association</div>
          <div className="about-fb-title">Médina Wiratha<br />sur Facebook</div>
          <p className="about-fb-sub">Actualités, événements et actions de l&apos;association directement sur notre page.</p>
        </div>
        <a
          href="https://www.facebook.com/profile.php?id=61572712168337"
          target="_blank"
          rel="noopener noreferrer"
          className="about-fb-btn"
        >
          <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Nous suivre
        </a>
      </div>

    </div>
  )
}
