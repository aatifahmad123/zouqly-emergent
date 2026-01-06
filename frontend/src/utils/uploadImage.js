import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

export const uploadImage = async (file, token) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('Uploading file via backend...')

    const response = await axios.post(`${API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('Upload response:', response.data)

    if (response.data.success) {
      return {
        success: true,
        url: response.data.url
      }
    } else {
      return {
        success: false,
        error: response.data.error || 'Upload failed'
      }
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to upload image'
    }
  }
}
