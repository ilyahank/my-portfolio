'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MultiImageUploader({ value, onChange }: { value: string[], onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const images = value || []

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('portfolio-images').upload(fileName, file)
    if (error) {
      alert('Upload failed: ' + error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)
    onChange([...images, data.publicUrl])
    setUploading(false)
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {images.map((url, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <img src={url} alt={`img-${i}`} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 6 }} />
            <button
              onClick={() => removeImage(i)}
              style={{ position: 'absolute', top: -6, right: -6, background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p style={{ fontSize: 12, color: '#666' }}>Uploading...</p>}
    </div>
  )
}
