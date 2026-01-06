import React, { useState, useEffect } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const ContentManagementPage = () => {
  const { getToken } = useAuth()
  const [aboutContent, setAboutContent] = useState('')
  const [privacyContent, setPrivacyContent] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [about, privacy] = await Promise.all([
        axios.get(`${API}/content/about`),
        axios.get(`${API}/content/privacy`)
      ])
      setAboutContent(about.data.content || '')
      setPrivacyContent(privacy.data.content || '')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateContent = async (page, content) => {
    try {
      const token = await getToken()
      await axios.put(`${API}/content/${page}`, { page, content }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`${page} page updated!`)
    } catch (error) {
      toast.error('Failed to update content')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Manage Content</h1>

        <div className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">About Us Page</h2>
            <Textarea
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button
              onClick={() => updateContent('about', aboutContent)}
              className="bg-[#2D4A3E] text-white"
            >
              Update About Us
            </Button>
          </Card>

          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">Privacy Policy Page</h2>
            <Textarea
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button
              onClick={() => updateContent('privacy', privacyContent)}
              className="bg-[#2D4A3E] text-white"
            >
              Update Privacy Policy
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContentManagementPage
