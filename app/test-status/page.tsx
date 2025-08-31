'use client'

import React, { useState, useEffect } from 'react'
import { requestService } from '@/lib/firebaseService'

export default function TestStatusPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const allRequests = await requestService.getAllRequests()
      setRequests(allRequests)
      setTestResult(`Loaded ${allRequests.length} requests`)
    } catch (error) {
      setTestResult(`Error loading requests: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testStatusUpdate = async (requestId: string) => {
    try {
      setLoading(true)
      setTestResult(`Testing status update for request: ${requestId}`)
      
      // 测试更新状态
      const result = await requestService.updateRequest(requestId, {
        status: 'COMPLETED'
      })
      
      if (result) {
        setTestResult(`✅ Status updated successfully! New status: ${result.status}`)
        // 重新加载请求列表
        await loadRequests()
      } else {
        setTestResult('❌ Status update failed - service returned null')
      }
    } catch (error) {
      setTestResult(`❌ Status update error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Status Update Test</h1>
      
      <div className="mb-6">
        <button
          onClick={loadRequests}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {loading ? 'Loading...' : 'Reload Requests'}
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Test Result:</h2>
        <p className="text-sm">{testResult}</p>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                Room {request.roomNumber} - {request.requestType}
              </h3>
              <span className={`px-2 py-1 rounded text-xs ${
                request.status === 'PENDING' ? 'bg-yellow-200' :
                request.status === 'COMPLETED' ? 'bg-green-200' :
                'bg-gray-200'
              }`}>
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
            <div className="flex gap-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                Priority: {request.priority}
              </span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                ID: {request.id}
              </span>
            </div>
            {request.status === 'PENDING' && (
              <button
                onClick={() => testStatusUpdate(request.id)}
                disabled={loading}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                {loading ? 'Updating...' : 'Test Complete'}
              </button>
            )}
          </div>
        ))}
      </div>

      {requests.length === 0 && !loading && (
        <p className="text-gray-500">No requests found</p>
      )}
    </div>
  )
}
