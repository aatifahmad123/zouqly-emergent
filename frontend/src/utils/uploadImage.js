import { supabase } from '../config/supabase'

export const uploadImage = async (file) => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    console.log('Uploading file:', filePath)

    // Upload file to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: uploadError.message || 'Upload failed'
      }
    }

    console.log('Upload successful, data:', data)

    // Get the public URL using the path from upload response
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path || filePath)

    console.log('Public URL:', urlData.publicUrl)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
}
