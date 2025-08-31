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
    }
  }

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
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
        fetchRequests()
      } else {
        toast.error('創建失敗')
      }
    } catch (error) {
      toast.error('創建失敗')
    }
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
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

  const myTasks = requests.filter(r => 
    r.assignedTo?.name === currentUser && r.status !== 'COMPLETED'
  )

  const completedTasks = requests.filter(r => 
    r.assignedTo?.name === currentUser && r.status === 'COMPLETED'
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-white text-black px-3 py-1 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm"
              >
                ← HOME
              </Link>
              <h1 className="text-xl font-bold text-black">RUNIT</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-black p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser}</p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="pb-20">
        {/* Quick Statistics */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border-2 border-black p-4 text-center">
              <div className="text-2xl font-bold text-black">
                {myTasks.length}
              </div>
              <div className="text-sm text-gray-600">MY TASKS</div>
            </div>
            <div className="bg-white border-2 border-black p-4 text-center">
              <div className="text-2xl font-bold text-black">
                {requests.filter(r => r.status === 'PENDING').length}
              </div>
              <div className="text-sm text-gray-600">PENDING</div>
            </div>
            <div className="bg-white border-2 border-black p-4 text-center">
              <div className="text-2xl font-bold text-black">
                {completedTasks.length}
              </div>
              <div className="text-sm text-gray-600">COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mb-4">
          <div className="bg-white border-2 border-black p-1 flex">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              MY TASKS
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              COMPLETED
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="px-4">
          {(activeTab === 'tasks' ? myTasks : completedTasks).map((request) => (
            <div key={request.id} className="bg-white border-2 border-black p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                                     <h3 className="font-medium text-gray-900">
                     {request.roomNumber ? `Room ${request.roomNumber}` : 'Public Area'}
                   </h3>
                 </div>
                 <span className="px-2 py-1 text-xs font-medium border-2 border-black bg-white text-black">
                   {request.status === 'PENDING' && 'PENDING'}
                   {request.status === 'IN_PROGRESS' && 'IN PROGRESS'}
                   {request.status === 'COMPLETED' && 'COMPLETED'}
                   {request.status === 'CANCELLED' && 'CANCELLED'}
                 </span>
              </div>
              
                             {request.guestName && (
                 <p className="text-sm text-gray-600 mb-2 flex items-center">
                   <User className="w-4 h-4 mr-1 text-black" />
                   Guest: {request.guestName}
                 </p>
               )}
              
              <p className="text-gray-700 mb-3">{request.description}</p>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{request.requestType}</span>
                <span>{request.priority}</span>
                {request.location && (
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-black" />
                    {request.location}
                  </span>
                )}
              </div>
              
                             {request.notes && (
                 <p className="text-sm text-gray-600 bg-gray-50 p-2 border border-black mb-3">
                   Notes: {request.notes}
                 </p>
               )}
              
              {request.status !== 'COMPLETED' && (
                <div className="flex gap-2">
                                     {request.status === 'PENDING' && (
                     <button
                       onClick={() => updateRequestStatus(request.id, 'IN_PROGRESS')}
                       className="flex-1 bg-white text-black py-2 px-3 border-2 border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
                     >
                       START WORKING
                     </button>
                   )}
                   {request.status === 'IN_PROGRESS' && (
                     <button
                       onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                       className="flex-1 bg-white text-black py-2 px-3 border-2 border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
                     >
                       MARK COMPLETE
                     </button>
                   )}
                </div>
              )}
              
                             <div className="text-xs text-gray-400 mt-3">
                 {new Date(request.createdAt).toLocaleString('en-US')}
               </div>
            </div>
          ))}
          
                     {(activeTab === 'tasks' ? myTasks : completedTasks).length === 0 && (
             <div className="text-center py-8 text-gray-500">
               {activeTab === 'tasks' ? 'No pending tasks' : 'No completed tasks'}
             </div>
           )}
        </div>
      </div>

             {/* Create Request Form */}
       {showCreateForm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
           <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-2xl">
             <div className="p-4 border-b-2 border-black">
               <div className="flex items-center justify-between">
                 <h2 className="text-lg font-bold text-black">NEW REQUEST</h2>
                 <button
                   onClick={() => setShowCreateForm(false)}
                   className="text-black hover:text-gray-600"
                 >
                   ✕
                 </button>
               </div>
             </div>
            
                         <form onSubmit={createRequest} className="p-4 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   ROOM NUMBER
                 </label>
                 <input
                   type="text"
                   value={formData.roomNumber}
                   onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                   placeholder="e.g. 101"
                 />
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   GUEST NAME
                 </label>
                 <input
                   type="text"
                   value={formData.guestName}
                   onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                   placeholder="Guest name"
                 />
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   REQUEST TYPE
                 </label>
                 <select
                   value={formData.requestType}
                   onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                 >
                   <option value="HOUSEKEEPING">Housekeeping</option>
                   <option value="MAINTENANCE">Maintenance</option>
                   <option value="AMENITIES">Amenities</option>
                   <option value="CLEANING">Cleaning</option>
                   <option value="TURNDOWN">Turndown Service</option>
                   <option value="OTHER">Other</option>
                 </select>
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   PRIORITY
                 </label>
                 <select
                   value={formData.priority}
                   onChange={(e) => setFormData({...formData, priority: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                 >
                   <option value="LOW">Low</option>
                   <option value="MEDIUM">Medium</option>
                   <option value="HIGH">High</option>
                   <option value="URGENT">Urgent</option>
                 </select>
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   LOCATION
                 </label>
                 <input
                   type="text"
                   value={formData.location}
                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                   placeholder="e.g. Lobby, Restaurant, Gym"
                 />
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   DESCRIPTION
                 </label>
                 <textarea
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                   rows={3}
                   placeholder="Please describe the request in detail..."
                   required
                 />
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-black mb-1">
                   NOTES
                 </label>
                 <textarea
                   value={formData.notes}
                   onChange={(e) => setFormData({...formData, notes: e.target.value})}
                   className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-black bg-white text-black"
                   rows={2}
                   placeholder="Additional notes..."
                 />
               </div>
              
                             <div className="flex gap-3 pt-4">
                 <button
                   type="button"
                   onClick={() => setShowCreateForm(false)}
                   className="flex-1 py-3 px-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
                 >
                   CANCEL
                 </button>
                 <button
                   type="submit"
                   className="flex-1 py-3 px-4 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                 >
                   CREATE REQUEST
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
            className={`flex-1 py-3 px-4 flex flex-col items-center ${
              activeTab === 'tasks' ? 'text-black' : 'text-gray-600'
            }`}
          >
                         <List className="w-5 h-5 mb-1 text-black" />
            <span className="text-xs">TASKS</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 flex flex-col items-center ${
              activeTab === 'completed' ? 'text-black' : 'text-gray-600'
            }`}
          >
                         <CheckCircle className="w-5 h-5 mb-1 text-black" />
            <span className="text-xs">COMPLETED</span>
          </button>
        </div>
      </div>
    </div>
  )
} 