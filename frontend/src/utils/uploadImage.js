import { supabase } from '../config/supabase'

export const uploadImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(uploadError.message)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
}
