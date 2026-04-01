import { supabase } from '@/lib/supabase'
import type { Photo, Article, Media } from '@/types'

const PHOTO_SELECT = 'id,title,image_url,date_approx,periode,ref_code,status,author,context,created_at,featured'

function mapPhoto(p: Record<string, unknown>): Photo {
  return {
    id: p.id as string,
    title: (p.title as string) || 'Sans titre',
    image_url: (p.image_url as string) || '',
    date_approx: (p.date_approx as string) || '—',
    periode: (p.periode as string) || '',
    ref_code: (p.ref_code as string) || '—',
    status: (p.status as 'pub' | 'draft') || 'draft',
    author: (p.author as string) || '',
    context: (p.context as string) || '',
    created_at: p.created_at as string,
    featured: (p.featured as boolean) ?? false,
  }
}

export async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select(PHOTO_SELECT)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return (data || []).map(mapPhoto)
}

export async function fetchPhotoById(id: string): Promise<Photo | null> {
  const { data, error } = await supabase
    .from('photos')
    .select(PHOTO_SELECT)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapPhoto(data)
}

export async function fetchPhotosByPeriode(periode: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select(PHOTO_SELECT)
    .eq('status', 'pub')
    .eq('periode', periode)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return (data || []).map(mapPhoto)
}

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id,title,content,cover_url,attachment_url,status,category,created_at')
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data || []
}

export async function fetchMedias(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('medias')
    .select('id,title,description,type,file_url,duration,status,created_at')
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data || []
}

export async function fetchSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) return null
  return data.value
}

export async function upsertSetting(key: string, value: string): Promise<void> {
  await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
}
