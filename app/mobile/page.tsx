'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Home, List, CheckCircle, Clock, MapPin, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

interface Request {
  id: string
  roomNumber: string
  guestName: string
  requestType: string
  priority: string
  status: string
  description: string
  notes: string
  location: string
  createdAt: string
  completedAt: string
  createdBy: {
    id: string
    name: string
  }
  assignedTo: {
    id: string
    name: string
  } | null
}

export default function MobilePage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')
  const [currentUser, setCurrentUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    roomNumber: '',
    guestName: '',
    requestType: 'HOUSEKEEPING',
    priority: 'MEDIUM',
    description: '',
    notes: '',
    location: '',
  })

  useEffect(() => {
    fetchRequests()
    // 模拟当前用户
    setCurrentUser('House Person 1')
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/requests')
      if (!response.ok) {
        throw new Error('API 請求失敗')
      }
      const data = await response.json()
      // 确保 data 是数组
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('獲取需求列表失敗:', error)
      // 使用模拟数据作为后备
      const mockData: Request[] = [
        {
          id: 'mock-1',
          roomNumber: '101',
          guestName: '陳先生',
          requestType: 'HOUSEKEEPING',
          priority: 'HIGH',
          status: 'PENDING',
          description: '需要額外的毛巾和浴袍',
          notes: '客人明天早上需要',
          location: '1樓',
          createdAt: new Date().toISOString(),
          completedAt: '',
          createdBy: { id: '1', name: '張主管' },
          assignedTo: null,
        },
        {
          id: 'mock-2',
          roomNumber: '205',
          guestName: '林小姐',
          requestType: 'AMENITIES',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          description: '需要補充洗髮精和沐浴乳',
          notes: '',
          location: '2樓',
          createdAt: new Date().toISOString(),
          completedAt: '',
          createdBy: { id: '1', name: '張主管' },
          assignedTo: { id: '2', name: '李房務員' },
        }
      ]
      setRequests(mockData)
      toast.success('使用模擬數據（數據庫未連接）')
    } finally {
      setIsLoading(false)
    }
  }

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdById: 'temp-user-id', // 实际应用中应该从认证系统获取
        }),
      })

      if (response.ok) {
        toast.success('需求創建成功')
        setShowCreateForm(false)
        setFormData({
          roomNumber: '',
          guestName: '',
          requestType: 'HOUSEKEEPING',
          priority: 'MEDIUM',
          description: '',
          notes: '',
          location: '',
        })
        // 立即重新获取数据
        await fetchRequests()
      } else {
        toast.error('創建失敗')
      }
    } catch (error) {
      toast.error('創建失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('狀態更新成功')
        await fetchRequests()
      } else {
        toast.error('更新失敗')
      }
    } catch (error) {
      toast.error('更新失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500'
      case 'HIGH': return 'bg-orange-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'LOW': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityOrder = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 0
      case 'HIGH': return 1
      case 'MEDIUM': return 2
      case 'LOW': return 3
      default: return 4
    }
  }

  // 按优先级排序的任务
  const myTasks = requests
    .filter(r => r.assignedTo?.name === currentUser && r.status !== 'COMPLETED')
    .sort((a, b) => {
      // 首先按优先级排序
      const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
      if (priorityDiff !== 0) return priorityDiff
      // 然后按创建时间排序（最新的在前）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const completedTasks = requests
    .filter(r => r.assignedTo?.name === currentUser && r.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - 响应式设计 */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-white text-black px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
              >
                ← HOME
              </Link>
              <h1 className="text-xl font-bold text-black">RUNIT</h1>
            </div>
            {/* 新增按钮占满剩余空间 */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex-1 ml-4 bg-white text-black py-3 px-4 border-2 border-black hover:bg-black hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">新增需求</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Welcome back, {currentUser}</p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="pb-20">
        {/* Quick Statistics */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border-2 border-black p-3 text-center rounded-lg">
              <div className="text-xl font-bold text-black">
                {myTasks.length}
              </div>
              <div className="text-xs text-gray-600">我的任務</div>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center rounded-lg">
              <div className="text-xl font-bold text-black">
                {requests.filter(r => r.status === 'PENDING').length}
              </div>
              <div className="text-xs text-gray-600">待處理</div>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center rounded-lg">
              <div className="text-xl font-bold text-black">
                {completedTasks.length}
              </div>
              <div className="text-xs text-gray-600">已完成</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mb-4">
          <div className="bg-white border-2 border-black p-1 flex rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              我的任務
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              已完成
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="px-4">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">載入中...</p>
            </div>
          )}
          
          {!isLoading && (activeTab === 'tasks' ? myTasks : completedTasks).map((request) => (
            <div key={request.id} className="bg-white border-2 border-black p-4 mb-4 rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {request.roomNumber ? `房間 ${request.roomNumber}` : '公共區域'}
                  </h3>
                </div>
                <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(request.status)}`}>
                  {request.status === 'PENDING' && '待處理'}
                  {request.status === 'IN_PROGRESS' && '進行中'}
                  {request.status === 'COMPLETED' && '已完成'}
                  {request.status === 'CANCELLED' && '已取消'}
                </span>
              </div>
              
              {request.guestName && (
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  客人: {request.guestName}
                </p>
              )}
              
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{request.description}</p>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                <span className="bg-gray-100 px-2 py-1 rounded">{request.requestType}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{request.priority}</span>
                {request.location && (
                  <span className="flex items-center bg-gray-100 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3 mr-1" />
                    {request.location}
                  </span>
                )}
              </div>
              
              {request.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-200 rounded mb-3">
                  <strong>備註:</strong> {request.notes}
                </p>
              )}
              
              {request.status !== 'COMPLETED' && (
                <div className="flex gap-2">
                  {request.status === 'PENDING' && (
                    <button
                      onClick={() => updateRequestStatus(request.id, 'IN_PROGRESS')}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 border-2 border-blue-500 text-sm font-medium hover:bg-blue-600 transition-colors rounded"
                    >
                      開始工作
                    </button>
                  )}
                  {request.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                      className="flex-1 bg-green-500 text-white py-2 px-3 border-2 border-green-500 text-sm font-medium hover:bg-green-600 transition-colors rounded"
                    >
                      標記完成
                    </button>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-3">
                {new Date(request.createdAt).toLocaleString('zh-TW')}
              </div>
            </div>
          ))}
          
          {!isLoading && (activeTab === 'tasks' ? myTasks : completedTasks).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg font-medium">
                {activeTab === 'tasks' ? '目前沒有待處理的任務' : '還沒有完成的任務'}
              </p>
              <p className="text-sm mt-2">
                {activeTab === 'tasks' ? '主管會為您分配新的任務' : '完成任務後會顯示在這裡'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-2xl">
            <div className="p-4 border-b-2 border-black sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-black">新增需求</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-black hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={createRequest} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    房間號碼
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                    placeholder="例如: 101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    客人姓名
                  </label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                    placeholder="客人姓名"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    需求類型
                  </label>
                  <select
                    value={formData.requestType}
                    onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  >
                    <option value="HOUSEKEEPING">客房服務</option>
                    <option value="MAINTENANCE">維修</option>
                    <option value="AMENITIES">備品</option>
                    <option value="CLEANING">清潔</option>
                    <option value="TURNDOWN">開床服務</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    優先級
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  >
                    <option value="LOW">低</option>
                    <option value="MEDIUM">中</option>
                    <option value="HIGH">高</option>
                    <option value="URGENT">緊急</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  位置
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  placeholder="例如: 大廳、餐廳、健身房"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  rows={3}
                  placeholder="請詳細描述需求..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  備註
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  rows={2}
                  placeholder="額外備註..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors rounded font-medium disabled:opacity-50"
                >
                  {isLoading ? '創建中...' : '創建需求'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black">
        <div className="flex">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-4 flex flex-col items-center transition-colors ${
              activeTab === 'tasks' ? 'text-black' : 'text-gray-600'
            }`}
          >
            <List className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">任務</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 flex flex-col items-center transition-colors ${
              activeTab === 'completed' ? 'text-black' : 'text-gray-600'
            }`}
          >
            <CheckCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">已完成</span>
          </button>
        </div>
      </div>
    </div>
  )
} 