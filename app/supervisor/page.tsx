'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Filter, Search, Clock, CheckCircle, AlertCircle, User, MapPin } from 'lucide-react'
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

interface User {
  id: string
  name: string
  role: string
}

export default function SupervisorPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchUsers()
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
        },
        {
          id: 'mock-3',
          roomNumber: '312',
          guestName: '黃先生',
          requestType: 'MAINTENANCE',
          priority: 'URGENT',
          status: 'PENDING',
          description: '空調不冷，需要維修',
          notes: '客人投訴房間太熱',
          location: '3樓',
          createdAt: new Date().toISOString(),
          completedAt: '',
          createdBy: { id: '1', name: '張主管' },
          assignedTo: null,
        }
      ]
      setRequests(mockData)
      toast.success('使用模擬數據（數據庫未連接）')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('API 請求失敗')
      }
      const data = await response.json()
      // 确保 data 是数组
      const usersArray = Array.isArray(data) ? data : []
      setUsers(usersArray.filter((user: User) => user.role === 'HOUSE_PERSON' || user.role === 'RUNNER'))
    } catch (error) {
      console.error('獲取用戶列表失敗:', error)
      // 使用模拟数据作为后备
      const mockUsers: User[] = [
        { id: '1', name: '李房務員', role: 'HOUSE_PERSON' },
        { id: '2', name: '王房務員', role: 'HOUSE_PERSON' },
        { id: '3', name: '陳跑腿', role: 'RUNNER' },
      ]
      setUsers(mockUsers)
      toast.success('使用模擬用戶數據（數據庫未連接）')
    }
  }

  const updateRequestStatus = async (requestId: string, status: string, assignedToId?: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, assignedToId }),
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

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter
    const matchesSearch = request.roomNumber?.includes(searchTerm) || 
                         request.guestName?.includes(searchTerm) ||
                         request.description.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="bg-white text-black px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm font-medium rounded"
              >
                ← HOME
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-black">需求管理系統</h1>
                <p className="text-sm text-gray-600">管理前台需求與任務分配</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-black px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-medium rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新增需求</span>
              <span className="sm:hidden">新增</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter and Search */}
        <div className="bg-white border-2 border-black p-4 sm:p-6 mb-6 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜尋房間號碼、客人姓名或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:border-black rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border-2 border-black focus:outline-none focus:border-black rounded min-w-[140px]"
              >
                <option value="all">所有狀態</option>
                <option value="PENDING">待處理</option>
                <option value="IN_PROGRESS">進行中</option>
                <option value="COMPLETED">已完成</option>
                <option value="CANCELLED">已取消</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-black p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">待處理</p>
                <p className="text-xl font-bold text-black">
                  {requests.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <AlertCircle className="w-5 h-5 text-black" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">進行中</p>
                <p className="text-xl font-bold text-black">
                  {requests.filter(r => r.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <CheckCircle className="w-5 h-5 text-black" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">已完成</p>
                <p className="text-xl font-bold text-black">
                  {requests.filter(r => r.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <User className="w-5 h-5 text-black" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">總計</p>
                <p className="text-xl font-bold text-black">{requests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b-2 border-black">
            <h2 className="text-lg font-bold text-black">需求列表</h2>
          </div>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">載入中...</p>
            </div>
          )}
          
          {!isLoading && filteredRequests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg font-medium">沒有找到符合條件的需求</p>
              <p className="text-sm mt-2">嘗試調整搜尋條件或篩選器</p>
            </div>
          )}
          
          {!isLoading && filteredRequests.length > 0 && (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {request.roomNumber ? `房間 ${request.roomNumber}` : '公共區域'}
                        </h3>
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
                        <span className="text-gray-400">
                          {new Date(request.createdAt).toLocaleString('zh-TW')}
                        </span>
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
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {request.status === 'PENDING' && (
                        <>
                          <select
                            onChange={(e) => updateRequestStatus(request.id, 'IN_PROGRESS', e.target.value)}
                            className="px-3 py-2 text-sm border-2 border-black focus:outline-none bg-white text-black rounded"
                          >
                            <option value="">分配給...</option>
                            {users.map(user => (
                              <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                            className="px-3 py-2 text-sm bg-green-500 text-white border-2 border-green-500 hover:bg-green-600 transition-colors rounded"
                          >
                            標記完成
                          </button>
                        </>
                      )}
                      
                      {request.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                          className="px-3 py-2 text-sm bg-green-500 text-white border-2 border-green-500 hover:bg-green-600 transition-colors rounded"
                        >
                          標記完成
                        </button>
                      )}
                      
                      {request.assignedTo && (
                        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                          <strong>分配給:</strong> {request.assignedTo.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 