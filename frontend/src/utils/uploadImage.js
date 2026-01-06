import { supabase } from '../config/supabase'

export const uploadImage = async (file) => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: data.publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
}
