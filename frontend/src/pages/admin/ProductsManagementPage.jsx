import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Plus, Pencil, Trash2, Upload, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import { uploadImage } from '../../utils/uploadImage'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const ProductsManagementPage = () => {
  const { getToken } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false)
  const [selectedFeatured, setSelectedFeatured] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    price: '',
    description: '',
    features: [],
    category_id: '',
    tags: [],
    image_url: '',
    stock: 100,
    is_featured: false
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    // Update selected featured when products change
    const featured = products.filter(p => p.is_featured === true).map(p => p.id)
    setSelectedFeatured(featured)
  }, [products])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const toggleFeatured = async (product) => {
    const currentlyFeatured = products.filter(p => p.is_featured === true)
    
    // Check if trying to add more than 4 featured products
    if (!product.is_featured && currentlyFeatured.length >= 4) {
      toast.error('Maximum 4 products can be featured. Remove one first.')
      return
    }

    try {
      const token = await getToken()
      await axios.put(
        `${API}/products/${product.id}`,
        { ...product, is_featured: !product.is_featured },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(product.is_featured ? 'Removed from featured' : 'Added to featured!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update featured status')
    }
  }

  const toggleFeaturedSelection = (productId) => {
    if (selectedFeatured.includes(productId)) {
      setSelectedFeatured(selectedFeatured.filter(id => id !== productId))
    } else {
      if (selectedFeatured.length >= 4) {
        toast.error('Maximum 4 products can be featured')
        return
      }
      setSelectedFeatured([...selectedFeatured, productId])
    }
  }

  const saveFeaturedProducts = async () => {
    try {
      const token = await getToken()
      
      // Update all products
      for (const product of products) {
        const shouldBeFeatured = selectedFeatured.includes(product.id)
        if (product.is_featured !== shouldBeFeatured) {
          await axios.put(
            `${API}/products/${product.id}`,
            { ...product, is_featured: shouldBeFeatured },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }
      }

      toast.success('Featured products updated!')
      setFeaturedModalOpen(false)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update featured products')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim())
      }

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Product updated!')
      } else {
        await axios.post(`${API}/products`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Product created!')
      }

      fetchProducts()
      setOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    const result = await uploadImage(file)
    setUploading(false)

    if (result.success) {
      setFormData({ ...formData, image_url: result.url })
      toast.success('Image uploaded successfully!')
    } else {
      toast.error('Failed to upload image: ' + result.error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const token = await getToken()
      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Product deleted!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      weight: '',
      price: '',
      description: '',
      features: [],
      category_id: '',
      tags: [],
      image_url: '',
      stock: 0
    })
    setEditingProduct(null)
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setFormData(product)
    setOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#2D4A3E]">Manage Products</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setFeaturedModalOpen(true)}
              className="bg-[#D4A017] text-white hover:bg-[#D4A017]/90 rounded-full"
            >
              <Star className="mr-2 h-4 w-4" />
              Edit Featured Products
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-[#2D4A3E] text-white rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Weight (e.g., 250g)"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  required
                />
                <Input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
                <Input
                  placeholder="Features (comma-separated)"
                  value={formData.features.join(', ')}
                  onChange={(e) => setFormData({...formData, features: e.target.value.split(',').map(f => f.trim())})}
                />
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({...formData, category_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Tags (comma-separated, e.g., bestseller, trending)"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Image</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img src={formData.image_url} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-[#2D4A3E] text-white">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-4 rounded-2xl">
              <div className="aspect-square bg-[#F3EFE6] rounded-lg mb-4 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#2D4A3E] opacity-40">No Image</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-[#2D4A3E] mb-1">{product.name}</h3>
              <p className="text-sm text-[#666666] mb-2">{product.weight} - ₹{product.price}</p>
              {product.is_featured && (
                <span className="inline-block text-xs bg-[#D4A017]/10 text-[#D4A017] px-2 py-1 rounded-full mb-2">
                  Featured
                </span>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(product)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Products Modal */}
        <Dialog open={featuredModalOpen} onOpenChange={setFeaturedModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Select Featured Products (Max 4)</DialogTitle>
              <p className="text-sm text-gray-600">
                Currently selected: {selectedFeatured.length}/4
              </p>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => toggleFeaturedSelection(product.id)}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                    selectedFeatured.includes(product.id)
                      ? 'border-[#D4A017] bg-[#D4A017]/10'
                      : 'border-gray-200 hover:border-[#2D4A3E]'
                  }`}
                >
                  <div className="aspect-square bg-[#F3EFE6] rounded-lg mb-2 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#2D4A3E] opacity-40 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-[#2D4A3E] mb-1">{product.name}</h4>
                  <p className="text-xs text-[#666666]">{product.weight} - ₹{product.price}</p>
                  {selectedFeatured.includes(product.id) && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-[#D4A017] text-[#D4A017]" />
                      <span className="text-xs text-[#D4A017] font-medium">Featured</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setFeaturedModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveFeaturedProducts}
                className="bg-[#2D4A3E] text-white"
              >
                Save Featured Products
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProductsManagementPage
