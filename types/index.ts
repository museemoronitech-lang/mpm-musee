export interface Photo {
  id: string
  title: string
  image_url: string
  date_approx: string
  periode: string
  ref_code: string
  status: 'pub' | 'draft'
  author: string
  context: string
  created_at: string
}

export interface Article {
  id: string
  title: string
  content: string
  cover_url: string
  attachment_url: string
  status: 'pub' | 'draft'
  category: string
  created_at: string
}

export interface Media {
  id: string
  title: string
  description: string
  type: string
  file_url: string
  duration: string
  status: 'pub' | 'draft'
  created_at: string
}

export interface PeriodeData {
  kicker: string
  title: string
  desc: string
  sub: { name: string; meta: string }[]
}

export interface AuthorData {
  id: string
  name: string
  dates: string
  count: string
  periode: string
}
