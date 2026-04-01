import type { PeriodeData, AuthorData } from '@/types'

export const PERIODES_DATA: Record<string, PeriodeData> = {
  sultanats: {
    kicker: 'Avant 1912',
    title: 'Sultanats',
    desc: "Les archives photographiques des sultanats comoriens témoignent d'une époque de grande splendeur architecturale et culturelle. Les premières photographies capturent les fastes des cours sultanales et l'architecture unique des médinas.",
    sub: [
      { name: 'Sultanat de Bambao', meta: 'Grande Comore · 84 photographies' },
      { name: 'Sultanat de Hamahamet', meta: 'Grande Comore · 62 photographies' },
      { name: "Sultanat d'Anjouan", meta: 'Ndzuwani · 102 photographies' },
    ],
  },
  coloniale: {
    kicker: '1912 — 1975',
    title: 'Époque Coloniale',
    desc: "La période coloniale française est la mieux documentée photographiquement. Les archives administratives, les missions scientifiques et les studios de portraitistes locaux ont produit un corpus extraordinaire couvrant six décennies de transformations.",
    sub: [
      { name: 'Archives administratives', meta: '1912–1945 · 423 photographies' },
      { name: 'Studios de portraitistes', meta: '1930–1970 · 380 photographies' },
      { name: 'Archives scientifiques', meta: '1920–1960 · 301 photographies' },
    ],
  },
  independance: {
    kicker: '1975 — 1995',
    title: 'Post-Indépendance',
    desc: "Après l'indépendance de 1975, une photographie comorienne authentique émerge. Des photographes locaux documentent les premières décennies de la nation et sa modernisation progressive.",
    sub: [
      { name: 'Archives nationales', meta: '1975–1985 · 412 photographies' },
      { name: 'Photographes comoriens', meta: '1978–1995 · 356 photographies' },
      { name: 'Presse locale', meta: '1980–1995 · 280 photographies' },
    ],
  },
}

export const PERIODE_MAP: Record<string, string> = {
  sultanats: 'Sultanats',
  coloniale: 'Époque Coloniale',
  independance: 'Post-Indépendance',
}

export const AUTHORS_DATA: AuthorData[] = [
  { id: 'humblot', name: 'Leon Humblot', dates: '1852–1914', count: '124 photographies', periode: '1880–1900' },
  { id: 'studio', name: 'Studio Colonial', dates: '1912–1940', count: '348 photographies', periode: '1912–1940' },
  { id: 'vienne', name: 'H. de Vienne', dates: '1870–1935', count: '87 photographies', periode: '1895–1920' },
  { id: 'cndrs', name: 'Archives CNDRS', dates: '1975–1995', count: '412 photographies', periode: '1975–1995' },
  { id: 'prive', name: 'Collections privées', dates: '1930–1995', count: '267 photographies', periode: '1930–1990' },
  { id: 'anon', name: 'Photographes anonymes', dates: '1880–1975', count: '1162 photographies', periode: '1880–1975' },
]

export const TICKER_ITEMS = [
  '2 400 photographies archivées',
  'Moroni · Ngazidja',
  'Archives 1880–1995',
  'En partenariat avec le CNDRS',
  'Musée de la Photographie de Moroni',
  'Initiative Medina Wiratha',
]
