'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

export default function ImageUploader({ value, onChange }: { value: string, onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
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
    onChange(data.publicUrl)
    setUploading(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <FiX size={18} />
            </button>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Replace image
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative w-full h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-gray-400">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <FiImage size={32} />
                <span className="text-sm font-medium">
                  {dragActive ? 'Drop image here' : 'Click or drag image here'}
                </span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </>
            )}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={uploading}
        className="hidden"
      />
    </div>
  )
}
