import { fetchArticles } from '@/lib/queries'
import Link from 'next/link'

export default async function ArticlesPage() {
  const articles = await fetchArticles()

  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="ctx-back-bar">
        <Link className="ctx-back-btn" href="/">← Accueil</Link>
        <span className="ctx-back-crumb">Articles</span>
      </div>
      <div className="page-banner">
        <div className="page-banner-h1">Articles</div>
        <p className="page-banner-sub">Analyses historiques, récits et contextes pour donner vie aux archives photographiques des Comores.</p>
      </div>
      <div className="art-section" style={{ padding: '3rem 0' }}>
        <div className="art-grid-layout">
          {articles.map(a => (
            <div className="art-item reveal" key={a.id}>
              <div className="art-kicker">{a.category || 'Article'}</div>
              <h3 className="art-h">{a.title}</h3>
              <p className="art-p">{a.content?.slice(0, 120)}...</p>
              <button className="btn-outline-dark" style={{ fontSize: '0.6rem', padding: '0.55rem 1.2rem', marginTop: '1rem' }}>
                Lire l'article →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}