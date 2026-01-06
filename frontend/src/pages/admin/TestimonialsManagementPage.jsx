import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Plus, Trash2, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const TestimonialsManagementPage = () => {
  const { getToken } = useAuth()
  const [testimonials, setTestimonials] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`)
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      await axios.post(`${API}/testimonials`, {
        ...formData,
        rating: parseInt(formData.rating)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Testimonial added!')
      fetchTestimonials()
      setOpen(false)
      setFormData({ name: '', rating: 5, comment: '' })
    } catch (error) {
      toast.error('Failed to add testimonial')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const token = await getToken()
      await axios.delete(`${API}/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Testimonial deleted!')
      fetchTestimonials()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#2D4A3E]">Manage Testimonials</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2D4A3E] text-white rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Testimonial</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Customer Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Rating (1-5)"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  required
                />
                <Button type="submit" className="w-full bg-[#2D4A3E] text-white">
                  Add Testimonial
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 rounded-2xl">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#D4A017] text-[#D4A017]" />
                ))}
              </div>
              <p className="text-[#666666] mb-3">{testimonial.comment}</p>
              <p className="font-semibold text-[#2D4A3E] mb-4">{testimonial.name}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(testimonial.id)}
                className="text-red-600 hover:text-red-700 w-full"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsManagementPage
