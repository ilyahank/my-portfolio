'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ThemeLoader() {
  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'theme').single().then(({ data }) => {
      if (data?.value) {
        const t = data.value
        document.documentElement.style.setProperty('--primary-color', t.primaryColor)
        document.documentElement.style.setProperty('--background-color', t.backgroundColor)
        document.documentElement.style.setProperty('--text-color', t.textColor)
        document.documentElement.style.setProperty('--accent-color', t.accentColor)
      }
    })
  }, [])
  return null
}
