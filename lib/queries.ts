import { supabase } from '@/lib/supabase'
import type { Photo, Article, Media } from '@/types'

export async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('id,title,image_url,date_approx,periode,ref_code,status,author,context,created_at,featured')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title || 'Sans titre',
    image_url: p.image_url || '',
    date_approx: p.date_approx || '—',
    periode: p.periode || '',
    ref_code: p.ref_code || '—',
    status: p.status || 'draft',
    author: p.author || '',
    context: p.context || '',
    created_at: p.created_at,
    featured: p.featured ?? false,
  }))
}

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id,title,content,cover_url,attachment_url,status,category,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data || []
}

export async function fetchMedias(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('medias')
    .select('id,title,description,type,file_url,duration,status,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

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
