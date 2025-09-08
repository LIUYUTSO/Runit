'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Radio, Eye, EyeOff, User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService, AuthUser } from '@/lib/authService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 檢查是否已經登入
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
        // 根據用戶角色重定向到相應頁面
        redirectBasedOnRole(user.role)
      } else {
        setCurrentUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'SUPERVISOR':
        router.push('/supervisor')
        break
      case 'RUNNER':
        router.push('/runner')
        break
      case 'STRIPER':
        router.push('/striper')
        break
      case 'HOUSE_PERSON':
        router.push('/runner') // 預設重定向到 runner
        break
      default:
        router.push('/runner')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('請輸入電子郵件和密碼')
      return
    }

    try {
      setIsLoading(true)
      console.log('=== LOGIN ATTEMPT ===')
      console.log('Email:', email)
      
      const user = await authService.signIn(email, password)
      
      if (user) {
        console.log('Login successful:', user)
        toast.success(`歡迎回來，${user.name}！`)
        
        // 顯示登入統計
        if (user.loginCount && user.loginCount > 1) {
          toast.success(`這是您第 ${user.loginCount} 次登入`)
        }
        
        // 重定向到相應頁面
        redirectBasedOnRole(user.role)
      } else {
        toast.error('登入失敗，請檢查您的憑證')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorMessage = '登入失敗'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = '找不到此電子郵件地址的帳戶'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = '密碼錯誤'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '電子郵件格式無效'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '嘗試次數過多，請稍後再試'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = '網路連線失敗，請檢查網路'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      toast.success('已成功登出')
      setCurrentUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('登出失敗')
    }
  }

  // 如果已經登入，顯示用戶資訊
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border-2 border-black p-8 rounded-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">RUNIT</h1>
            <p className="text-gray-600">您已登入</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-black mb-2">用戶資訊</h3>
              <p className="text-sm text-gray-600"><strong>姓名:</strong> {currentUser.name}</p>
              <p className="text-sm text-gray-600"><strong>角色:</strong> {currentUser.role}</p>
              <p className="text-sm text-gray-600"><strong>電子郵件:</strong> {currentUser.email}</p>
              {currentUser.loginCount && (
                <p className="text-sm text-gray-600"><strong>登入次數:</strong> {currentUser.loginCount}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => redirectBasedOnRole(currentUser.role)}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              進入系統
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border-2 border-black p-8 rounded-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">RUNIT</h1>
          <p className="text-gray-600">Hotel Housekeeping Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              電子郵件
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                placeholder="請輸入您的電子郵件"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              密碼
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                placeholder="請輸入您的密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                登入中...
              </span>
            ) : (
              '登入'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            請使用您的 Firebase Authentication 帳戶登入
          </p>
        </div>
      </div>
    </div>
  )
}
