'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'
import MultiImageUploader from '@/components/MultiImageUploader'
import {
  FiFolder,
  FiTool,
  FiBriefcase,
  FiAward,
  FiShare2,
  FiMessageSquare,
  FiStar,
  FiSettings,
  FiGithub,
  FiLogOut, 
  FiPlus, 
  FiTrash2, 
  FiSave,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: FiUser, group: 'Content' },
  { id: 'siteSettings', label: 'Site Settings', icon: FiSettings, group: 'Content' },
  { id: 'goals', label: 'Goals', icon: FiStar, group: 'Content' },
  { id: 'projects', label: 'Projects', icon: FiFolder, group: 'Content' },
  { id: 'skills', label: 'Skills', icon: FiTool, group: 'Content' },
  { id: 'companies', label: 'Companies', icon: FiBriefcase, group: 'Content' },
  { id: 'institutions', label: 'Education', icon: FiAward, group: 'Content' },
  { id: 'socialMedia', label: 'Social Links', icon: FiShare2, group: 'Content' },
  { id: 'greetings', label: 'Greetings', icon: FiMessageSquare, group: 'Content' },
  { id: 'highlights', label: 'Highlights', icon: FiStar, group: 'Content' },
  { id: 'featuredRepositories', label: 'Featured Repos', icon: FiGithub, group: 'Content' },
  { id: 'openSourceProjects', label: 'Open Source', icon: FiGithub, group: 'Content' },
  { id: 'theme', label: 'Theme & Colors', icon: FiSettings, group: 'Settings' },
]

const IMAGE_FIELDS = ['logo', 'image']
const MULTI_IMAGE_FIELDS = ['images']

const EMPTY_ITEM: Record<string, any> = {
  profile: { name: '', role: '', location: '', bioLine1: '', bioLine2: '' },
  siteSettings: { copyrightName: '', goalsHeading: '', repositoriesHeading: '', projectsHeading: '', projectsDescription: '', openSourceHeading: '', openSourceDescription: '' },
  goals: { heading: '', items: [{ id: Date.now(), text: '' }] },
  companies: { institution: '', logo: '', degree: '', startDate: '', endDate: '' },
  institutions: { institution: '', logo: '', degree: '', startDate: '', endDate: '' },
  socialMedia: { label: '', url: '' },
  highlights: { text: '' },
  skills: { name: '', logo: '' },
  greetings: { text: '', lang: '' },
  projects: { title: '', des: '', tags: [], url: '', images: [] },
  featuredRepositories: { title: '', url: '', stars: 0, forks: 0, description: '', tags: [] },
  openSourceProjects: { title: '', description: '', url: '', stars: 0, forks: 0, tags: [] }
}

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')
  const [items, setItems] = useState<any[]>([])
  const [theme, setTheme] = useState<any>({ primaryColor: '#0070f3', backgroundColor: '#0a0a0a', textColor: '#ffffff', accentColor: '#333333' })
  const [saveMsg, setSaveMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
      else { setLoading(false); loadSection('projects') }
    })
  }, [])

  const loadSection = async (tab: string) => {
    setActiveTab(tab)
    setSaveMsg('')
    setSidebarOpen(false)
    if (tab === 'theme') {
      const { data } = await supabase.from('site_content').select('value').eq('key', 'theme').single()
      if (data?.value) setTheme(data.value)
      return
    }
    if (tab === 'profile' || tab === 'siteSettings') {
      const { data } = await supabase.from('site_content').select('value').eq('key', tab).single()
      setItems(data?.value ? [data.value] : [EMPTY_ITEM[tab]])
      return
    }
    if (tab === 'goals') {
      const { data } = await supabase.from('site_content').select('value').eq('key', tab).single()
      setItems(data?.value?.items || EMPTY_ITEM.goals.items)
      return
    }
    const { data } = await supabase.from('site_content').select('value').eq('key', tab).single()
    setItems(data?.value || [])
  }

  const updateField = (index: number, field: string, value: string | string[]) => {
    const copy = [...items]
    if (field === 'tags' || field === 'items') copy[index][field] = Array.isArray(value) ? value : value.split(',').map(t => t.trim()).filter(Boolean)
    else copy[index][field] = value
    setItems(copy)
  }

  const updateRepoName = (index: number, value: string) => {
    const copy = [...items]
    copy[index] = value
    setItems(copy)
  }

  const addItem = () => {
    const newItem = { ...EMPTY_ITEM[activeTab] }
    // Add unique ID for array-based sections
    if (activeTab !== 'profile' && activeTab !== 'siteSettings' && activeTab !== 'goals') {
      newItem.id = Date.now()
      if (activeTab === 'greetings') {
        newItem.key = Date.now()
      }
    } else if (activeTab === 'goals') {
      newItem.id = Date.now()
    }
    setItems([...items, newItem])
  }
  const deleteItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const save = async () => {
    setSaving(true)
    let valueToSave = activeTab === 'theme' ? theme : items
    if (activeTab === 'profile' || activeTab === 'siteSettings') {
      valueToSave = items[0]
    } else if (activeTab === 'goals') {
      valueToSave = { heading: items[0]?.heading || '', items: items }
    }
    const { error } = await supabase
      .from('site_content')
      .upsert({ key: activeTab, value: valueToSave, updated_at: new Date().toISOString() })
    setSaving(false)
    setSaveMsg(error ? '❌ ' + error.message : '✅ Saved!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  const fieldsFor = (item: any) => Object.keys(item).filter(k => k !== 'id' && k !== 'key')
  const activeSection = SECTIONS.find(s => s.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg border border-gray-700 text-gray-300"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FiSettings className="text-blue-500" />
              Portfolio Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {['Content', 'Settings'].map(group => (
              <div key={group}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  {group}
                </h3>
                <div className="space-y-1">
                  {SECTIONS.filter(s => s.group === group).map(section => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => loadSection(section.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                          ${activeTab === section.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                          }
                        `}
                      >
                        <Icon size={18} />
                        {section.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
            >
              <FiLogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                {activeSection && <activeSection.icon size={20} className="text-blue-500" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{activeSection?.label}</h2>
                <p className="text-xs text-gray-500">Manage your portfolio content</p>
              </div>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FiSave size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {saveMsg && (
            <div className={`px-6 pb-4 ${saveMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {saveMsg}
            </div>
          )}
        </header>

        {/* Content area */}
        <div className="p-6">
          {activeTab === 'theme' ? (
            <div className="max-w-2xl">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Theme Colors</h3>
                <div className="space-y-4">
                  {Object.keys(theme).map(key => (
                    <div key={key} className="flex items-center gap-4">
                      <label className="w-40 text-sm text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={theme[key]}
                            onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700 bg-transparent"
                          />
                        </div>
                        <input
                          type="text"
                          value={theme[key]}
                          onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'goals' ? (
                <>
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Heading</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                        Heading
                      </label>
                      <input
                        value={items[0]?.heading || ''}
                        onChange={e => updateField(0, 'heading', e.target.value)}
                        placeholder="Enter heading..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Goal Items</h4>
                    <div className="space-y-4">
                      {items.map((item: any, i: number) => (
                        <div key={item.id || i} className="flex items-start gap-3">
                          <input
                            value={item.text || ''}
                            onChange={e => updateField(i, 'text', e.target.value)}
                            placeholder="Enter goal..."
                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => deleteItem(i)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addItem}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all"
                    >
                      <FiPlus size={20} />
                      Add Goal
                    </button>
                  </div>
                </>
              ) : activeTab === 'featuredRepositories' ? (
                <>
                  {items.map((item, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-500">
                          Repository #{i + 1}
                        </h4>
                        <button
                          onClick={() => deleteItem(i)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                      <div className="grid gap-4">
                        {fieldsFor(item).map(field => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            {IMAGE_FIELDS.includes(field) ? (
                              <ImageUploader value={item[field] || ''} onChange={url => updateField(i, field, url)} />
                            ) : field === 'des' || field === 'description' ? (
                              <textarea
                                value={item[field] || ''}
                                onChange={e => updateField(i, field, e.target.value)}
                                placeholder={`Enter ${field}...`}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              />
                            ) : (
                              <input
                                value={field === 'tags' ? (item[field] || []).join(', ') : (item[field] || '')}
                                onChange={e => updateField(i, field, e.target.value)}
                                placeholder={field === 'tags' ? 'comma, separated, tags' : `Enter ${field}...`}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addItem}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all"
                  >
                    <FiPlus size={20} />
                    Add Repository
                  </button>
                </>
              ) : (
                <>
                  {items.map((item, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-500">
                          {activeTab === 'profile' ? 'Profile Information' : activeTab === 'siteSettings' ? 'Site Settings' : `${activeTab.slice(0, -1) || activeTab} #${i + 1}`}
                        </h4>
                        {activeTab !== 'profile' && activeTab !== 'siteSettings' && (
                          <button
                            onClick={() => deleteItem(i)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4">
                        {fieldsFor(item).map(field => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            {MULTI_IMAGE_FIELDS.includes(field) ? (
                              <MultiImageUploader value={item[field] || []} onChange={urls => updateField(i, field, urls as any)} />
                            ) : IMAGE_FIELDS.includes(field) ? (
                              <ImageUploader value={item[field] || ''} onChange={url => updateField(i, field, url)} />
                            ) : field === 'des' || field === 'description' || field === 'bioLine1' || field === 'bioLine2' ? (
                              <textarea
                                value={item[field] || ''}
                                onChange={e => updateField(i, field, e.target.value)}
                                placeholder={`Enter ${field}...`}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              />
                            ) : (
                              <input
                                value={field === 'tags' ? (item[field] || []).join(', ') : (item[field] || '')}
                                onChange={e => updateField(i, field, e.target.value)}
                                placeholder={field === 'tags' ? 'comma, separated, tags' : `Enter ${field}...`}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {activeTab !== 'profile' && activeTab !== 'siteSettings' && (
                    <button
                      onClick={addItem}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all"
                    >
                      <FiPlus size={20} />
                      Add New {activeTab.slice(0, -1) || activeTab}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
