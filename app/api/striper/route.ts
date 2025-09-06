import { NextRequest, NextResponse } from 'next/server'
import { requestService } from '@/lib/firebaseService'

// 獲取所有 stripping 任務
export async function GET() {
  try {
    const allRequests = await requestService.getAllRequests()
    // 篩選出 stripping 相關的任務
    const striperRequests = allRequests.filter(request => 
      request.taskCategory === 'STRIPER' || 
      request.requestType.includes('STRIP') ||
      request.description.toLowerCase().includes('strip')
    )
    return NextResponse.json(striperRequests)
  } catch (error) {
    console.error('獲取 stripping 任務列表失敗:', error)
    return NextResponse.json([])
  }
}

// 創建新的 stripping 任務
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      roomNumber,
      guestName,
      requestType,
      priority,
      description,
      notes,
      location,
      createdById,
      assignedToId,
    } = body

    const newRequest = await requestService.createRequest({
      roomNumber,
      guestName,
      requestType,
      taskCategory: 'STRIPER', // 標記為 stripping 任務
      priority,
      description,
      notes,
      location,
      createdById,
      assignedToId,
    })

    if (newRequest) {
      return NextResponse.json(newRequest, { status: 201 })
    } else {
      return NextResponse.json(
        { error: '創建 stripping 任務失敗' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('創建 stripping 任務失敗:', error)
    return NextResponse.json(
      { error: '創建 stripping 任務失敗' },
      { status: 500 }
    )
  }
}
