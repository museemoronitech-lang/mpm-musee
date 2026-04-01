const WORKER_UPLOAD_URL = process.env.NEXT_PUBLIC_WORKER_UPLOAD_URL!

export async function uploadFileToR2(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const slug = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 60)
  const key = `${Date.now()}-${slug}.${ext}`

  if (onProgress) onProgress(20)

  const response = await fetch(`${WORKER_UPLOAD_URL}/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: await file.arrayBuffer(),
  })

  if (!response.ok) throw new Error(`Erreur upload: ${response.status}`)
  if (onProgress) onProgress(100)

  const data = await response.json()
  return data.url
}
