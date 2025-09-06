'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Home, List, CheckCircle, Clock, MapPin, User, Phone, Radio, UserCheck, Calendar } from 'lucide-react'
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

export default function StriperPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [currentUser, setCurrentUser] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showCalendar, setShowCalendar] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    roomNumber: '',
    priority: 'MEDIUM',
    requestType: 'ROOM_STRIP', // 預設為 Room Strip
    description: '',
  })

  // Stripping 任務選項
  const striperItems = [
    { value: 'ROOM_STRIP', label: 'Room Strip' },
    { value: 'BATHROOM_STRIP', label: 'Bathroom Strip' },
    { value: 'BED_STRIP', label: 'Bed Strip' },
    { value: 'LINEN_STRIP', label: 'Linen Strip' },
    { value: 'DEEP_CLEAN', label: 'Deep Clean' },
    { value: 'CARPET_CLEAN', label: 'Carpet Clean' },
    { value: 'FURNITURE_CLEAN', label: 'Furniture Clean' },
    { value: 'WINDOW_CLEAN', label: 'Window Clean' },
    { value: 'BALCONY_CLEAN', label: 'Balcony Clean' },
    { value: 'MINIBAR_CLEAN', label: 'Minibar Clean' },
    { value: 'SAFE_CLEAN', label: 'Safe Clean' },
    { value: 'LIGHT_CLEAN', label: 'Light Clean' },
    { value: 'AC_CLEAN', label: 'AC Clean' },
    { value: 'VENT_CLEAN', label: 'Ventilation Clean' },
    { value: 'OTHER', label: 'Other' },
  ]

  useEffect(() => {
    fetchRequests()
    // Set current user as Striper
    setCurrentUser('Striper 1')
    setCurrentUserId('striper-user-id')
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/striper')
      if (!response.ok) {
        throw new Error('API request failed')
      }
      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch striper requests:', error)
      // Fallback mock data for stripping tasks
      const mockData: Request[] = [
        {
          id: 'mock-strip-1',
          roomNumber: '101',
          guestName: 'Mr. Chen',
          requestType: 'ROOM_STRIP',
          priority: 'HIGH',
          status: 'PENDING',
          description: 'Room 101 needs stripping - check out cleaning',
          notes: 'Guest checked out this morning, room needs full stripping',
          location: '1st Floor',
          createdAt: new Date().toISOString(),
          completedAt: '',
          createdBy: { id: '1', name: 'Supervisor' },
          assignedTo: null,
        },
        {
          id: 'mock-strip-2',
          roomNumber: '205',
          guestName: 'Ms. Lin',
          requestType: 'BATHROOM_STRIP',
          priority: 'MEDIUM',
          status: 'PENDING',
          description: 'Bathroom stripping required - deep clean needed',
          notes: 'Previous guest had special requirements',
          location: '2nd Floor',
          createdAt: new Date().toISOString(),
          completedAt: '',
          createdBy: { id: '1', name: 'Supervisor' },
          assignedTo: null,
        }
      ]
      setRequests(mockData)
      toast.success('Using mock data for stripping tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetch('/api/striper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdById: currentUserId,
        }),
      })

      if (response.ok) {
        toast.success('Request created successfully')
        setShowCreateForm(false)
        setFormData({
          roomNumber: '',
          priority: 'MEDIUM',
          requestType: 'ROOM_STRIP',
          description: '',
        })
        await fetchRequests()
      } else {
        toast.error('Failed to create request')
      }
    } catch (error) {
      toast.error('Failed to create request')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      setIsLoading(true)
      console.log('=== UPDATE REQUEST STATUS ===')
      console.log('Request ID:', requestId)
      console.log('New Status:', status)
      console.log('Current requests:', requests)
      
      // 验证请求ID是否存在
      const requestExists = requests.find(req => req.id === requestId)
      if (!requestExists) {
        console.error('Request not found in local state:', requestId)
        toast.error('Request not found')
        return
      }
      
      console.log('Found request:', requestExists)
      
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Update result:', result)
        toast.success('Status updated successfully')
        
        // 立即更新本地状态
        setRequests(prevRequests => {
          const updated = prevRequests.map(req => 
            req.id === requestId 
              ? { 
                  ...req, 
                  status, 
                  completedAt: status === 'COMPLETED' ? new Date().toISOString() : req.completedAt 
                }
              : req
          )
          console.log('Updated local state:', updated)
          return updated
        })
        
        // 不自動切換到 completed 標籤頁
        // 讓用戶手動切換
      } else {
        const errorData = await response.json()
        console.error('Update failed:', errorData)
        toast.error(`Failed to update status: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Update request error:', error)
      toast.error('Failed to update status: Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'IN_PROGRESS': return 'bg-gray-200 text-gray-800 border-gray-400'
      case 'COMPLETED': return 'bg-gray-300 text-gray-800 border-gray-500'
      case 'CANCELLED': return 'bg-gray-100 text-gray-600 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-300' // 莫兰迪红色
      case 'HIGH': return 'bg-orange-300' // 莫兰迪橙色
      case 'MEDIUM': return 'bg-yellow-300' // 莫兰迪黄色
      case 'LOW': return 'bg-green-300' // 莫兰迪绿色
      default: return 'bg-gray-300'
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

  // 篩選請求的函數
  const filterRequests = (requests: Request[]) => {
    let filtered = requests

    // 按狀態篩選
    if (activeTab === 'pending') {
      filtered = filtered.filter(r => r.status === 'PENDING')
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(r => r.status === 'COMPLETED')
    }

    // 按日期篩選
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate)
      filtered = filtered.filter(r => {
        const requestDate = new Date(r.createdAt)
        return requestDate.toDateString() === selectedDateObj.toDateString()
      })
    }

    return filtered
  }

  // Filter requests by status and sort by priority
  const pendingRequests = filterRequests(requests)
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => {
      const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const completedRequests = filterRequests(requests)
    .filter(r => r.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests
      case 'completed': return completedRequests
      default: return pendingRequests
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-white text-black px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm font-medium rounded"
              >
                ← HOME
              </Link>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-gray-600" />
                <h1 className="text-xl font-bold text-black">RUNIT</h1>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Striper Dashboard - Room Stripping Management</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {/* Quick Statistics */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-black p-3 text-center rounded-lg">
              <div className="text-xl font-bold text-black">
                {activeTab === 'pending' ? pendingRequests.length : completedRequests.length}
              </div>
              <div className="text-xs text-gray-600">
                {activeTab === 'pending' ? 'PENDING' : 'COMPLETED'}
              </div>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center rounded-lg">
              <div className="text-xl font-bold text-black">
                {requests.filter(r => r.status === 'COMPLETED').length}
              </div>
              <div className="text-xs text-gray-600">TOTAL COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Calendar Filter */}
        <div className="px-4 mb-4">
          <div className="bg-white border-2 border-black p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Select date to filter"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* New Request Button - Only show in PENDING tab */}
        {activeTab === 'pending' && (
          <div className="px-4 mb-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-white text-black py-4 px-4 border-2 border-black hover:bg-black hover:text-white transition-colors font-medium flex items-center justify-center gap-2 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              <span>NEW REQUEST</span>
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="px-4">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading...</p>
            </div>
          )}
          
          {!isLoading && getCurrentRequests().map((request) => (
            <div key={request.id} className="bg-white border-2 border-black p-4 mb-4 rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {request.roomNumber ? `Room ${request.roomNumber}` : 'Public Area'}
                  </h3>
                </div>
                <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(request.status)}`}>
                  {request.status === 'PENDING' && 'PENDING'}
                  {request.status === 'IN_PROGRESS' && 'IN PROGRESS'}
                  {request.status === 'COMPLETED' && 'COMPLETED'}
                  {request.status === 'CANCELLED' && 'CANCELLED'}
                </span>
              </div>
              
              {request.guestName && (
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Guest: {request.guestName}
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
                  <strong>Notes:</strong> {request.notes}
                </p>
              )}
              
              {request.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateRequestStatus(request.id!, 'COMPLETED')}
                    disabled={isLoading}
                    className={`flex-1 py-2 px-3 border-2 border-black text-sm font-medium transition-all duration-200 rounded ${
                      isLoading 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-black hover:text-white active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        UPDATING...
                      </span>
                    ) : (
                      'COMPLETED'
                    )}
                  </button>
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-3">
                {new Date(request.createdAt).toLocaleString('en-US')}
              </div>
            </div>
          ))}
          
          {!isLoading && getCurrentRequests().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg font-medium">
                {activeTab === 'pending' && 'No pending requests'}
                {activeTab === 'completed' && 'No completed tasks'}
              </p>
              <p className="text-sm mt-2">
                {activeTab === 'pending' && 'New room stripping requests will appear here'}
                {activeTab === 'completed' && 'Completed tasks will appear here'}
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
                <h2 className="text-lg font-bold text-black">New Request</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-black hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={createRequest} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Room Number *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className="w-full px-3 py-3 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  placeholder="e.g. 101"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-3 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              
              {/* Order 選單已隱藏，預設使用 Room Strip */}
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-3 border-2 border-black focus:outline-none focus:border-black bg-white text-black rounded"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors rounded font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Request'}
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
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-4 flex flex-col items-center transition-colors ${
              activeTab === 'pending' ? 'text-black' : 'text-gray-600'
            }`}
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">PENDING</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 flex flex-col items-center transition-colors ${
              activeTab === 'completed' ? 'text-black' : 'text-gray-600'
            }`}
          >
            <CheckCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">COMPLETED</span>
          </button>
        </div>
      </div>
    </div>
  )
}
