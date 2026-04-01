import type { PeriodeData, AuthorData } from '@/types'

export const PERIODES_DATA: Record<string, PeriodeData> = {
  sultanats: {
    kicker: 'Avant 1912',
    title: 'Sultanats',
    desc: "Les archives photographiques des sultanats comoriens témoignent d'une époque de grande splendeur architecturale et culturelle. Les premières photographies capturent les fastes des cours sultanales et l'architecture unique des médinas.",
    sub: [],
  },
  coloniale: {
    kicker: '1912 — 1975',
    title: 'Époque Coloniale',
    desc: "La période coloniale française est la mieux documentée photographiquement. Les archives administratives, les missions scientifiques et les studios de portraitistes locaux ont produit un corpus extraordinaire couvrant six décennies de transformations.",
    sub: [],
  },
  independance: {
    kicker: '1975 — 1995',
    title: 'Post-Indépendance',
    desc: "Après l'indépendance de 1975, une photographie comorienne authentique émerge. Des photographes locaux documentent les premières décennies de la nation et sa modernisation progressive.",
    sub: [],
  },
}

export const PERIODE_MAP: Record<string, string> = {
  sultanats: 'Sultanats',
  coloniale: 'Époque Coloniale',
  independance: 'Post-Indépendance',
}

export const AUTHORS_DATA: AuthorData[] = []

export const TICKER_ITEMS = [
  '2 400 photographies archivées',
  'Moroni · Ngazidja',
  'Archives 1880–1995',
  'En partenariat avec le CNDRS',
  'Musée de la Photographie de Moroni',
  'Initiative Medina Wiratha',
]
