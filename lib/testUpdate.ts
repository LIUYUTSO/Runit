import { requestService } from './firebaseService'

async function testUpdate() {
  console.log('Testing Firebase update operation...')
  
  try {
    // 首先获取所有请求
    const allRequests = await requestService.getAllRequests()
    console.log('All requests:', allRequests)
    
    if (allRequests.length === 0) {
      console.log('No requests found. Creating a test request first...')
      
      // 创建一个测试请求
      const testRequest = await requestService.createRequest({
        roomNumber: 'TEST-101',
        requestType: 'KING_SHEET',
        priority: 'MEDIUM',
        description: 'Test request for update',
        createdById: 'test-user-id'
      })
      
      console.log('Created test request:', testRequest)
      
      if (testRequest) {
        // 测试更新
        const updatedRequest = await requestService.updateRequest(testRequest.id!, {
          status: 'COMPLETED'
        })
        
        console.log('Updated request result:', updatedRequest)
      }
    } else {
      // 使用第一个请求进行测试
      const firstRequest = allRequests[0]
      console.log('Testing update with first request:', firstRequest.id)
      
      const updatedRequest = await requestService.updateRequest(firstRequest.id!, {
        status: 'COMPLETED'
      })
      
      console.log('Updated request result:', updatedRequest)
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// 如果直接运行此文件
if (typeof window === 'undefined') {
  testUpdate()
}

export { testUpdate }
