import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const LoginPage = () => {
  const navigate = useNavigate()
  const { signIn, getUserRole } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      toast.error('Login failed: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Logged in successfully!')
    
    // Redirect based on role
    setTimeout(() => {
      const role = getUserRole()
      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/shop')
      }
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3EFE6] to-[#FDFBF7] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link to="/" className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dbt85chus/image/upload/v1767717725/Screenshot_from_2026-01-06_22-10-01_qbudwp.png"
              alt="Zouqly Logo"
              className="h-16 w-16 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <CardTitle className="text-2xl font-display text-[#2D4A3E]">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Zouqly account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg" data-testid="error-message">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#2D4A3E]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="email-input"
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#2D4A3E]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="password-input"
                className="rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
              disabled={loading}
              data-testid="login-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#666666]">Don't have an account? </span>
            <Link to="/signup" className="text-[#2D4A3E] hover:text-[#D4A017] font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
