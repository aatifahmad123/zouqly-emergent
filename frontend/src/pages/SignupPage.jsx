import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, 'user')
    
    if (error) {
      setError(error.message)
      toast.error('Signup failed: ' + error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    toast.success('Account created! Please check your email to confirm.')
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3EFE6] to-[#FDFBF7] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <div>
                <h3 className="font-display text-2xl font-bold text-[#2D4A3E] mb-2">
                  Account Created!
                </h3>
                <p className="text-[#666666] mb-4">
                  Please check your email and click the confirmation link to activate your account.
                </p>
                <p className="text-sm text-[#666666]">
                  Once confirmed, you can login and start shopping!
                </p>
              </div>
              <Link to="/login" className="mt-4">
                <Button className="bg-[#2D4A3E] text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3EFE6] to-[#FDFBF7] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dbt85chus/image/upload/v1767717725/Screenshot_from_2026-01-06_22-10-01_qbudwp.png"
              alt="Zouqly Logo"
              className="h-16 w-16 rounded-xl"
            />
          </div>
          <CardTitle className="text-2xl font-display text-[#2D4A3E]">Create Account</CardTitle>
          <CardDescription>Sign up to start shopping at Zouqly</CardDescription>
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#2D4A3E]">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                data-testid="confirm-password-input"
                className="rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
              disabled={loading}
              data-testid="signup-button"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#666666]">Already have an account? </span>
            <Link to="/login" className="text-[#2D4A3E] hover:text-[#D4A017] font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage
