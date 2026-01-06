import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const CategoriesManagementPage = () => {
  const { getToken } = useAuth()
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      if (editing) {
        await axios.put(`${API}/categories/${editing.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Category updated!')
      } else {
        await axios.post(`${API}/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Category created!')
      }
      fetchCategories()
      setOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const token = await getToken()
      await axios.delete(`${API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Category deleted!')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditing(null)
  }

  const startEdit = (category) => {
    setEditing(category)
    setFormData({ name: category.name, description: category.description || '' })
    setOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#2D4A3E]">Manage Categories</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-[#2D4A3E] text-white rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit' : 'Add'} Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <Button type="submit" className="w-full bg-[#2D4A3E] text-white">
                  {editing ? 'Update' : 'Create'} Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="p-6 rounded-2xl">
              <h3 className="font-semibold text-xl text-[#2D4A3E] mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-[#666666] mb-4">{category.description}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(category)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesManagementPage
