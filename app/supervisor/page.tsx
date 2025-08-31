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

  useEffect(() => {
    fetchRequests()
    fetchUsers()
  }, [])

  const fetchRequests = async () => {
    try {
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
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, assignedToId }),
      })

      if (response.ok) {
        toast.success('狀態更新成功')
        fetchRequests()
      } else {
        toast.error('更新失敗')
      }
    } catch (error) {
      toast.error('更新失敗')
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
      case 'PENDING': return 'bg-white text-black'
      case 'IN_PROGRESS': return 'bg-white text-black'
      case 'COMPLETED': return 'bg-white text-black'
      case 'CANCELLED': return 'bg-white text-black'
      default: return 'bg-white text-black'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-black'
      case 'HIGH': return 'bg-black'
      case 'MEDIUM': return 'bg-black'
      case 'LOW': return 'bg-black'
      default: return 'bg-black'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="bg-white text-black px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm"
              >
                ← HOME
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-black">REQUEST MANAGEMENT</h1>
                <p className="text-gray-600">Manage front desk requests and task assignments</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-black px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              NEW REQUEST
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Search */}
        <div className="bg-white border-2 border-black p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search room number, guest name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border-2 border-black focus:outline-none focus:border-black"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PENDING</p>
                <p className="text-2xl font-bold text-black">
                  {requests.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <AlertCircle className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">IN PROGRESS</p>
                <p className="text-2xl font-bold text-black">
                  {requests.filter(r => r.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">COMPLETED</p>
                <p className="text-2xl font-bold text-black">
                  {requests.filter(r => r.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center">
              <div className="p-2 border-2 border-black rounded-lg">
                <User className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">TOTAL</p>
                <p className="text-2xl font-bold text-black">{requests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="bg-white border-2 border-black">
          <div className="px-6 py-4 border-b-2 border-black">
            <h2 className="text-lg font-bold text-black">REQUEST LIST</h2>
          </div>
          <div className="divide-y divide-black">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                                             <h3 className="text-lg font-medium text-gray-900">
                         {request.roomNumber ? `Room ${request.roomNumber}` : 'Public Area'}
                       </h3>
                                             <span className="px-2 py-1 text-xs font-medium border-2 border-black bg-white text-black">
                         {request.status === 'PENDING' && 'PENDING'}
                         {request.status === 'IN_PROGRESS' && 'IN PROGRESS'}
                         {request.status === 'COMPLETED' && 'COMPLETED'}
                         {request.status === 'CANCELLED' && 'CANCELLED'}
                       </span>
                    </div>
                    
                                         {request.guestName && (
                       <p className="text-sm text-gray-600 mb-2">
                         <User className="w-4 h-4 inline mr-1 text-black" />
                         Guest: {request.guestName}
                       </p>
                     )}
                    
                    <p className="text-gray-700 mb-3">{request.description}</p>
                    
                                         <div className="flex items-center gap-4 text-sm text-gray-500">
                       <span>Type: {request.requestType}</span>
                       <span>Priority: {request.priority}</span>
                       <span>Created: {new Date(request.createdAt).toLocaleString('en-US')}</span>
                       {request.location && (
                         <span className="flex items-center">
                           <MapPin className="w-4 h-4 mr-1 text-black" />
                           {request.location}
                         </span>
                       )}
                     </div>
                    
                                         {request.notes && (
                       <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 border border-black">
                         Notes: {request.notes}
                       </p>
                     )}
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    {request.status === 'PENDING' && (
                      <>
                                                 <select
                           onChange={(e) => updateRequestStatus(request.id, 'IN_PROGRESS', e.target.value)}
                           className="px-3 py-1 text-sm border-2 border-black focus:outline-none bg-white text-black"
                         >
                           <option value="">Assign to...</option>
                           {users.map(user => (
                             <option key={user.id} value={user.id}>{user.name}</option>
                           ))}
                         </select>
                         <button
                           onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                           className="px-3 py-1 text-sm bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                         >
                           MARK COMPLETE
                         </button>
                      </>
                    )}
                    
                                         {request.status === 'IN_PROGRESS' && (
                       <button
                         onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                         className="px-3 py-1 text-sm bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                       >
                         MARK COMPLETE
                       </button>
                     )}
                    
                                         {request.assignedTo && (
                       <p className="text-sm text-gray-600">
                         Assigned to: {request.assignedTo.name}
                       </p>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 